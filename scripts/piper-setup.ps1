$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
. (Join-Path $PSScriptRoot "load-dotenv.ps1")
Import-DotEnv -Path (Join-Path $root ".env")
$modelsDir = Join-Path $root "tools\piper\models"
$pythonCommand = if ($env:PIPER_PYTHON) { $env:PIPER_PYTHON } else { "python" }
$voice = if ($env:PIPER_VOICE) { $env:PIPER_VOICE } else { "en_US-lessac-medium" }
$downloadVersion = if ($env:PIPER_VOICE_DOWNLOAD_VERSION) { $env:PIPER_VOICE_DOWNLOAD_VERSION } else { "v1.0.0" }

function Get-VoiceDownloadParts {
  param(
    [Parameter(Mandatory = $true)]
    [string]$Voice
  )

  if ($Voice -notmatch '^([a-z]{2}_[A-Z]{2})-([a-z0-9_-]+)-(x_low|low|medium|high)$') {
    throw @"
Unsupported PIPER_VOICE format: $Voice

Expected format:
- en_US-lessac-medium
- id_ID-...-medium

You can override it with:
`$env:PIPER_VOICE='en_US-lessac-medium'
"@
  }

  $languageCode = $matches[1]
  $speaker = $matches[2]
  $quality = $matches[3]
  $languageFamily = $languageCode.Split("_")[0]

  return @{
    LanguageFamily = $languageFamily
    LanguageCode = $languageCode
    Speaker = $speaker
    Quality = $quality
  }
}

function Download-File {
  param(
    [Parameter(Mandatory = $true)]
    [string]$Url,
    [Parameter(Mandatory = $true)]
    [string]$Destination
  )

  Write-Host "Downloading $Url" -ForegroundColor Cyan
  try {
    Invoke-WebRequest -Uri $Url -OutFile $Destination
  } catch {
    throw @"
Failed to download Piper asset.

URL:
$Url

Most likely causes:
- PIPER_VOICE is invalid for the selected language/speaker/quality
- PIPER_VOICE_DOWNLOAD_VERSION does not contain that voice

Current values:
- PIPER_VOICE=$voice
- PIPER_VOICE_DOWNLOAD_VERSION=$downloadVersion

Important:
- `lessac` is an English US voice family, so `id_ID-lessac-medium` is not a valid Piper voice.
- If you want English, use `en_US-lessac-medium`.
- If you want Indonesian, choose a real `id_ID-...` voice from the Piper voices catalog.
"@
  }
}

Write-Host "Setting up Piper..." -ForegroundColor Cyan
Write-Host "Python command : $pythonCommand"
Write-Host "Voice          : $voice"
Write-Host "Version        : $downloadVersion"

if (-not (Get-Command $pythonCommand -ErrorAction SilentlyContinue)) {
  throw "Python command '$pythonCommand' was not found. Set PIPER_PYTHON if needed."
}

& $pythonCommand -m pip install "piper-tts[http]"

$parts = Get-VoiceDownloadParts -Voice $voice

$relativeVoicePath = "{0}/{1}/{2}/{3}/{4}" -f `
  $parts.LanguageFamily, `
  $parts.LanguageCode, `
  $parts.Speaker, `
  $parts.Quality, `
  $voice

$baseUrl = "https://huggingface.co/rhasspy/piper-voices/resolve/$downloadVersion/$relativeVoicePath"

New-Item -ItemType Directory -Force -Path $modelsDir | Out-Null

$onnxPath = Join-Path $modelsDir "$voice.onnx"
$onnxJsonPath = Join-Path $modelsDir "$voice.onnx.json"
$modelCardPath = Join-Path $modelsDir "$voice.MODEL_CARD"

Download-File -Url "$baseUrl.onnx" -Destination $onnxPath
Download-File -Url "$baseUrl.onnx.json" -Destination $onnxJsonPath
Download-File -Url ("https://huggingface.co/rhasspy/piper-voices/resolve/{0}/{1}/MODEL_CARD" -f $downloadVersion, $relativeVoicePath) -Destination $modelCardPath

Write-Host ""
Write-Host "Piper setup complete." -ForegroundColor Green
Write-Host "Model      : $onnxPath"
Write-Host "Config     : $onnxJsonPath"
Write-Host "Model card : $modelCardPath"
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. bun run piper:doctor"
Write-Host "2. bun run piper:start"
Write-Host "3. bun run generate-audio"
