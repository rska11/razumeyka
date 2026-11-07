param([int]$Hour = 9, [int]$Minute = 0)
$ErrorActionPreference = 'Stop'
if ($Hour -lt 0 -or $Hour -gt 23 -or $Minute -lt 0 -or $Minute -gt 59) { throw 'Invalid schedule time.' }
if ((Get-TimeZone).Id -ne 'Russian Standard Time') { throw 'This installer expects the Windows Moscow timezone.' }
$runner = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot 'run-daily-blog.ps1'))
$powershellPath = Join-Path $PSHOME 'powershell.exe'
$workspacePath = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$cliDirectory = Join-Path $workspacePath '.daily-blog/cli'
if (!(Test-Path -LiteralPath (Join-Path $cliDirectory 'node_modules/.bin/codex.cmd'))) {
  & npm.cmd install --prefix $cliDirectory --no-audit --no-fund '@openai/codex@0.167.0'
  if ($LASTEXITCODE -ne 0) { throw 'Could not install the isolated Codex CLI.' }
}
$identity = [Security.Principal.WindowsIdentity]::GetCurrent().Name
$action = New-ScheduledTaskAction -Execute $powershellPath -Argument ('-NoProfile -NonInteractive -WindowStyle Hidden -ExecutionPolicy Bypass -File "' + $runner + '" -Run') -WorkingDirectory $workspacePath
$firstRun = (Get-Date).Date.AddDays(1).AddHours($Hour).AddMinutes($Minute)
$trigger = New-ScheduledTaskTrigger -Daily -At $firstRun
$settings = New-ScheduledTaskSettingsSet -StartWhenAvailable -WakeToRun -MultipleInstances IgnoreNew -ExecutionTimeLimit (New-TimeSpan -Hours 2) -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries
$principal = New-ScheduledTaskPrincipal -UserId $identity -LogonType Interactive -RunLevel Limited
$task = New-ScheduledTask -Action $action -Trigger $trigger -Settings $settings -Principal $principal -Description 'One Znayton blog article per day using ChatGPT subscription; verify, publish and submit to Yandex Webmaster. No paid generation APIs.'
Register-ScheduledTask -TaskName 'Znayton-Daily-Blog' -InputObject $task -Force | Select-Object TaskName, State
Write-Output ('Next run: ' + (Get-ScheduledTaskInfo -TaskName 'Znayton-Daily-Blog').NextRunTime.ToString('yyyy-MM-dd HH:mm:ss'))
