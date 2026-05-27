import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initTapTapSDK, isTapTapEnv } from './utils/tapTapSDK';

function log(msg: string) {
  try { var f = (window as any).__addLog; if (typeof f === 'function') f(msg); } catch (e) {}
}

log('[main] 开始');

function initSDKAsync() {
  log('[main] 延迟初始化 TapTap SDK（确保先渲染）');
  setTimeout(() => {
    log('[main] 开始异步初始化 TapTap SDK');
    Promise.resolve().then(async () => {
      try {
        if (isTapTapEnv()) {
          const success = await initTapTapSDK();
          log('[main] TapTap SDK 初始化' + (success ? '成功' : '失败/超时'));
        } else {
          log('[main] 非 TapTap 环境，跳过 SDK 初始化');
        }
      } catch (e: any) {
        log('[main] SDK 初始化异常: ' + (e.message || String(e)));
      }
    }).catch((e: any) => {
      log('[main] SDK 异步初始化未捕获异常: ' + (e.message || String(e)));
    });
  }, 100);
}

function start() {
  log('[main] DOM就绪，渲染React');
  var el = document.getElementById('root');
  if (!el) { log('[main] 错误: root不存在'); return; }
  try {
    ReactDOM.createRoot(el).render(
      React.createElement(App)
    );
    log('[main] React渲染完成');
  } catch (e: any) {
    log('[main] 渲染异常: ' + (e.message || String(e)));
  }
  try { var h = (window as any).__hideLoading; if (typeof h === 'function') h(); } catch (e) {}
}

if (document.readyState === 'loading') {
  log('[main] DOM未就绪，等待DOMContentLoaded');
  document.addEventListener('DOMContentLoaded', () => {
    start();
    initSDKAsync();
  });
} else {
  log('[main] DOM已就绪');
  start();
  initSDKAsync();
}
