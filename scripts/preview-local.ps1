[CmdletBinding()]
param(
  [ValidateRange(1024, 65535)]
  [int]$Port = 4173,
  [switch]$NoBrowser
)

$ErrorActionPreference = "Stop"
$projectRoot = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot ".."))
$verificationScript = Join-Path $PSScriptRoot "verify-project.mjs"

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  throw "Node.js is required for the project check. Install Node.js or run the documented manual checks before previewing."
}

Push-Location $projectRoot
try {
  & node $verificationScript
  if ($LASTEXITCODE -ne 0) {
    throw "Project verification failed. The local server was not started."
  }

  $python = Get-Command python -ErrorAction SilentlyContinue
  $pythonLauncher = Get-Command py -ErrorAction SilentlyContinue
  if (-not $python -and -not $pythonLauncher) {
    throw "Python was not found. You can still double-click index.html for a basic preview."
  }

  $url = "http://127.0.0.1:$Port/"
  Write-Host ""
  Write-Host "Mommy's List local preview" -ForegroundColor Magenta
  Write-Host "Address: $url"
  Write-Host "Press Ctrl+C in this window to stop the server." -ForegroundColor Yellow
  Write-Host ""

  if (-not $NoBrowser) {
    Start-Process $url
  }

  if ($python) {
    & $python.Source -m http.server $Port --bind 127.0.0.1
  } else {
    & $pythonLauncher.Source -3 -m http.server $Port --bind 127.0.0.1
  }
} finally {
  Pop-Location
}
