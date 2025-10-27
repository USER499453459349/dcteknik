@echo off
echo 🚀 DC TEKNİK - Manuel Server Başlatma
echo ======================================

echo 📍 Mevcut dizin kontrol ediliyor...
cd /d "%~dp0"
echo ✅ Dizin: %CD%

echo.
echo 🐍 Python kontrol ediliyor...
python --version
if %errorlevel% neq 0 (
    echo ❌ Python bulunamadı!
    pause
    exit /b 1
)

echo.
echo 🌐 Server başlatılıyor...
echo 📡 Adres: http://localhost:8000
echo ⏹️  Durdurmak için Ctrl+C tuşlayın
echo.

python -m http.server 8000

pause

