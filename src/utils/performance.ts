/**
 * Performance optimization utilities
 */

/**
 * Throttle a function call
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    }
  };
}

/**
 * Debounce a function call
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

/**
 * Request animation frame with fallback
 */
export const requestAnimFrame = (
  typeof window !== 'undefined' &&
  (window.requestAnimationFrame ||
    (window as unknown as { webkitRequestAnimationFrame?: typeof requestAnimationFrame }).webkitRequestAnimationFrame ||
    (window as unknown as { mozRequestAnimationFrame?: typeof requestAnimationFrame }).mozRequestAnimationFrame ||
    function (callback: FrameRequestCallback) {
      return window.setTimeout(callback, 1000 / 60);
    })
) || function (callback: FrameRequestCallback) {
  return setTimeout(callback, 1000 / 60);
};

/**
 * Cancel animation frame with fallback
 */
export const cancelAnimFrame = (
  typeof window !== 'undefined' &&
  (window.cancelAnimationFrame ||
    (window as unknown as { webkitCancelAnimationFrame?: typeof cancelAnimationFrame }).webkitCancelAnimationFrame ||
    (window as unknown as { mozCancelAnimationFrame?: typeof cancelAnimationFrame }).mozCancelAnimationFrame ||
    function (id: number) {
      window.clearTimeout(id);
    })
) || function (id: number) {
  clearTimeout(id);
};

/**
 * Memoize a function result
 */
export function memoize<T extends (...args: unknown[]) => unknown>(
  func: T
): (...args: Parameters<T>) => ReturnType<T> {
  const cache = new Map<string, ReturnType<T>>();
  
  return (...args: Parameters<T>): ReturnType<T> => {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key)!;
    }
    
    const result = func(...args) as ReturnType<T>;
    cache.set(key, result);
    return result;
  };
}

/**
 * Create a simple object pool for reusing objects
 */
export class ObjectPool<T> {
  private available: T[] = [];
  private inUse: Set<T> = new Set();

  constructor(
    private factory: () => T,
    private reset: (obj: T) => void,
    initialSize: number = 10
  ) {
    for (let i = 0; i < initialSize; i++) {
      this.available.push(factory());
    }
  }

  acquire(): T {
    let obj = this.available.pop();
    if (!obj) {
      obj = this.factory();
    }
    this.inUse.add(obj);
    return obj;
  }

  release(obj: T): void {
    if (this.inUse.has(obj)) {
      this.inUse.delete(obj);
      this.reset(obj);
      this.available.push(obj);
    }
  }

  clear(): void {
    this.available = [];
    this.inUse.clear();
  }
}

/**
 * Simple performance monitor
 */
export class PerformanceMonitor {
  private startTime: number = 0;
  private frameCount: number = 0;
  private fps: number = 0;
  private lastFpsUpdate: number = 0;

  start(): void {
    this.startTime = performance.now();
  }

  update(): void {
    this.frameCount++;
    const now = performance.now();
    
    if (now - this.lastFpsUpdate >= 1000) {
      this.fps = Math.round((this.frameCount * 1000) / (now - this.lastFpsUpdate));
      this.frameCount = 0;
      this.lastFpsUpdate = now;
    }
  }

  getFPS(): number {
    return this.fps;
  }

  getElapsedTime(): number {
    return performance.now() - this.startTime;
  }
}
