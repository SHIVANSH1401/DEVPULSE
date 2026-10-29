import React from 'react';

/**
 * SkeletonLoader Component - Guarantees ZERO Cumulative Layout Shift (CLS)
 * Perfectly matches TaskCard.jsx dimensions (height: 138px, padding: 1rem)
 */
export const SkeletonLoader = ({ count = 3 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="skeleton-card" aria-hidden="true">
          <div className="skeleton-shimmer" />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="skeleton-line medium" />
            <div className="skeleton-line short" style={{ width: '25%' }} />
          </div>
          <div className="skeleton-line full" style={{ height: '10px' }} />
          <div className="skeleton-line short" style={{ height: '10px' }} />
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 'auto',
              paddingTop: '0.4rem',
            }}
          >
            <div className="skeleton-line short" style={{ width: '30%', height: '18px', borderRadius: '4px' }} />
            <div
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.08)',
              }}
            />
          </div>
        </div>
      ))}
    </>
  );
};

export default SkeletonLoader;
