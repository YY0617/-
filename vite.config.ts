import { defineConfig, Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'

function tapTapPlugin(): Plugin {
  let outDir = ''
  return {
    name: 'taptap-html',
    configResolved(config) {
      outDir = config.build.outDir || 'dist-taptap'
    },
    transformIndexHtml: {
      order: 'post',
      handler(html) {
        let result = html
          .replace(/\s+crossorigin\b/g, '')
          .replace(/type="module"/g, '')
          .replace(/<link rel="modulepreload"[^>]*>/g, '')

        const scriptMatch = result.match(/<script[^>]+src="[^"]*"[^>]*><\/script>/g)
        if (scriptMatch) {
          scriptMatch.forEach(s => { result = result.replace(s, '') })
          const bodyClose = result.indexOf('</body>')
          if (bodyClose !== -1) {
            result = result.slice(0, bodyClose) + '\n    ' + scriptMatch.join('\n    ') + '\n  ' + result.slice(bodyClose)
          }
        }
        return result
      },
    },
    closeBundle() {
      const distPath = path.resolve(outDir)
      const indexPath = path.join(distPath, 'index.html')
      if (!fs.existsSync(indexPath)) return

      let html = fs.readFileSync(indexPath, 'utf-8')

      const cssLinkRegex = /<link[^>]*rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/g
      html = html.replace(cssLinkRegex, (match, href) => {
        const cssPath = path.join(distPath, href)
        if (fs.existsSync(cssPath)) {
          const css = fs.readFileSync(cssPath, 'utf-8')
          try { fs.unlinkSync(cssPath) } catch {}
          return `<style>${css}</style>`
        }
        return match
      })

      fs.writeFileSync(indexPath, html, 'utf-8')
    },
  }
}

export default defineConfig({
  base: './',
  build: {
    sourcemap: false,
    outDir: 'dist-taptap',
    manifest: false,
    minify: 'esbuild',
    target: 'es2020',
    cssCodeSplit: false,
    reportCompressedSize: false,
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
        assetFileNames: 'assets/[name]-[hash][extname]',
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  plugins: [react({}), tapTapPlugin()],
  server: {
    port: 5173,
    host: true,
  },
  esbuild: {
    drop: [],
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'es2020',
    },
  },
})