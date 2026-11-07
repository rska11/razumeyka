param(
  [switch]$Run,
  [switch]$SmokeTest
)

$ErrorActionPreference = 'Stop'
$workspacePath = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
Set-Location -LiteralPath $workspacePath
$statePath = Join-Path $workspacePath '.daily-blog'
[IO.Directory]::CreateDirectory($statePath) | Out-Null
$moscowZone = [TimeZoneInfo]::FindSystemTimeZoneById('Russian Standard Time')
$today = [TimeZoneInfo]::ConvertTimeFromUtc([DateTime]::UtcNow, $moscowZone).ToString('yyyy-MM-dd')
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
    if (Test-Path -LiteralPath (Join-Path $statePath 'pending-recrawl.json')) {
      & node scripts/yandex-recrawl.mjs --retry-pending
      if ($LASTEXITCODE -ne 0) { Write-Warning 'Pending recrawl requests remain queued for the next run.' }
    }
    if (Test-Path -LiteralPath (Join-Path $statePath "$today-completed.json")) {
      Write-Output 'An article was already published today; skipping.'
      exit 0
    }
    $branch = (& git branch --show-current | Out-String).Trim()
    if ($branch -ne 'nextjs-migration') { throw 'Wrong source branch; refusing to publish.' }
    $changes = & git status --porcelain -- .
    if ($LASTEXITCODE -ne 0 -or $changes) { throw 'The website checkout has unfinished changes; refusing to mix them with an automated article.' }
    $staged = & git diff --cached --name-only
    if ($LASTEXITCODE -ne 0 -or $staged) { throw 'Git already has staged changes; refusing to include them in an automated commit.' }
    & node scripts/yandex-recrawl.mjs --check
    if ($LASTEXITCODE -ne 0) { throw 'Webmaster connection check failed.' }
    $prompt = [IO.File]::ReadAllText((Join-Path $workspacePath 'docs/DAILY-BLOG-PROMPT.md'))
    $prompt += "`nCurrent Moscow date: $today. Return a final JSON object matching the supplied result schema. Review .daily-blog/pending-recrawl.json if present and retry those URLs before starting a new article. Never read or print .env or .env.blog; the helper loads its token itself."
  }

  $arguments = @('exec', '-C', $workspacePath, '-c', 'model_provider="openai"', '-c', 'approval_policy="never"', '-c', 'web_search="live"', '--color', 'never', '-o', $resultPath)
  if ($SmokeTest) { $arguments += @('--sandbox', 'read-only', '--ephemeral') }
  else { $arguments += @('--sandbox', 'danger-full-access', '--output-schema', (Join-Path $PSScriptRoot 'daily-blog-result.schema.json')) }
  $arguments += '-'
  $runLog = Join-Path $statePath "$today-run.log"
  # No API keys are passed to the child; the forced provider uses existing ChatGPT sign-in.
  $oldApiKey = $env:OPENAI_API_KEY
  Remove-Item Env:OPENAI_API_KEY -ErrorAction SilentlyContinue
  $oldOutputEncoding = $OutputEncoding
  $OutputEncoding = [Text.UTF8Encoding]::new($false)
  try {
    $ErrorActionPreference = 'Continue'
    $prompt | & $codexPath @arguments *> $runLog
    $runExit = $LASTEXITCODE
    $ErrorActionPreference = 'Stop'
  } finally {
    $OutputEncoding = $oldOutputEncoding
    if ($null -ne $oldApiKey) { $env:OPENAI_API_KEY = $oldApiKey }
  }
  if ($runExit -ne 0) { throw "Codex exited with code $runExit. Review the local log in .daily-blog." }
  if ($SmokeTest) {
    if ([IO.File]::ReadAllText($resultPath).Trim() -ne 'SUBSCRIPTION_READY') { throw 'Unexpected smoke-test result.' }
    Write-Output 'Subscription smoke test passed. No files or website content were changed by Codex.'
    exit 0
  }

  $result = [IO.File]::ReadAllText($resultPath) | ConvertFrom-Json
  if ($result.status -eq 'published') {
    & node scripts/yandex-recrawl.mjs --validate-url $result.url
    if ($LASTEXITCODE -ne 0) { throw 'Invalid published URL in result.' }
    $response = Invoke-WebRequest -Uri $result.url -UseBasicParsing -TimeoutSec 30
    if ($response.StatusCode -ne 200) { throw 'Published article is not live.' }
    & node scripts/yandex-recrawl.mjs --submit $result.url 'https://znayton.ru/blog'
    $result.recrawlQueued = ($LASTEXITCODE -eq 0)
    $result | ConvertTo-Json | Set-Content -LiteralPath $resultPath -Encoding UTF8
    Copy-Item -LiteralPath $resultPath -Destination (Join-Path $statePath "$today-completed.json")
  }
  Write-Output "$($result.status): $($result.summary)"
  if ($result.status -eq 'failed') { exit 1 }
} catch {
  @{ status = 'failed'; date = $today; error = $_.Exception.Message } | ConvertTo-Json | Set-Content -LiteralPath (Join-Path $statePath "$today-failure.json") -Encoding UTF8
  throw
} finally {
  $lockHandle.Dispose()
}
