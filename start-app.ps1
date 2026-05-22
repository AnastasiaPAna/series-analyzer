$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$frontendRoot = Join-Path $projectRoot "series-frontend"
$reviewsRoot = Join-Path $projectRoot "block4-reviews-service"
$runtimeRoot = Join-Path $projectRoot ".runtime"
$springJar = Join-Path $projectRoot "target\series-analyzer-1.0.0.jar"
$frontendOut = Join-Path $runtimeRoot "frontend.out.log"
$frontendErr = Join-Path $runtimeRoot "frontend.err.log"
$springOut = Join-Path $runtimeRoot "spring.out.log"
$springErr = Join-Path $runtimeRoot "spring.err.log"
$reviewsOut = Join-Path $runtimeRoot "reviews.out.log"
$reviewsErr = Join-Path $runtimeRoot "reviews.err.log"
$frontendPidFile = Join-Path $runtimeRoot "frontend.pid"
$springPidFile = Join-Path $runtimeRoot "spring.pid"
$reviewsPidFile = Join-Path $runtimeRoot "reviews.pid"

New-Item -ItemType Directory -Force -Path $runtimeRoot | Out-Null

function Resolve-Executable {
    param(
        [string]$CommandName,
        [string[]]$Fallbacks
    )

    foreach ($candidate in $Fallbacks) {
        if (Test-Path $candidate) {
            return $candidate
        }
    }

    $command = Get-Command $CommandName -ErrorAction SilentlyContinue
    if ($command) {
        return $command.Source
    }

    throw "Cannot find executable: $CommandName"
}

function Test-Http {
    param([string]$Url)

    try {
        $response = Invoke-WebRequest -UseBasicParsing -Uri $Url -TimeoutSec 3
        return $response.StatusCode -ge 200 -and $response.StatusCode -lt 500
    } catch {
        return $false
    }
}

function Wait-Http {
    param(
        [string]$Url,
        [int]$TimeoutSeconds = 90,
        [string]$Name
    )

    $deadline = (Get-Date).AddSeconds($TimeoutSeconds)
    while ((Get-Date) -lt $deadline) {
        if (Test-Http -Url $Url) {
            Write-Host "$Name is ready: $Url"
            return
        }
        Start-Sleep -Seconds 2
    }

    throw "$Name did not become ready in time. Check logs in .runtime."
}

function Test-NeedsRebuild {
    param(
        [string]$OutputPath,
        [string[]]$WatchPaths
    )

    if (-not (Test-Path $OutputPath)) {
        return $true
    }

    $outputTime = (Get-Item $OutputPath).LastWriteTime
    foreach ($watchPath in $WatchPaths) {
        if (-not (Test-Path $watchPath)) {
            continue
        }

        $items = Get-Item $watchPath
        if ($items.PSIsContainer) {
            $latest = Get-ChildItem -Recurse -File $watchPath |
                Sort-Object LastWriteTime -Descending |
                Select-Object -First 1
            if ($latest -and $latest.LastWriteTime -gt $outputTime) {
                return $true
            }
        } elseif ($items.LastWriteTime -gt $outputTime) {
            return $true
        }
    }

    return $false
}

function Start-TrackedProcess {
    param(
        [string]$FilePath,
        [string[]]$Arguments,
        [string]$WorkingDirectory,
        [string]$OutFile,
        [string]$ErrFile,
        [string]$PidFile
    )

    $process = Start-Process `
        -FilePath $FilePath `
        -ArgumentList $Arguments `
        -WorkingDirectory $WorkingDirectory `
        -RedirectStandardOutput $OutFile `
        -RedirectStandardError $ErrFile `
        -PassThru `
        -WindowStyle Hidden

    Set-Content -Path $PidFile -Value $process.Id
}

function Ensure-Docker {
    param([string]$DockerPath)

    if (Test-DockerReady -DockerPath $DockerPath) {
        return
    }

    $dockerService = Get-Service -Name "com.docker.service" -ErrorAction SilentlyContinue
    if ($dockerService -and $dockerService.Status -ne "Running") {
        try {
            Write-Host "Starting Docker service..."
            Start-Service -Name "com.docker.service" -ErrorAction Stop
            Start-Sleep -Seconds 5
            if (Test-DockerReady -DockerPath $DockerPath) {
                Write-Host "Docker service is ready."
                return
            }
        } catch {
            Write-Host "Docker service requires manual startup or administrator rights."
        }
    }

    $dockerDesktop = "C:\Program Files\Docker\Docker\Docker Desktop.exe"
    if (Test-Path $dockerDesktop) {
        Write-Host "Starting Docker Desktop..."
        Start-Process -FilePath $dockerDesktop | Out-Null
        $deadline = (Get-Date).AddSeconds(240)
        while ((Get-Date) -lt $deadline) {
            $service = Get-Service -Name "com.docker.service" -ErrorAction SilentlyContinue
            if ($service -and $service.Status -ne "Running") {
                try {
                    Start-Service -Name "com.docker.service" -ErrorAction Stop
                } catch {
                    # ignore and keep waiting for Docker Desktop
                }
            }
            if (Test-DockerReady -DockerPath $DockerPath) {
                Write-Host "Docker Desktop is ready."
                return
            }
            Start-Sleep -Seconds 3
        }
    }

    throw "Docker Desktop is not running. Start it and run start-app.ps1 again."
}

function Test-DockerReady {
    param([string]$DockerPath)

    try {
        & $DockerPath info --format "{{.ServerVersion}}" | Out-Null
        return $LASTEXITCODE -eq 0
    } catch {
        return $false
    }
}

$docker = Resolve-Executable "docker.exe" @(
    "C:\Program Files\Docker\Docker\resources\bin\docker.exe"
)
$java = Resolve-Executable "java.exe" @(
    "C:\Program Files\Microsoft\jdk-21.0.10.7-hotspot\bin\java.exe"
)
$node = Resolve-Executable "node.exe" @(
    "C:\Program Files\nodejs\node.exe"
)
$mvn = Resolve-Executable "mvn" @(
    "C:\Users\nasta\tools\apache-maven-3.9.14\bin\mvn.cmd"
)
$npm = Resolve-Executable "npm.cmd" @(
    "C:\Program Files\nodejs\npm.cmd"
)

Ensure-Docker -DockerPath $docker

Write-Host "Starting PostgreSQL and MongoDB..."
& $docker compose up -d | Out-Host
if ($LASTEXITCODE -ne 0) {
    throw "docker compose up -d failed."
}

if (-not (Test-Path (Join-Path $frontendRoot "node_modules"))) {
    Write-Host "Installing frontend dependencies..."
    Push-Location $frontendRoot
    try {
        & $npm install
    } finally {
        Pop-Location
    }
}

if (Test-NeedsRebuild -OutputPath $springJar -WatchPaths @(
    (Join-Path $projectRoot "src"),
    (Join-Path $projectRoot "pom.xml"),
    (Join-Path $frontendRoot "src")
)) {
    Write-Host "Building Spring application..."
    & $mvn -q -DskipTests package
}

if (-not (Test-Path (Join-Path $reviewsRoot "node_modules"))) {
    Write-Host "Installing Node dependencies..."
    Push-Location $reviewsRoot
    try {
        & $npm install
    } finally {
        Pop-Location
    }
}

if (Test-NeedsRebuild -OutputPath (Join-Path $reviewsRoot "dist\src\server.js") -WatchPaths @(
    (Join-Path $reviewsRoot "src"),
    (Join-Path $reviewsRoot "package.json"),
    (Join-Path $reviewsRoot "tsconfig.json")
)) {
    Write-Host "Building reviews service..."
    Push-Location $reviewsRoot
    try {
        & $npm run build
    } finally {
        Pop-Location
    }
}

if (-not (Test-Http -Url "http://localhost:3000/series")) {
    Write-Host "Starting Block 3 frontend on http://localhost:3000 ..."
    Start-TrackedProcess `
        -FilePath $npm `
        -Arguments @("run", "dev") `
        -WorkingDirectory $frontendRoot `
        -OutFile $frontendOut `
        -ErrFile $frontendErr `
        -PidFile $frontendPidFile
} else {
    Write-Host "Block 3 frontend is already running."
}

if (-not (Test-Http -Url "http://localhost:9090/api/v1/studios")) {
    Write-Host "Starting Spring application on http://localhost:9090 ..."
    Start-TrackedProcess `
        -FilePath $java `
        -Arguments @("-jar", $springJar, "--server.port=9090") `
        -WorkingDirectory $projectRoot `
        -OutFile $springOut `
        -ErrFile $springErr `
        -PidFile $springPidFile
} else {
    Write-Host "Spring application is already running."
}

if (-not (Test-Http -Url "http://localhost:3010/health")) {
    Write-Host "Starting reviews service on http://localhost:3010 ..."
    Start-TrackedProcess `
        -FilePath $node `
        -Arguments @((Join-Path $reviewsRoot "dist\src\server.js")) `
        -WorkingDirectory $reviewsRoot `
        -OutFile $reviewsOut `
        -ErrFile $reviewsErr `
        -PidFile $reviewsPidFile
} else {
    Write-Host "Reviews service is already running."
}

Wait-Http -Url "http://localhost:3000/series" -Name "Block 3 frontend"
Wait-Http -Url "http://localhost:9090/api/v1/studios" -Name "Spring application"
Wait-Http -Url "http://localhost:3010/health" -Name "Reviews service"

Write-Host ""
Write-Host "Open these URLs:"
Write-Host "  http://localhost:3000/"
Write-Host "  http://localhost:3000/series"
Write-Host "  http://localhost:9090/api/v1/studios"
Write-Host "  http://localhost:3010/health"

Start-Process "http://localhost:3000/" | Out-Null
