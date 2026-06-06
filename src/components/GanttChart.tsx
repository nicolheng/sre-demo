import React from 'react';

interface GanttTask {
  name: string;
  startPercent: number; 
  widthPercent: number; 
  actualStartPercent: number;
  actualWidthPercent: number;
  status: 'on-time' | 'slippage-minor' | 'slippage-critical';
  details: string;
}

const mockTasks: GanttTask[] = [
  { name: 'System Architecture Design', startPercent: 5, widthPercent: 20, actualStartPercent: 5, actualWidthPercent: 18, status: 'on-time', details: 'Setup codebase and TS templates.' },
  { name: 'Interface Component Coding', startPercent: 25, widthPercent: 25, actualStartPercent: 25, actualWidthPercent: 32, status: 'slippage-minor', details: 'Delayed 3 days matching CSS variables.' },
  { name: 'Database Integration & Rules', startPercent: 50, widthPercent: 30, actualStartPercent: 50, actualWidthPercent: 42, status: 'slippage-critical', details: 'Delayed 7 days on security configurations.' },
  { name: 'Compliance Checklist Testing', startPercent: 80, widthPercent: 15, actualStartPercent: 92, actualWidthPercent: 8, status: 'slippage-minor', details: 'Awaiting coordinator feedback.' }
];

export const GanttChart: React.FC = () => {
  return (
    <div className="gantt-chart">
      <div className="gantt-timeline-header">
        <div style={{ fontWeight: 600 }}>Task Description</div>
        <div className="gantt-months">
          <span>Week 1 (May 1)</span>
          <span>Week 2</span>
          <span>Week 3</span>
          <span>Week 4</span>
          <span>Week 5 (June 6)</span>
        </div>
      </div>
      
      {mockTasks.map(task => {
        return (
          <div className="gantt-row" key={task.name} style={{ borderBottom: '1px solid var(--color-border)', padding: '12px 0' }}>
            <div className="gantt-task-name">
              <span style={{ fontWeight: 600, display: 'block' }}>{task.name}</span>
              <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 'normal' }}>
                {task.details}
              </span>
            </div>
            <div className="gantt-bar-container" style={{ margin: '8px 0' }}>
              {/* Baseline Bar */}
              <div 
                className="gantt-bar-baseline"
                style={{ 
                  left: `${task.startPercent}%`, 
                  width: `${task.widthPercent}%` 
                }}
                title="Baseline Timeline Target"
              />
              {/* Actual Bar */}
              <div 
                className={`gantt-bar-actual ${task.status}`}
                style={{ 
                  left: `${task.actualStartPercent}%`, 
                  width: `${task.actualWidthPercent}%` 
                }}
                title={`Actual Completion Status: ${task.status}`}
              >
                {task.status === 'on-time' ? 'On Time' : task.status === 'slippage-minor' ? 'Minor Delay' : 'Critical Slippage'}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default GanttChart;
