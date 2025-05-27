@echo off
echo ===========================================
echo    DIGITALMEDSUITE
echo ===========================================
echo.

echo Iniciando Backend...
cd backend
start "Backend" cmd /k "dotnet run"

echo.
echo Backend iniciado en: http://localhost:5180/api/Secure
echo.
echo Presiona [1] para abrir el frontend en el navegador
echo Presiona cualquier otra tecla para salir
echo.
set /p choice="Opcion: "

if "%choice%"=="1" (
    echo Abriendo navegador...
    start http://127.0.0.1:5500/frontend/pages/index.html
)

echo.
pause
