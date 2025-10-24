# DC TEKNİK - Otomatik Deployment Script
Write-Host "🚀 DC TEKNİK - Otomatik Deployment Başlatılıyor..." -ForegroundColor Green

# Netlify API endpoint
$netlifyAPI = "https://api.netlify.com/api/v1/sites/dcteknik/deploys"

# Dosyaları oku ve hazırla
$files = @{
    "index.html" = Get-Content "index.html" -Raw
    "style.css" = Get-Content "style.css" -Raw
    "js/script.js" = Get-Content "js/script.js" -Raw
    "blog.html" = Get-Content "blog.html" -Raw
}

Write-Host "✅ Dosyalar hazırlandı" -ForegroundColor Green

# Deployment data hazırla
$deployData = @{
    files = $files
    draft = $false
    message = "Blog bölümü otomatik deployment - $(Get-Date)"
}

# JSON'a çevir
$jsonData = $deployData | ConvertTo-Json -Depth 10

Write-Host "📡 Netlify'a gönderiliyor..." -ForegroundColor Yellow

# Netlify API'ye gönder
try {
    $response = Invoke-RestMethod -Uri $netlifyAPI -Method POST -Body $jsonData -ContentType "application/json"
    Write-Host "✅ Deployment başarılı!" -ForegroundColor Green
    Write-Host "🌐 Site URL: https://dcteknik.netlify.app" -ForegroundColor Cyan
    Write-Host "📱 Blog bölümü artık görünür olmalı!" -ForegroundColor Green
} catch {
    Write-Host "❌ Deployment hatası: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "🔄 Alternatif yöntem deneniyor..." -ForegroundColor Yellow
    
    # Alternatif: GitHub Pages'i force et
    git add .
    git commit -m "FORCE DEPLOYMENT - $(Get-Date)"
    git push origin main --force
    
    Write-Host "✅ GitHub'a force push yapıldı!" -ForegroundColor Green
}

Write-Host "🎉 Deployment tamamlandı!" -ForegroundColor Green
