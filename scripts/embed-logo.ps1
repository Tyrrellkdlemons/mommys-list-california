[CmdletBinding()]
param(
  [string]$LogoPath,
  [string]$HtmlPath
)

$ErrorActionPreference = "Stop"
$projectRoot = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot ".."))

if (-not $LogoPath) {
  $LogoPath = Join-Path $projectRoot "assets\branding\mommys-list-logo-original.jpg"
}
if (-not $HtmlPath) {
  $HtmlPath = Join-Path $projectRoot "index.html"
}

$resolvedLogo = [System.IO.Path]::GetFullPath($LogoPath)
$resolvedHtml = [System.IO.Path]::GetFullPath($HtmlPath)

if (-not (Test-Path -LiteralPath $resolvedLogo -PathType Leaf)) {
  throw "Logo source was not found: $resolvedLogo"
}
if (-not (Test-Path -LiteralPath $resolvedHtml -PathType Leaf)) {
  throw "HTML source was not found: $resolvedHtml"
}

$logoBytes = [System.IO.File]::ReadAllBytes($resolvedLogo)
if ($logoBytes.Length -lt 4 -or $logoBytes[0] -ne 0xFF -or $logoBytes[1] -ne 0xD8) {
  throw "The branding source is not a valid JPEG. Convert it to JPEG before embedding."
}

$html = [System.IO.File]::ReadAllText($resolvedHtml, [System.Text.Encoding]::UTF8)
$pattern = "data:image/jpeg;base64,[A-Za-z0-9+/=]+"
$matches = [System.Text.RegularExpressions.Regex]::Matches($html, $pattern)
if ($matches.Count -ne 1) {
  throw "Expected exactly one embedded JPEG data URI in index.html; found $($matches.Count)."
}

$replacement = "data:image/jpeg;base64," + [System.Convert]::ToBase64String($logoBytes)
$updated = [System.Text.RegularExpressions.Regex]::Replace($html, $pattern, $replacement, 1)
$utf8WithoutBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($resolvedHtml, $updated, $utf8WithoutBom)

Write-Host "Embedded the branding source into index.html." -ForegroundColor Green
Write-Host "Source: $resolvedLogo"
Write-Host "HTML:   $resolvedHtml"

if (Get-Command node -ErrorAction SilentlyContinue) {
  & node (Join-Path $PSScriptRoot "verify-project.mjs")
  if ($LASTEXITCODE -ne 0) {
    throw "The logo was embedded, but project verification failed. Review the reported issue before committing."
  }
} else {
  Write-Warning "Node.js was not found, so automatic project verification was skipped."
}
