# Run all tests from root using root vitest.config.ts
# Get the root directory (parent of scripts folder)
$scriptPath = $PSScriptRoot
$root = Split-Path -Parent $scriptPath
Set-Location $root
Write-Host "Running tests from: $root" -ForegroundColor Green
pnpm --filter @innkeeper/web exec -- vitest $args --config vitest.config.ts

