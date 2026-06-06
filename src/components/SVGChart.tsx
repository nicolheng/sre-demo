import React from 'react';

interface ChartData {
  label: string;
  value: number;
}

interface SVGChartProps {
  type: 'bar' | 'pie';
  data: ChartData[];
  title: string;
}

export const SVGChart: React.FC<SVGChartProps> = ({ type, data, title }) => {
  const maxVal = Math.max(...data.map(d => d.value), 1);
  const chartHeight = 140;
  const chartWidth = 300;
  
  if (type === 'bar') {
    const barWidth = 36;
    const gap = 24;
    
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
        <h4 style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '16px', fontWeight: 600 }}>{title}</h4>
        <svg width="100%" height={chartHeight + 35} viewBox={`0 0 ${chartWidth} ${chartHeight + 35}`} style={{ overflow: 'visible' }}>
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((p, i) => (
            <line
              key={i}
              x1="30"
              y1={chartHeight * (1 - p) + 10}
              x2={chartWidth}
              y2={chartHeight * (1 - p) + 10}
              stroke="var(--color-border)"
              strokeDasharray="4"
            />
          ))}
          {/* Bars */}
          {data.map((d, index) => {
            const h = (d.value / maxVal) * chartHeight;
            const x = index * (barWidth + gap) + 45;
            const y = chartHeight - h + 10;
            
            return (
              <g key={d.label}>
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={h}
                  fill="var(--color-primary)"
                  rx="4"
                  className="bar-hover"
                />
                <text
                  x={x + barWidth / 2}
                  y={y - 8}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="bold"
                  fill="var(--color-text-main)"
                >
                  {d.value}
                </text>
                <text
                  x={x + barWidth / 2}
                  y={chartHeight + 25}
                  textAnchor="middle"
                  fontSize="10"
                  fill="var(--color-text-muted)"
                  transform={`rotate(-15, ${x + barWidth / 2}, ${chartHeight + 25})`}
                >
                  {d.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    );
  }
  
  // Donut chart drawing using SVG circle segments
  let accumulatedPercent = 0;
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const total = data.reduce((sum, d) => sum + d.value, 0) || 1;
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      <h4 style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '16px', fontWeight: 600 }}>{title}</h4>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <svg width="100" height="100" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={radius} fill="transparent" stroke="#f1f5f9" strokeWidth="10" />
          {data.map((d, i) => {
            const percent = d.value / total;
            const strokeDashoffset = circumference - percent * circumference;
            const strokeDasharray = `${circumference} ${circumference}`;
            const rotation = (accumulatedPercent * 360) - 90;
            accumulatedPercent += percent;
            
            const color = i === 0 ? 'var(--status-offered)' : i === 1 ? 'var(--status-rejected)' : 'var(--color-primary)';
            
            return (
              <circle
                key={d.label}
                cx="50"
                cy="50"
                r={radius}
                fill="transparent"
                stroke={color}
                strokeWidth="10"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                transform={`rotate(${rotation} 50 50)`}
                strokeLinecap="round"
              />
            );
          })}
        </svg>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11px' }}>
          {data.map((d, i) => {
            const color = i === 0 ? 'var(--status-offered)' : i === 1 ? 'var(--status-rejected)' : 'var(--color-primary)';
            return (
              <div key={d.label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: color }} />
                <span style={{ color: 'var(--color-text-muted)' }}>
                  {d.label}: <strong style={{ color: 'var(--color-text-main)' }}>{d.value} ({Math.round((d.value / total) * 100)}%)</strong>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default SVGChart;
