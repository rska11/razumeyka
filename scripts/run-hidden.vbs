Set sh = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")
scriptDir = fso.GetParentFolderName(WScript.ScriptFullName)
psScript = fso.BuildPath(scriptDir, "run-daily-blog.ps1")
arg = ""
If WScript.Arguments.Count > 0 Then
  arg = " " & WScript.Arguments(0)
End If
cmd = "C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe -NoProfile -NonInteractive -WindowStyle Hidden -ExecutionPolicy Bypass -File """ & psScript & """" & arg
sh.CurrentDirectory = fso.GetParentFolderName(scriptDir)
exitCode = sh.Run(cmd, 0, True)
WScript.Quit exitCode
