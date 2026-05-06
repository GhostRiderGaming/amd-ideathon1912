'use client';

export default function HealthScoreRing({ score = 0, size = 160, label = 'Health Score' }) {
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const offset = circumference - progress;

  const getColor = (s) => {
    if (s >= 75) return '#10b981';
    if (s >= 50) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="health-score-ring" aria-label={`${label}: ${score} out of 100`} role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={score}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8"
        />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none"
          stroke={getColor(score)}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          className="score-ring-progress"
          style={{ filter: `drop-shadow(0 0 8px ${getColor(score)}40)` }}
        />
      </svg>
      <div className="score-ring-content">
        <span className="score-ring-value" style={{ color: getColor(score) }}>{score}</span>
        <span className="score-ring-label">{label}</span>
      </div>
    </div>
  );
}
