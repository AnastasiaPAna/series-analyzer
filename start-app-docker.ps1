$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Push-Location $projectRoot
try {
    docker compose -f .\docker-compose.full.yml up --build -d
    Write-Host ""
    Write-Host "Open these URLs:"
    Write-Host "  http://localhost:3000/"
    Write-Host "  http://localhost:9090/api/v1/studios"
    Write-Host "  http://localhost:3010/health"
} finally {
    Pop-Location
}
