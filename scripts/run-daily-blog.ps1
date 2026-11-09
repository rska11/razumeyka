param(
  [switch]$Run,
  [switch]$SmokeTest,
  [switch]$RecrawlOnly
)

$ErrorActionPreference = 'Stop'
$workspacePath = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
Set-Location -LiteralPath $workspacePath
$statePath = Join-Path $workspacePath '.daily-blog'
[IO.Directory]::CreateDirectory($statePath) | Out-Null
$moscowZone = [TimeZoneInfo]::FindSystemTimeZoneById('Russian Standard Time')
$today = [TimeZoneInfo]::ConvertTimeFromUtc([DateTime]::UtcNow, $moscowZone).ToString('yyyy-MM-dd')
if ($RecrawlOnly) {
  try { $recrawlLock = [IO.File]::Open((Join-Path $statePath 'recrawl.lock'), [IO.FileMode]::OpenOrCreate, [IO.FileAccess]::ReadWrite, [IO.FileShare]::None) }
  catch [IO.IOException] { exit 0 }
  try {
    $ErrorActionPreference = 'Continue'
    & node scripts/yandex-recrawl.mjs --retry-pending *> (Join-Path $statePath 'recrawl-latest.log')
    exit $LASTEXITCODE
  } finally { $recrawlLock.Dispose() }
}
$codexPath = Join-Path $statePath 'cli/node_modules/.bin/codex.cmd'
if (!(Test-Path -LiteralPath $codexPath)) { $codexPath = (Get-Command codex.cmd -ErrorAction Stop).Source }

# CLI 0.143 reports login status on stderr; capture it without printing credentials.
$priorPreference = $ErrorActionPreference
$ErrorActionPreference = 'Continue'
$login = (& $codexPath login status 2>&1 | Out-String)
$loginExit = $LASTEXITCODE
$ErrorActionPreference = $priorPreference
if ($loginExit -ne 0 -or $login -notmatch 'Logged in using ChatGPT') {
  throw 'Codex must be signed in using ChatGPT. API-key billing is not allowed by this task.'
}

$lockFile = Join-Path $statePath 'run.lock'
try {
  $lockHandle = [IO.File]::Open($lockFile, [IO.FileMode]::OpenOrCreate, [IO.FileAccess]::ReadWrite, [IO.FileShare]::None)
} catch [IO.IOException] {
  Write-Output 'Another daily blog run is active; skipping.'
  exit 0
}

try {
  if (!$Run -and !$SmokeTest) {
    & node scripts/yandex-recrawl.mjs --check
    if ($LASTEXITCODE -ne 0) { throw 'Webmaster connection check failed.' }
    Write-Output 'Preflight OK. Use -Run for an article or -SmokeTest for a harmless subscription test.'
    exit 0
  }

  $resultPath = Join-Path $statePath "$today-result.json"
  if ($SmokeTest) {
    $resultPath = Join-Path $statePath 'smoke-test.txt'
    $prompt = 'This is a harmless scheduled-execution smoke test. Do not read or change files, do not run tools, do not make network requests or publish anything. Reply with exactly SUBSCRIPTION_READY.'
  } else {
    $todayJson = & node --no-warnings scripts/daily-blog-state.mjs --find-today
    if ($LASTEXITCODE -ne 0) { throw 'Could not check whether today already has a live article.' }
    $todayState = $todayJson | ConvertFrom-Json
    if ($todayState.published) {
      $completedPath = Join-Path $statePath "$today-completed.json"
      if (!(Test-Path -LiteralPath $completedPath)) {
        & node scripts/yandex-recrawl.mjs --enqueue $todayState.url 'https://znayton.ru/blog'
        if ($LASTEXITCODE -ne 0) { throw 'Could not save recrawl queue.' }
        $todayState | ConvertTo-Json | Set-Content -LiteralPath $completedPath -Encoding UTF8
      }
      Write-Output 'An article was already published today; skipping.'
      exit 0
    }
    $branch = (& git branch --show-current | Out-String).Trim()
    if ($branch -ne 'nextjs-migration') { throw 'Wrong source branch; refusing to publish.' }
    $snapshotFile = Join-Path $statePath "$today-resume.json"
    & node scripts/daily-blog-state.mjs --check-worktree $snapshotFile
    if ($LASTEXITCODE -ne 0) { throw 'Unfinished changes cannot be safely attributed to the previous daily run.' }
    $attemptFile = Join-Path $statePath "$today-attempts.json"
    $attempt = 1
    if (Test-Path -LiteralPath $attemptFile) { $attempt = ([IO.File]::ReadAllText($attemptFile) | ConvertFrom-Json).count + 1 }
    if ($attempt -gt 4) { throw 'Daily limit of four subscription attempts reached. Review the failure report.' }
    @{ count = $attempt; startedAt = [DateTime]::UtcNow.ToString('o') } | ConvertTo-Json | Set-Content -LiteralPath $attemptFile -Encoding UTF8
    $resultPath = Join-Path $statePath "$today-attempt-$attempt-result.json"
    $prompt = [IO.File]::ReadAllText((Join-Path $workspacePath 'docs/DAILY-BLOG-PROMPT.md'))
    $prompt += "`nCurrent Moscow date: $today. This is article attempt $attempt, not a recrawl job. Yandex outages and pending recrawl URLs must NEVER stop today's article. Do not call the recrawl API; a separate task handles it. Return a final JSON object matching the supplied result schema. Never read or print .env or .env.blog. If today's article is already in the local data, finish publishing that exact article instead of creating another. Resume URL if known: $($todayState.resumeUrl). If a previous attempt left exact matching changes, they are your own permitted draft; continue it. Do not edit automation scripts or instructions."
  }

  $arguments = @('exec', '-C', $workspacePath, '-c', 'model_provider="openai"', '-c', 'approval_policy="never"', '-c', 'web_search="live"', '--color', 'never', '-o', $resultPath)
  if ($SmokeTest) { $arguments += @('--sandbox', 'read-only', '--ephemeral') }
  else { $arguments += @('--sandbox', 'danger-full-access', '--output-schema', (Join-Path $PSScriptRoot 'daily-blog-result.schema.json')) }
  $arguments += '-'
  $runLog = Join-Path $statePath "$today-run.log"
  if ($SmokeTest) { $runLog = Join-Path $statePath "$today-smoke-run.log" }
  elseif (Test-Path -LiteralPath $runLog) {
    Copy-Item -LiteralPath $runLog -Destination (Join-Path $statePath ("$today-run-before-attempt-$attempt.log"))
  }
  # No API keys are passed to the child; the forced provider uses existing ChatGPT sign-in.
  $oldApiKey = $env:OPENAI_API_KEY
  Remove-Item Env:OPENAI_API_KEY -ErrorAction SilentlyContinue
  $oldOutputEncoding = $OutputEncoding
  $oldConsoleEncoding = [Console]::OutputEncoding
  $oldPythonEncoding = $env:PYTHONIOENCODING
  $OutputEncoding = [Text.UTF8Encoding]::new($false)
  [Console]::OutputEncoding = [Text.UTF8Encoding]::new($false)
  $env:PYTHONIOENCODING = 'utf-8'
  try {
    $ErrorActionPreference = 'Continue'
    $prompt | & $codexPath @arguments *> $runLog
    $runExit = $LASTEXITCODE
    $ErrorActionPreference = 'Stop'
  } finally {
    $OutputEncoding = $oldOutputEncoding
    [Console]::OutputEncoding = $oldConsoleEncoding
    if ($null -ne $oldPythonEncoding) { $env:PYTHONIOENCODING = $oldPythonEncoding } else { Remove-Item Env:PYTHONIOENCODING -ErrorAction SilentlyContinue }
    if ($null -ne $oldApiKey) { $env:OPENAI_API_KEY = $oldApiKey }
  }
  if (!$SmokeTest) {
    & node scripts/daily-blog-state.mjs --snapshot $snapshotFile
    if ($LASTEXITCODE -ne 0) { throw 'The agent changed files outside the permitted article scope; manual review required.' }
    if ($runExit -ne 0) {
      $failedLog = [IO.File]::ReadAllText($runLog)
      $connectionFailure = $failedLog -match 'workspace routing discovery failed|failed to refresh available models: request timed out|error sending request for url'
      $workStarted = $failedLog -match '(?m)^(exec|codex|tool [^\r\n]+)\s*$'
      if ($connectionFailure -and !$workStarted) {
        @{ count = ($attempt - 1); lastConnectionFailureAt = [DateTime]::UtcNow.ToString('o') } | ConvertTo-Json | Set-Content -LiteralPath $attemptFile -Encoding UTF8
      }
    }
  }
  if ($runExit -ne 0) { throw "Codex exited with code $runExit. Review the local log in .daily-blog." }
  if ($SmokeTest) {
    if ([IO.File]::ReadAllText($resultPath).Trim() -ne 'SUBSCRIPTION_READY') { throw 'Unexpected smoke-test result.' }
    Write-Output 'Subscription smoke test passed. No files or website content were changed by Codex.'
    exit 0
  }

  $result = [IO.File]::ReadAllText($resultPath) | ConvertFrom-Json
  Copy-Item -LiteralPath $resultPath -Destination (Join-Path $statePath "$today-result.json")
  if ($result.status -eq 'published') {
    & node --no-warnings scripts/daily-blog-state.mjs --verify-result $resultPath
    if ($LASTEXITCODE -ne 0) { throw 'No verified new live article for today.' }
    & node scripts/yandex-recrawl.mjs --enqueue $result.url 'https://znayton.ru/blog'
    if ($LASTEXITCODE -ne 0) { throw 'Could not save recrawl queue.' }
    $result.recrawlQueued = $false
    $result | ConvertTo-Json | Set-Content -LiteralPath $resultPath -Encoding UTF8
    Copy-Item -LiteralPath $resultPath -Destination (Join-Path $statePath "$today-completed.json")
  }
  Write-Output "$($result.status): $($result.summary)"
  if ($result.status -ne 'published') { throw 'No new article was published. The scheduled retry must run.' }
} catch {
  @{ status = 'failed'; date = $today; error = $_.Exception.Message } | ConvertTo-Json | Set-Content -LiteralPath (Join-Path $statePath "$today-failure.json") -Encoding UTF8
  throw
} finally {
  $lockHandle.Dispose()
}
