import React, { useState, useEffect } from 'react';
import { X, ArrowRight, ArrowLeft, Check } from 'lucide-react';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  target: string;
  position: 'top' | 'bottom' | 'left' | 'right';
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 'search',
    title: 'Search for PGs',
    description: 'Use the search bar to find PGs in your preferred location',
    target: '[data-tour="search"]',
    position: 'bottom'
  },
  {
    id: 'filters',
    title: 'Apply Filters',
    description: 'Use filters to narrow down your search based on price, amenities, and more',
    target: '[data-tour="filters"]',
    position: 'bottom'
  },
  {
    id: 'favorites',
    title: 'Save Favorites',
    description: 'Click the heart icon to save PGs you like for later',
    target: '[data-tour="favorites"]',
    position: 'left'
  },
  {
    id: 'profile',
    title: 'Manage Profile',
    description: 'Access your profile, bookings, and settings from here',
    target: '[data-tour="profile"]',
    position: 'bottom'
  }
];

const OnboardingTour: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('hasSeenOnboarding');
    if (!hasSeenTour) {
      setTimeout(() => setIsActive(true), 1000);
    }
  }, []);

  useEffect(() => {
    if (isActive && currentStep < onboardingSteps.length) {
      const target = document.querySelector(onboardingSteps[currentStep].target) as HTMLElement;
      setTargetElement(target);
      
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        target.style.position = 'relative';
        target.style.zIndex = '1001';
      }
    }
  }, [isActive, currentStep]);

  const nextStep = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      finishTour();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const finishTour = () => {
    setIsActive(false);
    localStorage.setItem('hasSeenOnboarding', 'true');
    if (targetElement) {
      targetElement.style.zIndex = '';
    }
  };

  const skipTour = () => {
    finishTour();
  };

  if (!isActive || currentStep >= onboardingSteps.length) return null;

  const step = onboardingSteps[currentStep];
  const progress = ((currentStep + 1) / onboardingSteps.length) * 100;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-1000" />
      
      {/* Tour Card */}
      <div className="fixed z-1002 bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-4"
           style={{
             top: '50%',
             left: '50%',
             transform: 'translate(-50%, -50%)'
           }}>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Step Counter */}
        <div className="text-sm text-gray-500 mb-2">
          Step {currentStep + 1} of {onboardingSteps.length}
        </div>

        {/* Content */}
        <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
        <p className="text-gray-600 mb-6">{step.description}</p>

        {/* Actions */}
        <div className="flex justify-between items-center">
          <button
            onClick={skipTour}
            className="text-gray-500 hover:text-gray-700 text-sm"
          >
            Skip Tour
          </button>
          
          <div className="flex space-x-2">
            {currentStep > 0 && (
              <button
                onClick={prevStep}
                className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back
              </button>
            )}
            
            <button
              onClick={nextStep}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {currentStep === onboardingSteps.length - 1 ? (
                <>
                  <Check className="w-4 h-4 mr-1" />
                  Finish
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={skipTour}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </>
  );
};

export default OnboardingTour;