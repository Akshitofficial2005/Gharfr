import React, { useState } from 'react';
import { Settings, Type, Eye, Volume2, Keyboard } from 'lucide-react';

const AccessibilityMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState({
    fontSize: 'normal',
    highContrast: false,
    screenReader: false,
    keyboardNav: false
  });

  const updateSetting = (key: string, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem('accessibilitySettings', JSON.stringify(newSettings));
    
    // Apply settings
    applyAccessibilitySettings(newSettings);
  };

  const applyAccessibilitySettings = (settings: any) => {
    const root = document.documentElement;
    
    // Font size
    root.classList.remove('text-sm', 'text-lg', 'text-xl');
    if (settings.fontSize === 'large') root.classList.add('text-lg');
    if (settings.fontSize === 'xlarge') root.classList.add('text-xl');
    
    // High contrast
    root.classList.toggle('high-contrast', settings.highContrast);
    
    // Keyboard navigation
    if (settings.keyboardNav) {
      root.classList.add('keyboard-nav');
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        title="Accessibility Settings"
        aria-label="Open accessibility menu"
      >
        <Settings className="w-5 h-5" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border z-50 p-4">
            <h3 className="font-semibold mb-4">Accessibility Settings</h3>
            
            {/* Font Size */}
            <div className="mb-4">
              <label className="flex items-center text-sm font-medium mb-2">
                <Type className="w-4 h-4 mr-2" />
                Font Size
              </label>
              <select
                value={settings.fontSize}
                onChange={(e) => updateSetting('fontSize', e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="normal">Normal</option>
                <option value="large">Large</option>
                <option value="xlarge">Extra Large</option>
              </select>
            </div>

            {/* High Contrast */}
            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.highContrast}
                  onChange={(e) => updateSetting('highContrast', e.target.checked)}
                  className="mr-2"
                />
                <Eye className="w-4 h-4 mr-2" />
                High Contrast Mode
              </label>
            </div>

            {/* Screen Reader */}
            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.screenReader}
                  onChange={(e) => updateSetting('screenReader', e.target.checked)}
                  className="mr-2"
                />
                <Volume2 className="w-4 h-4 mr-2" />
                Screen Reader Support
              </label>
            </div>

            {/* Keyboard Navigation */}
            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.keyboardNav}
                  onChange={(e) => updateSetting('keyboardNav', e.target.checked)}
                  className="mr-2"
                />
                <Keyboard className="w-4 h-4 mr-2" />
                Enhanced Keyboard Navigation
              </label>
            </div>

            <div className="text-xs text-gray-500 mt-4">
              Press Alt+A to open this menu anytime
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AccessibilityMenu;