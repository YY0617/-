// 性能优化工具

import { useRef, useCallback, useEffect, useMemo, useState } from 'react';

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// 节流函数
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// 虚拟滚动配置
export interface VirtualListConfig {
  itemHeight: number;
  containerHeight: number;
  overscan: number;
}

// 简单的虚拟滚动计算
export function calculateVisibleRange(
  scrollTop: number,
  config: VirtualListConfig,
  totalItems: number
): { start: number; end: number } {
  const { itemHeight, containerHeight, overscan } = config;
  
  const start = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const end = Math.min(
    totalItems,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );

  return { start, end };
}

// 使用虚拟滚动的hook
export function useVirtualList(totalItems: number, config: VirtualListConfig) {
  const scrollTop = useRef(0);
  
  const visibleRange = useMemo(() => {
    return calculateVisibleRange(scrollTop.current, config, totalItems);
  }, [scrollTop.current, config, totalItems]);

  const onScroll = useCallback((e: React.UIEvent<HTMLElement>) => {
    scrollTop.current = e.currentTarget.scrollTop;
  }, []);

  return {
    visibleRange,
    onScroll,
  };
}

// 懒加载数据
export function useLazyLoad<T>(
  data: T[],
  initialCount: number = 10,
  increment: number = 10
) {
  const [count, setCount] = useState(initialCount);
  const [isLoading, setIsLoading] = useState(false);

  const loadMore = useCallback(() => {
    if (count >= data.length) return;
    setIsLoading(true);
    setTimeout(() => {
      setCount(prev => Math.min(prev + increment, data.length));
      setIsLoading(false);
    }, 100);
  }, [count, data.length, increment]);

  const visibleData = useMemo(() => data.slice(0, count), [data, count]);

  return {
    visibleData,
    loadMore,
    isLoading,
    hasMore: count < data.length,
  };
}

// 为了完整，我们需要导入types

export function useBatchedUpdate<T>(initialValue: T) {
  const [state, setState] = useState(initialValue);
  const pendingUpdates = useRef<Array<(prev: T) => T>>([]);
  
  const flush = useCallback(() => {
    if (pendingUpdates.current.length > 0) {
      setState(prev => {
        let next = prev;
        for (const update of pendingUpdates.current) {
          next = update(next);
        }
        pendingUpdates.current = [];
        return next;
      });
    }
  }, []);

  const batchUpdate = useCallback((updater: (prev: T) => T) => {
    pendingUpdates.current.push(updater);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(flush, 100);
    return () => clearTimeout(timeout);
  }, [flush]);

  return { state, batchUpdate, flush };
}

// 游戏存档防抖保存
export const saveGameDebounced = debounce((saveFn: () => void) => {
  saveFn();
}, 2000);
