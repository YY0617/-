/**
 * TapTap小游戏打包脚本
 * 适用于TapTap普通小游戏包体
 */

import { existsSync, mkdirSync, rmSync, statSync, copyFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const SCRIPT_DIR = dirname(__filename);
const PROJECT_DIR = dirname(SCRIPT_DIR);
const DIST_DIR = join(PROJECT_DIR, 'dist-taptap');
const OUTPUT_DIR = join(PROJECT_DIR, 'tap-tap-dist');
const OUTPUT_ZIP = join(OUTPUT_DIR, 'game.zip');

function ensureDir(dir) {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

function copyDir(src, dest) {
  if (!existsSync(src)) return;
  
  ensureDir(dest);
  
  const entries = readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = join(src, entry.name);
    const destPath = join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      copyFileSync(srcPath, destPath);
    }
  }
}

function createZip() {
  console.log('[TapTap小游戏打包] 开始打包普通小游戏包体...');
  console.log(`[TapTap小游戏打包] 项目目录: ${PROJECT_DIR}`);
  console.log(`[TapTap小游戏打包] 源目录: ${DIST_DIR}`);
  console.log(`[TapTap小游戏打包] 输出: ${OUTPUT_ZIP}`);

  if (!existsSync(DIST_DIR)) {
    console.error('[TapTap小游戏打包] 错误: dist-taptap 目录不存在，请先运行 build 命令');
    process.exit(1);
  }

  ensureDir(OUTPUT_DIR);

  const tempDir = join(OUTPUT_DIR, 'temp-game');
  if (existsSync(tempDir)) {
    rmSync(tempDir, { recursive: true });
  }
  ensureDir(tempDir);

  console.log('[TapTap小游戏打包] 复制构建文件...');
  copyDir(DIST_DIR, tempDir);

  console.log('[TapTap小游戏打包] 复制配置文件...');
  copyFileSync(join(PROJECT_DIR, 'game.json'), join(tempDir, 'game.json'));

  const publicDir = join(PROJECT_DIR, 'public');
  if (existsSync(publicDir)) {
    console.log('[TapTap小游戏打包] 复制public目录文件...');
    copyDir(publicDir, tempDir);
  }

  if (existsSync(OUTPUT_ZIP)) {
    console.log('[TapTap小游戏打包] 删除旧的压缩包...');
    rmSync(OUTPUT_ZIP);
  }

  try {
    console.log('[TapTap小游戏打包] 创建压缩包...');
    execSync(
      `powershell -Command "Compress-Archive -Path '${tempDir}\\*' -DestinationPath '${OUTPUT_ZIP}' -Force"`,
      { stdio: 'inherit', shell: true }
    );
    
    rmSync(tempDir, { recursive: true });
  } catch (err) {
    console.error('[TapTap小游戏打包] 压缩失败:', err);
    if (existsSync(tempDir)) {
      rmSync(tempDir, { recursive: true });
    }
    process.exit(1);
  }

  const stats = statSync(OUTPUT_ZIP);
  console.log('');
  console.log('===========================================');
  console.log('[TapTap小游戏打包] 打包完成!');
  console.log(`[TapTap小游戏打包] 文件大小: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
  console.log(`[TapTap小游戏打包] 输出路径: ${OUTPUT_ZIP}`);
  console.log('===========================================');
  console.log('');
  console.log('【TapTap普通小游戏上传步骤】');
  console.log('  1. 登录 TapTap 开发者后台');
  console.log('  2. 创建新游戏或选择已有游戏');
  console.log('  3. 进入「游戏设置」→「TapPlay」');
  console.log('  4. 选择「上传普通小游戏包体」');
  console.log('  5. 上传 game.zip 文件');
  console.log('  6. 填写游戏信息并提交审核');
}

createZip();