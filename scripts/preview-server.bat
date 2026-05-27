@echo off
chcp 65001 >nul
echo ============================================
echo   成帝，等闲之事 - TapTap小游戏 本地预览
echo ============================================
echo.
echo 正在启动本地预览服务器...
echo.

cd /d "%~dp0\.."

if not exist "dist-taptap" (
    echo [错误] 请先运行: scripts\quick-test.bat
    pause
    exit /b 1
)

start http://localhost:8080
node scripts\preview.js
pause