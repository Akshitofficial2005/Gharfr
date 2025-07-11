// PWA utilities
export const registerServiceWorker = (): void => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    });
  }
};

// Push notifications
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }

  const permission = await Notification.requestPermission();
  return permission === 'granted';
};

export const showNotification = (title: string, options?: NotificationOptions): void => {
  if (Notification.permission === 'granted') {
    new Notification(title, {
      icon: '/logo192.png',
      badge: '/logo192.png',
      ...options
    });
  }
};

// Touch gestures
export class TouchGestureHandler {
  private startX: number = 0;
  private startY: number = 0;
  private threshold: number = 50;

  constructor(private element: HTMLElement, private callbacks: {
    onSwipeLeft?: () => void;
    onSwipeRight?: () => void;
    onSwipeUp?: () => void;
    onSwipeDown?: () => void;
  }) {
    this.setupListeners();
  }

  private setupListeners(): void {
    this.element.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: true });
    this.element.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: true });
  }

  private handleTouchStart(e: TouchEvent): void {
    this.startX = e.touches[0].clientX;
    this.startY = e.touches[0].clientY;
  }

  private handleTouchEnd(e: TouchEvent): void {
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    
    const deltaX = endX - this.startX;
    const deltaY = endY - this.startY;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (Math.abs(deltaX) > this.threshold) {
        if (deltaX > 0) {
          this.callbacks.onSwipeRight?.();
        } else {
          this.callbacks.onSwipeLeft?.();
        }
      }
    } else {
      if (Math.abs(deltaY) > this.threshold) {
        if (deltaY > 0) {
          this.callbacks.onSwipeDown?.();
        } else {
          this.callbacks.onSwipeUp?.();
        }
      }
    }
  }
}

// Install prompt
export const handleInstallPrompt = (): void => {
  let deferredPrompt: any;

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    // Show install button
    const installButton = document.getElementById('install-button');
    if (installButton) {
      installButton.style.display = 'block';
      
      // Remove existing listeners to prevent duplicates
      const newButton = installButton.cloneNode(true) as HTMLElement;
      installButton.parentNode?.replaceChild(newButton, installButton);
      
      newButton.addEventListener('click', async (event) => {
        event.preventDefault();
        
        if (deferredPrompt) {
          try {
            await deferredPrompt.prompt();
            const choiceResult = await deferredPrompt.userChoice;
            
            if (choiceResult.outcome === 'accepted') {
              console.log('User accepted the install prompt');
              newButton.style.display = 'none';
            }
          } catch (error) {
            console.log('Install prompt failed:', error);
          } finally {
            deferredPrompt = null;
          }
        }
      });
    }
  });
};