$ErrorActionPreference = "SilentlyContinue"

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$runtimeRoot = Join-Path $projectRoot ".runtime"
$docker = Get-Command docker -ErrorAction SilentlyContinue

function Stop-TrackedProcess {
    param([string]$PidFile)

    if (-not (Test-Path $PidFile)) {
        return
    }

    $targetPid = Get-Content $PidFile | Select-Object -First 1
    if ($targetPid) {
        Stop-Process -Id $targetPid -Force -ErrorAction SilentlyContinue
    }

    Remove-Item $PidFile -Force -ErrorAction SilentlyContinue
}

function Stop-ProcessOnPort {
    param([int]$Port)

    $connections = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
    foreach ($connection in $connections) {
        $process = Get-Process -Id $connection.OwningProcess -ErrorAction SilentlyContinue
        if ($process -and $process.ProcessName -in @("java", "node", "cmd")) {
            Stop-Process -Id $process.Id -Force -ErrorAction SilentlyContinue
        }
    }
}

Stop-TrackedProcess (Join-Path $runtimeRoot "spring.pid")
Stop-TrackedProcess (Join-Path $runtimeRoot "reviews.pid")
Stop-ProcessOnPort 9090
Stop-ProcessOnPort 3010

if ($docker) {
    Push-Location $projectRoot
    try {
        & $docker.Source compose down | Out-Host
    } finally {
        Pop-Location
    }
}

Write-Host "Application processes and local databases were stopped."
