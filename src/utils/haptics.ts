// Haptic feedback utility for enhanced user experience
export const hapticFeedback = {
  // Light haptic feedback for button taps
  light: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
  },

  // Medium haptic feedback for form submissions
  medium: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(25);
    }
  },

  // Strong haptic feedback for errors or important actions
  strong: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  },

  // Success pattern for completed actions
  success: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([30, 100, 30]);
    }
  },

  // Error pattern for failed actions
  error: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([50, 100, 50, 100, 50]);
    }
  },

  // Notification pattern for alerts
  notification: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([100, 200, 100]);
    }
  }
};

// Button interaction utility
export const handleButtonInteraction = (type: 'light' | 'medium' | 'strong' | 'success' | 'error' | 'notification' = 'light') => {
  hapticFeedback[type]();
};

// Enhanced click handler with haptic feedback
export const createHapticClickHandler = (
  originalHandler: () => void,
  hapticType: 'light' | 'medium' | 'strong' | 'success' | 'error' | 'notification' = 'light'
) => {
  return () => {
    hapticFeedback[hapticType]();
    originalHandler();
  };
};