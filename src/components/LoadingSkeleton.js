'use client';

export default function LoadingSkeleton({ type = 'card', count = 1 }) {
  const items = Array.from({ length: count });

  if (type === 'ring') {
    return <div className="skeleton skeleton-ring" role="status" aria-label="Loading"></div>;
  }

  if (type === 'text') {
    return (
      <div className="skeleton-group" role="status" aria-label="Loading">
        {items.map((_, i) => (
          <div key={i} className="skeleton skeleton-text" style={{ width: `${70 + Math.random() * 30}%` }}></div>
        ))}
      </div>
    );
  }

  return (
    <div className="skeleton-group" role="status" aria-label="Loading">
      {items.map((_, i) => (
        <div key={i} className="skeleton skeleton-card"></div>
      ))}
    </div>
  );
}
