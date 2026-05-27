@echo off
chcp 65001 >nul
echo ============================================
echo   成帝，等闲之事 - TapTap小游戏 一键测试
echo ============================================
echo.
echo [提示] 直接打开 dist-taptap/index.html 会因
echo        CORS安全策略导致白屏，必须通过服务器访问。
echo.
echo [操作] 即将启动本地测试服务器...
echo.

cd /d "%~dp0\.."

echo [1/2] 重新构建...
call npm run build
if %ERRORLEVEL% neq 0 (
    echo 构建失败！
    pause
    exit /b 1
)
echo 构建完成！

echo.
echo [2/2] 启动测试服务器并打开浏览器...
echo.

start http://localhost:8080

echo 正在启动服务器，请在浏览器中测试游戏...
echo 如果浏览器没有自动打开，请手动访问: http://localhost:8080
echo.
echo 按 Ctrl+C 停止服务器
echo.

node scripts\preview.js

pause