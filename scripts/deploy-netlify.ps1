[CmdletBinding()]
param(
  [switch]$Production,
  [switch]$ValidateOnly,
  [string]$Message
)

$ErrorActionPreference = "Stop"
$projectRoot = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot ".."))
$indexPath = Join-Path $projectRoot "index.html"
$netlifyState = Join-Path $projectRoot ".netlify\state.json"
$verificationScript = Join-Path $PSScriptRoot "verify-project.mjs"

if (-not $Message) {
  $Message = if ($Production) { "Mommy's List production release" } else { "Mommy's List preview" }
}

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  throw "Node.js is required for the release verification step."
}
if (-not (Get-Command netlify.cmd -ErrorAction SilentlyContinue)) {
  throw "Netlify CLI was not found. Install it and make sure netlify.cmd is available."
}
if (-not (Test-Path -LiteralPath $netlifyState -PathType Leaf)) {
  throw "This folder is not linked to Netlify. Reconnect it to the existing mommys-list-california project before deploying."
}

Push-Location $projectRoot
$stageDirectory = $null
try {
  & node $verificationScript
  if ($LASTEXITCODE -ne 0) {
    throw "Project verification failed. Nothing was deployed."
  }

  $tempRoot = [System.IO.Path]::GetFullPath([System.IO.Path]::GetTempPath())
  $stageDirectory = [System.IO.Path]::GetFullPath((Join-Path $tempRoot ("mommys-list-release-" + [System.Guid]::NewGuid().ToString("N"))))
  if (-not $stageDirectory.StartsWith($tempRoot, [System.StringComparison]::OrdinalIgnoreCase)) {
    throw "Refusing to stage a release outside the system temporary directory."
  }

  New-Item -ItemType Directory -Path $stageDirectory | Out-Null
  Copy-Item -LiteralPath $indexPath -Destination (Join-Path $stageDirectory "index.html")

  if ($ValidateOnly) {
    $sourceHash = (Get-FileHash -LiteralPath $indexPath -Algorithm SHA256).Hash
    $stagedHash = (Get-FileHash -LiteralPath (Join-Path $stageDirectory "index.html") -Algorithm SHA256).Hash
    if ($sourceHash -ne $stagedHash) {
      throw "The staged release copy does not match index.html."
    }
    Write-Host ""
    Write-Host "Netlify release preparation passed without deploying." -ForegroundColor Green
    Write-Host "Staged SHA256: $stagedHash"
    return
  }

  $arguments = @(
    "deploy",
    "--dir", $stageDirectory,
    "--no-build",
    "--message", $Message,
    "--timeout", "300000"
  )
  if ($Production) {
    $arguments += "--prod"
  }

  $releaseType = if ($Production) { "PRODUCTION" } else { "PREVIEW" }
  Write-Host ""
  Write-Host "Publishing Mommy's List $releaseType" -ForegroundColor Magenta
  Write-Host "Only index.html is included in the deploy artifact."
  & netlify.cmd @arguments
  if ($LASTEXITCODE -ne 0) {
    throw "Netlify deployment failed with exit code $LASTEXITCODE."
  }

  if ($Production) {
    $productionUrl = "https://mommys-list-california.netlify.app/"
    $localHash = (Get-FileHash -LiteralPath $indexPath -Algorithm SHA256).Hash
    $matched = $false
    $liveHash = $null

    for ($attempt = 1; $attempt -le 5; $attempt += 1) {
      $response = Invoke-WebRequest -Uri $productionUrl -UseBasicParsing -MaximumRedirection 5 -TimeoutSec 45
      if ($response.StatusCode -ne 200) {
        throw "Production returned HTTP $($response.StatusCode), not 200."
      }
      $sha = [System.Security.Cryptography.SHA256]::Create()
      try {
        $liveBytes = [System.Text.Encoding]::UTF8.GetBytes($response.Content)
        $liveHash = ([System.BitConverter]::ToString($sha.ComputeHash($liveBytes))).Replace("-", "")
      } finally {
        $sha.Dispose()
      }

      if ($liveHash -eq $localHash) {
        $matched = $true
        break
      }
      if ($attempt -lt 5) {
        Start-Sleep -Seconds 3
      }
    }

    if (-not $matched) {
      throw "Production deployed, but its SHA-256 does not match local index.html. Local=$localHash Live=$liveHash"
    }

    Write-Host ""
    Write-Host "Production verification passed." -ForegroundColor Green
    Write-Host "URL:    $productionUrl"
    Write-Host "SHA256: $localHash"
  }
} finally {
  if ($stageDirectory -and (Test-Path -LiteralPath $stageDirectory)) {
    $tempRoot = [System.IO.Path]::GetFullPath([System.IO.Path]::GetTempPath())
    $resolvedStage = (Resolve-Path -LiteralPath $stageDirectory).Path
    if ($resolvedStage.StartsWith($tempRoot, [System.StringComparison]::OrdinalIgnoreCase) -and
        (Split-Path -Leaf $resolvedStage).StartsWith("mommys-list-release-", [System.StringComparison]::OrdinalIgnoreCase)) {
      Remove-Item -LiteralPath $resolvedStage -Recurse -Force
    } else {
      Write-Warning "Temporary release folder was not removed because its resolved path failed the safety check: $resolvedStage"
    }
  }
  Pop-Location
}
