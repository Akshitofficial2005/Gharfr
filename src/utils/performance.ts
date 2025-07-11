// Performance monitoring and optimization utilities
class PerformanceMonitor {
  private metrics: Map<string, number[]> = new Map();
  private observers: PerformanceObserver[] = [];

  constructor() {
    this.initializeObservers();
  }

  private initializeObservers() {
    // Observe navigation timing
    if ('PerformanceObserver' in window) {
      const navObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming;
            this.recordMetric('page_load_time', navEntry.loadEventEnd - navEntry.fetchStart);
            this.recordMetric('dom_content_loaded', navEntry.domContentLoadedEventEnd - navEntry.fetchStart);
            this.recordMetric('first_paint', navEntry.responseEnd - navEntry.fetchStart);
          }
        }
      });
      
      navObserver.observe({ entryTypes: ['navigation'] });
      this.observers.push(navObserver);
    }

    // Observe resource timing
    if ('PerformanceObserver' in window) {
      const resourceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'resource') {
            const resourceEntry = entry as PerformanceResourceTiming;
            this.recordMetric(`resource_${this.getResourceType(resourceEntry.name)}`, 
              resourceEntry.responseEnd - resourceEntry.fetchStart);
          }
        }
      });
      
      resourceObserver.observe({ entryTypes: ['resource'] });
      this.observers.push(resourceObserver);
    }

    // Observe largest contentful paint
    if ('PerformanceObserver' in window) {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.recordMetric('largest_contentful_paint', lastEntry.startTime);
      });
      
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.push(lcpObserver);
    }

    // Observe first input delay
    if ('PerformanceObserver' in window) {
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.recordMetric('first_input_delay', (entry as any).processingStart - entry.startTime);
        }
      });
      
      fidObserver.observe({ entryTypes: ['first-input'] });
      this.observers.push(fidObserver);
    }
  }

  private getResourceType(url: string): string {
    if (url.includes('.js')) return 'javascript';
    if (url.includes('.css')) return 'stylesheet';
    if (url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/)) return 'image';
    if (url.includes('/api/')) return 'api';
    return 'other';
  }

  recordMetric(name: string, value: number) {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    this.metrics.get(name)!.push(value);
    
    // Keep only last 100 measurements
    const values = this.metrics.get(name)!;
    if (values.length > 100) {
      values.shift();
    }
  }

  getMetricStats(name: string) {
    const values = this.metrics.get(name) || [];
    if (values.length === 0) return null;

    const sorted = [...values].sort((a, b) => a - b);
    return {
      count: values.length,
      min: Math.min(...values),
      max: Math.max(...values),
      avg: values.reduce((sum, val) => sum + val, 0) / values.length,
      median: sorted[Math.floor(sorted.length / 2)],
      p95: sorted[Math.floor(sorted.length * 0.95)],
      p99: sorted[Math.floor(sorted.length * 0.99)]
    };
  }

  getAllMetrics() {
    const result: { [key: string]: any } = {};
    Array.from(this.metrics.keys()).forEach(name => {
      result[name] = this.getMetricStats(name);
    });
    return result;
  }

  // Measure function execution time
  measureFunction<T>(name: string, fn: () => T): T {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    this.recordMetric(`function_${name}`, end - start);
    return result;
  }

  // Measure async function execution time
  async measureAsyncFunction<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const start = performance.now();
    const result = await fn();
    const end = performance.now();
    this.recordMetric(`async_function_${name}`, end - start);
    return result;
  }

  // Get memory usage (if available)
  getMemoryUsage() {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return {
        used: Math.round(memory.usedJSHeapSize / 1048576), // MB
        total: Math.round(memory.totalJSHeapSize / 1048576), // MB
        limit: Math.round(memory.jsHeapSizeLimit / 1048576) // MB
      };
    }
    return null;
  }

  // Get network information (if available)
  getNetworkInfo() {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      return {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
        saveData: connection.saveData
      };
    }
    return null;
  }

  // Generate performance report
  generateReport() {
    const metrics = this.getAllMetrics();
    const memory = this.getMemoryUsage();
    const network = this.getNetworkInfo();
    
    return {
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      metrics,
      memory,
      network,
      recommendations: this.generateRecommendations(metrics)
    };
  }

  private generateRecommendations(metrics: { [key: string]: any }): string[] {
    const recommendations: string[] = [];
    
    // Check page load time
    const pageLoadTime = metrics.page_load_time;
    if (pageLoadTime && pageLoadTime.avg > 3000) {
      recommendations.push('Page load time is slow. Consider optimizing images and reducing bundle size.');
    }
    
    // Check LCP
    const lcp = metrics.largest_contentful_paint;
    if (lcp && lcp.avg > 2500) {
      recommendations.push('Largest Contentful Paint is slow. Optimize above-the-fold content.');
    }
    
    // Check FID
    const fid = metrics.first_input_delay;
    if (fid && fid.avg > 100) {
      recommendations.push('First Input Delay is high. Reduce JavaScript execution time.');
    }
    
    // Check API response times
    const apiTimes = metrics.resource_api;
    if (apiTimes && apiTimes.avg > 1000) {
      recommendations.push('API response times are slow. Consider caching and optimization.');
    }
    
    return recommendations;
  }

  // Send performance data to analytics
  sendToAnalytics() {
    const report = this.generateReport();
    
    // Send to your analytics endpoint
    fetch('/api/analytics/performance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(report)
    }).catch(error => {
      console.warn('Failed to send performance data:', error);
    });
  }

  // Cleanup observers
  cleanup() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Image optimization utilities
export const optimizeImage = (url: string, options: {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'jpg' | 'png';
} = {}) => {
  const { width, height, quality = 80, format = 'webp' } = options;
  
  // If using Cloudinary or similar service
  if (url.includes('cloudinary.com')) {
    let transformations = [`q_${quality}`, `f_${format}`];
    
    if (width) transformations.push(`w_${width}`);
    if (height) transformations.push(`h_${height}`);
    
    return url.replace('/upload/', `/upload/${transformations.join(',')}/`);
  }
  
  return url;
};

// Lazy loading utility
export const createIntersectionObserver = (
  callback: (entries: IntersectionObserverEntry[]) => void,
  options: IntersectionObserverInit = {}
) => {
  const defaultOptions = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1,
    ...options
  };
  
  return new IntersectionObserver(callback, defaultOptions);
};

// Bundle size analyzer
export const analyzeBundleSize = () => {
  const scripts = Array.from(document.querySelectorAll('script[src]'));
  const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
  
  return {
    scripts: scripts.length,
    styles: styles.length,
    totalResources: scripts.length + styles.length
  };
};

export const performanceMonitor = new PerformanceMonitor();