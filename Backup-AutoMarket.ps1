# AutoMarket Rivne: PostgreSQL 18 + uploaded photos backup.
# Run this script from any working directory. No passwords are stored here.
$ErrorActionPreference = 'Stop'
$ProjectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$PgBin = 'C:\Program Files\PostgreSQL\18\bin'
$PgDump = Join-Path $PgBin 'pg_dump.exe'
$PgRestore = Join-Path $PgBin 'pg_restore.exe'
$Database = 'automarket_db'
$DbUser = 'automarket_app'
$DbHost = 'localhost'
$DbPort = '5432'
$PhotosDir = Join-Path $ProjectRoot "backend\AutoMarket.Api\AutoMarket.Api\uploads\cars"
$BackupRoot = "E:\AutoMarketBackups"
$RetentionDays = 30
$Timestamp = Get-Date -Format 'yyyy-MM-dd_HHmmss'
$WorkingDir = Join-Path $BackupRoot "$Timestamp.inprogress"
$FinalDir = Join-Path $BackupRoot $Timestamp
$DumpFile = Join-Path $WorkingDir 'database.dump'
$PhotosZip = Join-Path $WorkingDir 'photos.zip'
$InfoFile = Join-Path $WorkingDir 'backup-info.txt'

try {
    Write-Host 'Starting AutoMarket backup...' -ForegroundColor Cyan
    foreach ($binary in @($PgDump, $PgRestore)) {
        if (-not (Test-Path -LiteralPath $binary -PathType Leaf)) {
            throw "PostgreSQL tool not found: $binary"
        }
    }
    if (-not (Test-Path -LiteralPath $PhotosDir -PathType Container)) {
        throw "Photos folder not found: $PhotosDir"
    }
    $PgPassFile = Join-Path $env:APPDATA 'postgresql\pgpass.conf'
    if (-not (Test-Path -LiteralPath $PgPassFile -PathType Leaf)) {
        throw "pgpass.conf not found: $PgPassFile"
    }
    New-Item -ItemType Directory -Path $BackupRoot -Force | Out-Null
    New-Item -ItemType Directory -Path $WorkingDir -ErrorAction Stop | Out-Null

    Write-Host 'Backing up PostgreSQL...'
    & $PgDump "--host=$DbHost" "--port=$DbPort" "--username=$DbUser" "--dbname=$Database" '--format=custom' '--no-password' "--file=$DumpFile"
    if ($LASTEXITCODE -ne 0) { throw "pg_dump failed (exit code $LASTEXITCODE)." }
    if (-not (Test-Path -LiteralPath $DumpFile) -or (Get-Item -LiteralPath $DumpFile).Length -le 0) {
        throw 'Database dump is empty or missing.'
    }
    & $PgRestore '--list' $DumpFile 1>$null
    if ($LASTEXITCODE -ne 0) { throw 'pg_restore could not read database dump.' }
    Write-Host 'Database archive verified.' -ForegroundColor Green

    Write-Host 'Backing up photographs...'
    Add-Type -AssemblyName System.IO.Compression
    Add-Type -AssemblyName System.IO.Compression.FileSystem
    # Archive the folder including its contents. Empty folders are supported.
    [System.IO.Compression.ZipFile]::CreateFromDirectory(
        $PhotosDir, $PhotosZip,
        [System.IO.Compression.CompressionLevel]::Optimal, $false
    )
    $zip = [System.IO.Compression.ZipFile]::OpenRead($PhotosZip)
    try {
        $ZipFiles = @($zip.Entries | Where-Object { $_.Name -ne '' }).Count
    } finally {
        $zip.Dispose()
    }
    $SourceFiles = @(Get-ChildItem -LiteralPath $PhotosDir -File -Recurse).Count
    if ($ZipFiles -ne $SourceFiles) {
        throw "Photo count mismatch (zip=$ZipFiles, source=$SourceFiles)."
    }
    Write-Host 'Photo archive verified.' -ForegroundColor Green

    $CompletedAt = Get-Date
    @(
        'AutoMarket Rivne backup',
        "Created: $CompletedAt",
        "Database: $Database",
        "Photo files: $ZipFiles",
        "Database archive bytes: $((Get-Item -LiteralPath $DumpFile).Length)",
        "Photo ZIP bytes: $((Get-Item -LiteralPath $PhotosZip).Length)",
        'Note: A restore test is still recommended.'
    ) | Set-Content -LiteralPath $InfoFile -Encoding UTF8

    Rename-Item -LiteralPath $WorkingDir -NewName $Timestamp
    Write-Host "Backup completed: $FinalDir" -ForegroundColor Green

    # Retain old complete backups for 30 days. Never remove incomplete backups here.
    $Cutoff = (Get-Date).AddDays(-$RetentionDays)
    Get-ChildItem -LiteralPath $BackupRoot -Directory |
        Where-Object { $_.Name -match '^\d{4}-\d{2}-\d{2}_\d{6}$' -and $_.CreationTime -lt $Cutoff } |
        ForEach-Object { Remove-Item -LiteralPath $_.FullName -Recurse -Force }
    Write-Host 'Finished successfully.' -ForegroundColor Green
    exit 0
} catch {
    Write-Host "BACKUP FAILED: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Incomplete files (if any) remain in: $WorkingDir"
    exit 1
}
