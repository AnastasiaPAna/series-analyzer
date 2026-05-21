$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Push-Location $projectRoot
try {
    docker compose -f .\docker-compose.full.yml down
} finally {
    Pop-Location
}
