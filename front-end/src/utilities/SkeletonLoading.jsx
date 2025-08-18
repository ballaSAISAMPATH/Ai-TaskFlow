import React from 'react';

const SkeletonBase = ({ className = '', width, height, rounded = false }) => (
  <div
    className={`bg-gray-200 animate-pulse ${rounded ? 'rounded-full' : 'rounded'} ${className}`}
    style={{ width, height }}
  />
);

const SkeletonText = ({ lines = 1, className = '' }) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <SkeletonBase
        key={i}
        className="h-4"
        width={i === lines - 1 ? '75%' : '100%'}
      />
    ))}
  </div>
);

const SkeletonCard = ({ className = '' }) => (
  <div className={`bg-white p-6 rounded-lg shadow-sm border ${className}`}>
    <SkeletonBase className="h-6 mb-4" width="60%" />
    <SkeletonText lines={3} />
  </div>
);

const SkeletonChart = ({ className = '' }) => (
  <div className={`bg-white p-6 rounded-lg shadow-sm border ${className}`}>
    <SkeletonBase className="h-6 mb-4" width="40%" />
    <div className="flex items-end space-x-2 h-32">
      {Array.from({ length: 7 }).map((_, i) => (
        <SkeletonBase
          key={i}
          className="flex-1"
          height={`${Math.random() * 80 + 20}%`}
        />
      ))}
    </div>
  </div>
);

const SkeletonTable = ({ rows = 5, columns = 4, className = '' }) => (
  <div className={`bg-white rounded-lg shadow-sm border overflow-hidden ${className}`}>
    <div className="p-4 border-b bg-gray-50">
      <div className="flex space-x-4">
        {Array.from({ length: columns }).map((_, i) => (
          <SkeletonBase key={i} className="h-4 flex-1" />
        ))}
      </div>
    </div>
    
    <div className="divide-y">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="p-4">
          <div className="flex space-x-4">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <SkeletonBase key={colIndex} className="h-4 flex-1" />
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const SkeletonMetric = ({ className = '' }) => (
  <div className={`bg-white p-6 rounded-lg shadow-sm border text-center ${className}`}>
    <SkeletonBase className="h-8 mb-2 mx-auto" width="60%" />
    <SkeletonBase className="h-12 mb-2 mx-auto" width="80%" />
    <SkeletonBase className="h-4 mx-auto" width="40%" />
  </div>
);

const SkeletonAvatar = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };
  
  return (
    <SkeletonBase 
      className={`${sizeClasses[size]} ${className}`} 
      rounded={true} 
    />
  );
};

const SkeletonList = ({ items = 5, showAvatar = false, className = '' }) => (
  <div className={`bg-white rounded-lg shadow-sm border divide-y ${className}`}>
    {Array.from({ length: items }).map((_, i) => (
      <div key={i} className="p-4 flex items-center space-x-3">
        {showAvatar && <SkeletonAvatar size="md" />}
        <div className="flex-1">
          <SkeletonBase className="h-4 mb-2" width="60%" />
          <SkeletonBase className="h-3" width="40%" />
        </div>
      </div>
    ))}
  </div>
);

const DashboardSkeleton = ({ layout = 'default' }) => {
  const layouts = {
    default: (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <SkeletonBase className="h-8 mb-2" width="300px" />
            <SkeletonBase className="h-4" width="200px" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonMetric key={i} />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <SkeletonChart className="lg:col-span-1" />
            <SkeletonChart className="lg:col-span-1" />
          </div>

          <SkeletonTable className="mb-8" />
        </div>
      </div>
    ),

    analytics: (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <SkeletonBase className="h-8 mb-8" width="250px" />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <SkeletonChart className="lg:col-span-2" />
            <SkeletonList items={6} className="lg:col-span-1" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonMetric key={i} />
            ))}
          </div>
        </div>
      </div>
    ),

    ecommerce: (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <SkeletonBase className="h-8 mb-8" width="200px" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonMetric key={i} />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <SkeletonChart className="lg:col-span-2" />
            <div className="space-y-6">
              <SkeletonCard />
              <SkeletonCard />
            </div>
          </div>

          <SkeletonTable rows={8} columns={5} />
        </div>
      </div>
    ),

    social: (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <SkeletonBase className="h-8 mb-8" width="280px" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonMetric key={i} />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SkeletonChart />
            <SkeletonList items={8} showAvatar={true} />
          </div>
        </div>
      </div>
    )
  };

  return layouts[layout] || layouts.default;
};

export {
  SkeletonBase,
  SkeletonText,
  SkeletonCard,
  SkeletonChart,
  SkeletonTable,
  SkeletonMetric,
  SkeletonAvatar,
  SkeletonList,
  DashboardSkeleton
};
