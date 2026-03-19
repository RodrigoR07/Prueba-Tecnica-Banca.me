export default function ScoreGauge({ score }) {
  const radius = 70;
  const stroke = 10;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * Math.PI; // semicírculo
  const offset = circumference - (score / 100) * circumference;

  const color =
    score >= 80 ? '#2E7D5E' :
    score >= 60 ? '#0288D1' :
    score >= 40 ? '#ED6C02' :
    '#C0392B';

  const label =
    score >= 80 ? 'Excelente' :
    score >= 60 ? 'Bueno' :
    score >= 40 ? 'Regular' :
    'Alto riesgo';

  return (
    <div style={{ textAlign: 'center' }}>
      <svg width={radius * 2} height={radius + stroke + 24} style={{ overflow: 'visible' }}>
        {/* Track */}
        <path
          d={`M ${stroke / 2} ${radius} A ${normalizedRadius} ${normalizedRadius} 0 0 1 ${radius * 2 - stroke / 2} ${radius}`}
          fill="none"
          stroke="#E8E0D5"
          strokeWidth={stroke}
          strokeLinecap="round"
        />
        {/* Progress */}
        <path
          d={`M ${stroke / 2} ${radius} A ${normalizedRadius} ${normalizedRadius} 0 0 1 ${radius * 2 - stroke / 2} ${radius}`}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
        {/* Score text */}
        <text x={radius} y={radius - 6} textAnchor="middle" fontSize="28" fontWeight="700" fill="#1A1A2E">
          {score}
        </text>
        <text x={radius} y={radius + 14} textAnchor="middle" fontSize="12" fill={color} fontWeight="600">
          {label}
        </text>
      </svg>
      <div style={{ fontSize: '11px', color: '#6B6B7B', marginTop: 2 }}>Score crediticio / 100</div>
    </div>
  );
}