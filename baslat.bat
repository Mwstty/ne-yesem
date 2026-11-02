@echo off
chcp 65001 >nul
title Ne Yesem?
cd /d "%~dp0"

echo ====================================
echo        NE YESEM? BAŞLATILIYOR
echo ====================================
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo [HATA] Node.js bilgisayarınızda kurulu değil.
  echo        Lütfen https://nodejs.org adresinden "LTS" sürümünü indirip kurun,
  echo        sonra bu dosyaya tekrar çift tıklayın.
  echo.
  pause
  exit /b 1
)

where npm >nul 2>nul
if errorlevel 1 (
  echo [HATA] npm bulunamadı. Node.js kurulumunuz eksik olabilir.
  echo        https://nodejs.org adresinden Node.js'i yeniden kurun.
  echo.
  pause
  exit /b 1
)

if not exist ".env" (
  copy ".env.example" ".env" >nul
  echo .env dosyası oluşturuldu.
)

findstr /R /C:"^GOOGLE_MAPS_API_KEY=.\+" ".env" >nul 2>nul
if errorlevel 1 (
  echo [UYARI] API anahtarı eksik: GOOGLE_MAPS_API_KEY boş.
  echo         Site DEMO MODU'nda açılacak ^(örnek veriler^).
  echo         Gerçek veri için .env dosyasını not defteriyle açıp anahtarı yazın.
  echo.
)

if not exist "node_modules" (
  echo Bağımlılıklar kuruluyor, lütfen bekleyin...
  call npm install
  if errorlevel 1 (
    echo.
    echo [HATA] npm install başarısız oldu. İnternet bağlantınızı kontrol edin.
    pause
    exit /b 1
  )
)

if not exist "dist\index.html" (
  echo Site derleniyor...
  call npm run build
  if errorlevel 1 (
    echo.
    echo [HATA] Site derlenemedi. Yukarıdaki hata mesajına bakın.
    pause
    exit /b 1
  )
)

echo.
echo Sunucu hazırlanıyor...
echo Tarayıcı açılıyor... ^(http://localhost:3000^)
echo Kapatmak için bu pencereyi kapatın.
echo.

start "" /min cmd /c "timeout /t 3 /nobreak >nul & start http://localhost:3000"
node server\index.js

echo.
echo [HATA] Sunucu durdu. Yukarıdaki mesajı kontrol edin.
pause
