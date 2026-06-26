$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
. (Join-Path $PSScriptRoot "load-dotenv.ps1")
Import-DotEnv -Path (Join-Path $root ".env")

$defaultModelPath = Join-Path $root "tools\piper\models\en_US-lessac-medium.onnx"
$pythonCommand = if ($env:PIPER_PYTHON) { $env:PIPER_PYTHON } else { "python" }
$modelPath = if ($env:PIPER_MODEL_PATH) { $env:PIPER_MODEL_PATH } else { $defaultModelPath }
$port = if ($env:PIPER_SERVER_PORT) { $env:PIPER_SERVER_PORT } else { "5000" }

Write-Host "Starting Piper HTTP server..." -ForegroundColor Cyan
Write-Host "Python command : $pythonCommand"
Write-Host "Model path     : $modelPath"
Write-Host "Port           : $port"

if (-not (Get-Command $pythonCommand -ErrorAction SilentlyContinue)) {
  throw "Python command '$pythonCommand' was not found. Set PIPER_PYTHON if needed."
}

$resolvedModelPath = Resolve-Path -LiteralPath $modelPath -ErrorAction SilentlyContinue
if (-not $resolvedModelPath) {
  throw "Piper model file was not found. Expected path: $modelPath . Put your model there or set PIPER_MODEL_PATH. If you have not installed Piper and the model yet, run: bun run piper:setup"
}

Write-Host ("Resolved model : " + $resolvedModelPath.Path) -ForegroundColor Green
& $pythonCommand -m piper.http_server -m $resolvedModelPath.Path --host 127.0.0.1 --port $port
