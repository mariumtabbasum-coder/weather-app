import React from 'react';

interface SkeletonProps {
  className?: string;
  height?: string | number;
  width?: string | number;
  borderRadius?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  height = '20px',
  width = '100%',
  borderRadius = 'var(--radius-md)',
}) => {
  return (
    <div
      className={`skeleton-box ${className}`}
      style={{
        height: typeof height === 'number' ? `${height}px` : height,
        width: typeof width === 'number' ? `${width}px` : width,
        borderRadius,
      }}
    />
  );
};

export const WeatherCardSkeleton: React.FC = () => {
  return (
    <div className="weather-hero-card glass-card" style={{ minHeight: '260px' }}>
      <div className="flex justify-between items-center mb-6">
        <Skeleton width="180px" height="28px" />
        <Skeleton width="90px" height="24px" borderRadius="9999px" />
      </div>
      <div className="flex justify-between items-center my-6">
        <div>
          <Skeleton width="120px" height="64px" className="mb-2" />
          <Skeleton width="140px" height="20px" />
        </div>
        <Skeleton width="72px" height="72px" borderRadius="50%" />
      </div>
      <div className="grid grid-cols-3 gap-3 pt-3 border-t border-white/5">
        <Skeleton height="36px" />
        <Skeleton height="36px" />
        <Skeleton height="36px" />
      </div>
    </div>
  );
};

export const ForecastListSkeleton: React.FC = () => {
  return (
    <div className="forecast-list">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="forecast-row glass-card">
          <Skeleton width="70px" height="20px" />
          <div className="flex items-center gap-3 flex-1 px-4">
            <Skeleton width="30px" height="30px" borderRadius="50%" />
            <Skeleton width="100px" height="18px" />
          </div>
          <Skeleton width="60px" height="20px" />
        </div>
      ))}
    </div>
  );
};
