# DC TEKNİK - Server Başlatma Script
# PowerShell hatalarını düzeltir ve serveri zorla başlatır

Write-Host "🚀 DC TEKNİK - Server başlatılıyor..." -ForegroundColor Green

# Klasör adı problemini çöz
$currentPath = Get-Location
Write-Host "📍 Mevcut dizin: $currentPath" -ForegroundColor Yellow

# Python kontrolü
try {
    $pythonVersion = python --version 2>&1
    Write-Host "✅ Python bulundu: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Python bulunamadı! Lütfen Python'u yükleyin." -ForegroundColor Red
    exit 1
}

# Port kontrolü
$port = 8000
$portCheck = netstat -an | Select-String ":$port"
if ($portCheck) {
    Write-Host "⚠️  Port $port zaten kullanımda, farklı port denenecek..." -ForegroundColor Yellow
    $port = 8001
}

# Server başlatma
Write-Host "🌐 Server başlatılıyor: http://localhost:$port" -ForegroundColor Cyan

try {
    # Python server başlat
    python -m http.server $port
} catch {
    Write-Host "❌ Server başlatılamadı: $($_.Exception.Message)" -ForegroundColor Red
    
    # Alternatif yöntem
    Write-Host "🔄 Alternatif yöntem deneniyor..." -ForegroundColor Yellow
    Start-Process python -ArgumentList "-m", "http.server", $port -WindowStyle Normal
}

Write-Host "✅ Server başlatma işlemi tamamlandı!" -ForegroundColor Green
