import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary]', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          background: '#1a1a2e', color: '#fff', padding: '20px',
          fontFamily: 'sans-serif', zIndex: 99999
        }}>
          <h1 style={{ color: '#e2b714', marginBottom: '16px' }}>游戏加载异常</h1>
          <p style={{ color: '#8899aa', marginBottom: '24px', textAlign: 'center', maxWidth: '320px' }}>
            很抱歉，游戏遇到了一个问题。请尝试重新启动。
          </p>
          <div style={{
            background: 'rgba(255,255,255,0.1)', borderRadius: '8px', padding: '16px',
            maxWidth: '320px', width: '100%', marginBottom: '24px',
            fontFamily: 'monospace', fontSize: '12px', color: '#ff6666',
            wordBreak: 'break-all', maxHeight: '200px', overflow: 'auto'
          }}>
            {this.state.error?.message || '未知错误'}
          </div>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '12px 32px', background: '#e2b714', color: '#1a1a2e',
              border: 'none', borderRadius: '8px', fontSize: '16px',
              fontWeight: 'bold', cursor: 'pointer'
            }}
          >
            重新加载
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
