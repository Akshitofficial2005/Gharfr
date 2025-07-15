import React from 'react';
import { safeRenderLocation } from '../utils/locationUtils';

interface SafeLocationRendererProps {
  location: any;
  className?: string;
  showIcon?: boolean;
  iconComponent?: React.ReactNode;
}

const SafeLocationRenderer: React.FC<SafeLocationRendererProps> = ({
  location,
  className = '',
  showIcon = false,
  iconComponent
}) => {
  const locationString = safeRenderLocation(location);
  
  if (!locationString) {
    return <span className={className}>Location not available</span>;
  }

  return (
    <span className={className}>
      {showIcon && iconComponent}
      {locationString}
    </span>
  );
};

export default SafeLocationRenderer;