$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath $PSScriptRoot
$env:TEMP = 'D:\Codex\temp\tangerine'
$env:TMP = 'D:\Codex\temp\tangerine'
$env:NEXT_TELEMETRY_DISABLED = '1'
New-Item -ItemType Directory -Force -Path $env:TEMP | Out-Null
if (-not (Test-Path -LiteralPath (Join-Path $PSScriptRoot 'node_modules\next'))) {
    throw 'Сначала установите зависимости npm ci. См. README.md.'
}
Write-Host 'Запусти CMS во втором терминале: cd cms; php artisan serve --host=127.0.0.1 --port=8107'
npm.cmd run dev
