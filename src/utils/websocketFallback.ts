/**
 * WebSocket fallback utility
 * Provides fallback mechanisms for WebSocket connections
 */

// Fallback WebSocket class that mimics the WebSocket API but doesn't actually connect
class FallbackWebSocket implements WebSocket {
  // Static properties required by WebSocket interface
  static readonly CLOSED = 3;
  static readonly CLOSING = 2;
  static readonly CONNECTING = 0;
  static readonly OPEN = 1;
  
  // Instance properties required by WebSocket interface
  readonly CLOSED = 3;
  readonly CLOSING = 2;
  readonly CONNECTING = 0;
  readonly OPEN = 1;
  
  url: string;
  protocol: string;
  readyState: number = WebSocket.CLOSED;
  bufferedAmount: number = 0;
  extensions: string = '';
  binaryType: BinaryType = 'blob';
  
  // Event handlers
  onopen: ((this: WebSocket, ev: Event) => any) | null = null;
  onmessage: ((this: WebSocket, ev: MessageEvent) => any) | null = null;
  onclose: ((this: WebSocket, ev: CloseEvent) => any) | null = null;
  onerror: ((this: WebSocket, ev: Event) => any) | null = null;
  
  constructor(url: string, protocols?: string | string[]) {
    this.url = url;
    this.protocol = Array.isArray(protocols) ? protocols[0] || '' : protocols || '';
    
    // Simulate an error after a short delay
    setTimeout(() => {
      if (this.onerror) {
        const errorEvent = new Event('error');
        this.onerror.call(this, errorEvent);
      }
      
      if (this.onclose) {
        const closeEvent = new CloseEvent('close', { 
          wasClean: false, 
          code: 1006, 
          reason: 'Connection failed - using fallback mode' 
        });
        this.onclose.call(this, closeEvent);
      }
    }, 100);
    
    // Log the fallback usage
    console.warn('Using WebSocket fallback for:', url);
  }
  
  // Methods that do nothing in fallback mode
  close(code?: number, reason?: string): void {}
  send(data: string | ArrayBufferLike | Blob | ArrayBufferView): void {}
  
  // Event listener methods
  addEventListener<K extends keyof WebSocketEventMap>(
    type: K, 
    listener: (this: WebSocket, ev: WebSocketEventMap[K]) => any, 
    options?: boolean | AddEventListenerOptions
  ): void {}
  
  removeEventListener<K extends keyof WebSocketEventMap>(
    type: K, 
    listener: (this: WebSocket, ev: WebSocketEventMap[K]) => any, 
    options?: boolean | EventListenerOptions
  ): void {}
  
  dispatchEvent(event: Event): boolean {
    return false;
  }
}

// Create a WebSocket with fallback
export const createWebSocketWithFallback = (
  url: string, 
  protocols?: string | string[],
  options: { 
    retryCount?: number,
    retryDelay?: number,
    fallbackMode?: boolean
  } = {}
): WebSocket => {
  // If we're in fallback mode or the connection state indicates the server is down
  if (options.fallbackMode || 
      (window.connectionState && window.connectionState.websocket.available === false)) {
    return new FallbackWebSocket(url, protocols) as unknown as WebSocket;
  }
  
  // Otherwise create a real WebSocket
  try {
    return new WebSocket(url, protocols);
  } catch (error) {
    console.error('WebSocket creation failed:', error);
    return new FallbackWebSocket(url, protocols) as unknown as WebSocket;
  }
};

// Check if WebSocket is available
export const isWebSocketAvailable = async (
  url: string = 'ws://localhost:3000/ws',
  timeout: number = 3000
): Promise<boolean> => {
  return new Promise((resolve) => {
    try {
      const ws = new WebSocket(url);
      
      const timeoutId = setTimeout(() => {
        ws.close();
        resolve(false);
      }, timeout);
      
      ws.onopen = () => {
        clearTimeout(timeoutId);
        ws.close();
        resolve(true);
      };
      
      ws.onerror = () => {
        clearTimeout(timeoutId);
        resolve(false);
      };
    } catch (error) {
      resolve(false);
    }
  });
};

export default {
  createWebSocketWithFallback,
  isWebSocketAvailable
};