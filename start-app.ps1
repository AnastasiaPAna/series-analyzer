$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path

function Test-Http {
    param([string]$Url)

    try {
        $response = Invoke-WebRequest -UseBasicParsing -Uri $Url -TimeoutSec 5
        return $response.StatusCode -ge 200 -and $response.StatusCode -lt 500
    } catch {
        return $false
    }
}

function Wait-Http {
    param(
        [string]$Url,
        [string]$Name,
        [int]$TimeoutSeconds = 180
    )

    $deadline = (Get-Date).AddSeconds($TimeoutSeconds)
    while ((Get-Date) -lt $deadline) {
        if (Test-Http -Url $Url) {
            Write-Host "$Name is ready: $Url"
            return
        }
        Start-Sleep -Seconds 3
    }

    throw "$Name did not become ready in time."
}

Push-Location $projectRoot
try {
    docker compose up --build -d

    Wait-Http -Url "http://localhost:9090/api/v1/studios" -Name "Spring API"
    Wait-Http -Url "http://localhost:3010/health" -Name "Reviews service"
    Wait-Http -Url "http://localhost:3000/" -Name "Frontend"

    Write-Host ""
    Write-Host "Open these URLs:"
    Write-Host "  http://localhost:3000/"
    Write-Host "  http://localhost:9090/api/v1/studios"
    Write-Host "  http://localhost:3010/health"
} finally {
    Pop-Location
}
