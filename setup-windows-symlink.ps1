param(
    [string]$TargetPath = "C:\Users\mypc\Desktop\dctenık.com",
    [string]$LinkPath = "C:\sites\dctenik.com"
)

Write-Host "DC TEKNIK - Windows Symlink Setup" -ForegroundColor Cyan

try {
    if (-not (Test-Path -Path (Split-Path $LinkPath -Parent))) {
        New-Item -ItemType Directory -Path (Split-Path $LinkPath -Parent) -Force | Out-Null
    }

    if (Test-Path -Path $LinkPath) {
        Write-Host "Link path already exists: $LinkPath" -ForegroundColor Yellow
    } else {
        New-Item -ItemType SymbolicLink -Path $LinkPath -Target $TargetPath | Out-Null
        Write-Host "Created symlink: $LinkPath -> $TargetPath" -ForegroundColor Green
    }

    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1) Use ASCII path for all commands:" -ForegroundColor Gray
    Write-Host "   cd $LinkPath" -ForegroundColor White
    Write-Host "2) Run git commands from this path to avoid encoding issues." -ForegroundColor Gray
    exit 0
}
catch {
    Write-Host "Error creating symlink. Try running PowerShell as Administrator." -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}




