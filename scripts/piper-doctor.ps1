$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
. (Join-Path $PSScriptRoot "load-dotenv.ps1")
Import-DotEnv -Path (Join-Path $root ".env")
$defaultModelPath = Join-Path $root "tools\piper\models\en_US-lessac-medium.onnx"
$pythonCommand = if ($env:PIPER_PYTHON) { $env:PIPER_PYTHON } else { "python" }
$modelPath = if ($env:PIPER_MODEL_PATH) { $env:PIPER_MODEL_PATH } else { $defaultModelPath }
$port = if ($env:PIPER_SERVER_PORT) { $env:PIPER_SERVER_PORT } else { "5000" }
$baseUrl = if ($env:PIPER_BASE_URL) { $env:PIPER_BASE_URL } else { "http://127.0.0.1:$port" }
$voice = if ($env:PIPER_VOICE) { $env:PIPER_VOICE } else { "en_US-lessac-medium" }

Write-Host "Piper doctor" -ForegroundColor Cyan
Write-Host "------------"

if (Get-Command $pythonCommand -ErrorAction SilentlyContinue) {
  Write-Host "[OK] Python command found: $pythonCommand" -ForegroundColor Green
} else {
  Write-Host "[ERR] Python command not found: $pythonCommand" -ForegroundColor Red
}

$resolvedModelPath = Resolve-Path -LiteralPath $modelPath -ErrorAction SilentlyContinue
if ($resolvedModelPath) {
  Write-Host "[OK] Model file found: $($resolvedModelPath.Path)" -ForegroundColor Green
} else {
  Write-Host "[ERR] Model file not found: $modelPath" -ForegroundColor Red
  Write-Host "      Install it with: bun run piper:setup"
}

$modelConfigPath = "$modelPath.json"
$resolvedModelConfigPath = Resolve-Path -LiteralPath $modelConfigPath -ErrorAction SilentlyContinue
if ($resolvedModelConfigPath) {
  Write-Host "[OK] Model config found: $($resolvedModelConfigPath.Path)" -ForegroundColor Green
} else {
  Write-Host "[ERR] Model config not found: $modelConfigPath" -ForegroundColor Red
  Write-Host "      Install it with: bun run piper:setup"
}

Write-Host "[INFO] Base URL: $baseUrl"
Write-Host "[INFO] Voice   : $voice"

try {
  $response = Invoke-WebRequest -Uri $baseUrl -Method Get -TimeoutSec 3
  Write-Host "[OK] Piper server reachable: HTTP $($response.StatusCode)" -ForegroundColor Green
} catch {
  Write-Host "[ERR] Piper server not reachable at $baseUrl" -ForegroundColor Red
  Write-Host "      Start it with: bun run piper:start"
}
