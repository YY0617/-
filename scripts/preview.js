import { createServer } from 'http';
import { readFileSync, existsSync } from 'fs';
import { join, extname, resolve } from 'path';

const __dirname = resolve();
const DIST_DIR = join(__dirname, 'dist-taptap');
const PORT = 8080;

if (!existsSync(DIST_DIR)) {
  console.error('错误: dist-taptap 目录不存在，请先运行 npm run build');
  process.exit(1);
}

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

const server = createServer((req, res) => {
  let url = req.url || '/';
  if (url === '/') url = '/index.html';

  const filePath = join(DIST_DIR, url);

  try {
    if (existsSync(filePath)) {
      const content = readFileSync(filePath);
      const ext = extname(filePath);
      const mime = mimeTypes[ext] || 'application/octet-stream';
      res.writeHead(200, {
        'Content-Type': mime,
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache',
      });
      res.end(content);
    } else {
      res.writeHead(404);
      res.end('Not Found');
    }
  } catch (err) {
    res.writeHead(500);
    res.end('Internal Server Error');
  }
});

server.listen(PORT, () => {
  console.log('');
  console.log('========================================');
  console.log('  TapTap 小游戏本地预览服务器');
  console.log('  打开浏览器访问:');
  console.log(`  http://localhost:${PORT}`);
  console.log(`  http://127.0.0.1:${PORT}`);
  console.log('========================================');
  console.log('');
  console.log('按 Ctrl+C 停止服务器');
});