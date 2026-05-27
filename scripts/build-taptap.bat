@echo off
chcp 65001 >nul
echo ============================================
echo   成帝，等闲之事 - TapTap小游戏 构建打包
echo ============================================
echo.
echo ⚠ 重要提示:
echo   直接双击 index.html 会因 CORS 安全策略白屏！
echo   必须通过服务器访问。构建后用以下方式测试:
echo   - 开发测试: npm run dev
echo   - 本地预览: scripts\preview-server.bat
echo   - TapTap平台: 上传 game.zip 自动托管
echo.

cd /d "%~dp0\.."

echo [1/3] 检查依赖...
if not exist "node_modules" (
    echo 安装依赖...
    call npm install
    if %ERRORLEVEL% neq 0 (
        echo 依赖安装失败！
        pause
        exit /b 1
    )
) else (
    echo 依赖已就绪。
)

echo.
echo [2/3] 构建 TapTap 小游戏版本...
call npm run build
if %ERRORLEVEL% neq 0 (
    echo 构建失败！
    pause
    exit /b 1
)
echo 构建完成！

echo.
echo [3/3] 打包为 TapTap 上传包...
node scripts\package-taptap.js
if %ERRORLEVEL% neq 0 (
    echo 打包失败！
    pause
    exit /b 1
)
echo.
echo ============================================
echo   构建打包完成！
echo   上传包: tap-tap-dist\game.zip
echo ============================================
echo.
echo 📋 上架TapTap需要准备的资料:
echo   1. 游戏图标 (512x512 PNG/JPG)   - 源文件: public/favicon.svg
echo   2. 游戏截图 (至少3张)
echo   3. 隐私政策URL - 见下方说明
echo   4. 游戏描述 - 修仙放置RPG
echo   5. 分类选择: 小游戏
echo.
echo 🔗 隐私政策URL处理方案:
echo   方案A (推荐): 将 privacy.html 上传到GitHub Pages
echo              或你的服务器, 得到一个公网URL
echo              示例: https://your-name.github.io/privacy.html
echo.
echo   方案B: 在TapTap开发者平台填写隐私政策时
echo           直接粘贴 privacy.html 内容到文本框
echo.
echo   隐私政策文件位置: public\privacy.html
echo.
echo 🧪 本地测试:
echo   scripts\quick-test.bat      - 构建+测试
echo   scripts\preview-server.bat  - 仅启动测试服务器
echo ============================================
pause