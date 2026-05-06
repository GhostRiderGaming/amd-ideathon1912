'use client';

export default function MacroRing({ current = 0, target = 100, color = '#10b981', label = '', unit = 'g', size = 72 }) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(current / (target || 1), 1);
  const offset = circumference - pct * circumference;
  const display = Math.round(current);

  return (
    <div className="macro-ring" aria-label={`${label}: ${display}${unit} of ${target}${unit}`} role="meter" aria-valuemin={0} aria-valuemax={target} aria-valuenow={current}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5"/>
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke={color} strokeWidth="5"
          strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset}
          transform={`rotate(-90 ${size/2} ${size/2})`} className="macro-ring-progress"
          style={{ filter: `drop-shadow(0 0 4px ${color}40)` }}
        />
      </svg>
      <div className="macro-ring-content">
        <span className="macro-ring-value">{display}</span>
      </div>
      <span className="macro-ring-label" style={{ color }}>{label}</span>
      <span className="macro-ring-sub">{display}/{target}{unit}</span>
    </div>
  );
}
