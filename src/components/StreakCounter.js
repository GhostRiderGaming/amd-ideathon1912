'use client';

export default function StreakCounter({ count = 0 }) {
  return (
    <div className="streak-counter" role="status" aria-label={`${count} day streak`}>
      <span className={`streak-flame ${count > 0 ? 'active' : ''}`}>🔥</span>
      <div className="streak-info">
        <span className="streak-number">{count}</span>
        <span className="streak-label">day streak</span>
      </div>
    </div>
  );
}
