import React from 'react';

export const PGCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
      {/* Image skeleton */}
      <div className="h-48 bg-gray-300"></div>
      
      <div className="p-4">
        {/* Title skeleton */}
        <div className="h-6 bg-gray-300 rounded mb-2"></div>
        
        {/* Location skeleton */}
        <div className="h-4 bg-gray-300 rounded w-3/4 mb-3"></div>
        
        {/* Rating skeleton */}
        <div className="flex items-center space-x-2 mb-3">
          <div className="h-4 w-4 bg-gray-300 rounded"></div>
          <div className="h-4 bg-gray-300 rounded w-16"></div>
        </div>
        
        {/* Amenities skeleton */}
        <div className="flex flex-wrap gap-2 mb-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-6 bg-gray-300 rounded-full w-16"></div>
          ))}
        </div>
        
        {/* Price and button skeleton */}
        <div className="flex items-center justify-between">
          <div>
            <div className="h-6 bg-gray-300 rounded w-20 mb-1"></div>
            <div className="h-3 bg-gray-300 rounded w-16"></div>
          </div>
          <div className="h-9 bg-gray-300 rounded w-20"></div>
        </div>
      </div>
    </div>
  );
};

export const SearchFiltersSkeleton: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md animate-pulse">
      <div className="h-6 bg-gray-300 rounded mb-4 w-24"></div>
      
      <div className="space-y-4">
        {/* Location filter */}
        <div>
          <div className="h-4 bg-gray-300 rounded w-16 mb-2"></div>
          <div className="h-10 bg-gray-300 rounded"></div>
        </div>
        
        {/* Price range filter */}
        <div>
          <div className="h-4 bg-gray-300 rounded w-20 mb-2"></div>
          <div className="flex space-x-2">
            <div className="h-10 bg-gray-300 rounded flex-1"></div>
            <div className="h-10 bg-gray-300 rounded flex-1"></div>
          </div>
        </div>
        
        {/* Room type filter */}
        <div>
          <div className="h-4 bg-gray-300 rounded w-20 mb-2"></div>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-2">
                <div className="h-4 w-4 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded w-16"></div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Button skeleton */}
        <div className="h-10 bg-gray-300 rounded"></div>
      </div>
    </div>
  );
};

export const PGDetailsSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 animate-pulse">
      {/* Image gallery skeleton */}
      <div className="h-96 md:h-[500px] bg-gray-300"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content skeleton */}
          <div className="lg:col-span-2 space-y-8">
            {/* Basic info skeleton */}
            <div>
              <div className="h-8 bg-gray-300 rounded mb-4 w-3/4"></div>
              <div className="h-4 bg-gray-300 rounded mb-4 w-1/2"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                <div className="h-4 bg-gray-300 rounded w-4/6"></div>
              </div>
            </div>
            
            {/* Amenities skeleton */}
            <div>
              <div className="h-6 bg-gray-300 rounded mb-4 w-32"></div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-16 bg-gray-300 rounded"></div>
                ))}
              </div>
            </div>
            
            {/* Room types skeleton */}
            <div>
              <div className="h-6 bg-gray-300 rounded mb-4 w-40"></div>
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="h-24 bg-gray-300 rounded"></div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Sidebar skeleton */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="h-6 bg-gray-300 rounded mb-4 w-24"></div>
              <div className="h-8 bg-gray-300 rounded mb-4 w-32"></div>
              <div className="h-4 bg-gray-300 rounded mb-6 w-28"></div>
              <div className="h-12 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ReviewSkeleton: React.FC = () => {
  return (
    <div className="bg-white p-4 rounded-lg border animate-pulse">
      <div className="flex items-start space-x-3">
        <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div className="h-4 bg-gray-300 rounded w-24"></div>
            <div className="h-4 bg-gray-300 rounded w-16"></div>
          </div>
          <div className="space-y-2 mb-2">
            <div className="h-4 bg-gray-300 rounded"></div>
            <div className="h-4 bg-gray-300 rounded w-5/6"></div>
          </div>
          <div className="h-3 bg-gray-300 rounded w-20"></div>
        </div>
      </div>
    </div>
  );
};

export const TableSkeleton: React.FC<{ rows?: number; cols?: number }> = ({ 
  rows = 5, 
  cols = 4 
}) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden animate-pulse">
      {/* Header */}
      <div className="bg-gray-300 h-12"></div>
      
      {/* Rows */}
      <div className="divide-y divide-gray-200">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="flex divide-x divide-gray-200">
            {Array.from({ length: cols }).map((_, colIndex) => (
              <div key={colIndex} className="flex-1 p-4">
                <div className="h-4 bg-gray-300 rounded"></div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export const FormSkeleton: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md animate-pulse">
      <div className="h-6 bg-gray-300 rounded mb-6 w-48"></div>
      
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i}>
            <div className="h-4 bg-gray-300 rounded mb-2 w-24"></div>
            <div className="h-10 bg-gray-300 rounded"></div>
          </div>
        ))}
        
        <div className="flex space-x-4 pt-4">
          <div className="h-10 bg-gray-300 rounded flex-1"></div>
          <div className="h-10 bg-gray-300 rounded flex-1"></div>
        </div>
      </div>
    </div>
  );
};

export const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className="flex items-center justify-center">
      <div 
        className={`animate-spin rounded-full border-b-2 border-primary-600 ${sizeClasses[size]}`}
      ></div>
    </div>
  );
};
