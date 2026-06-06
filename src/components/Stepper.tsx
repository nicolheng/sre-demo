import React from 'react';
import type { Application } from '../types';

interface StepperProps {
  status: Application['status'];
}

export const Stepper: React.FC<StepperProps> = ({ status }) => {
  const steps = ['Submitted', 'Under Review', 'Shortlisted', 'Offered'];
  
  // Calculate active index
  let activeIndex = 0;
  const isRejected = status === 'Rejected';
  const isWithdrawn = status === 'Withdrawn';
  const isAwaiting = status === 'Awaiting Offer Verification';
  const isApproved = status === 'Approved';
  
  if (status === 'Applied') {
    activeIndex = 0;
  } else if (status === 'Screening' || status === 'Interview' || status === 'KIV') {
    activeIndex = 1;
  } else if (status === 'Shortlisted' || isAwaiting) {
    activeIndex = 2;
  } else if (status === 'Offered' || isApproved) {
    activeIndex = 3;
  }
  
  return (
    <div className="stepper-container">
      <div className="stepper-line">
        <div 
          className="stepper-line-progress" 
          style={{ 
            width: isRejected || isWithdrawn ? `${(activeIndex / (steps.length - 1)) * 80}%` : `${(activeIndex / (steps.length - 1)) * 80}%`,
            backgroundColor: isRejected ? 'var(--status-rejected)' : isWithdrawn ? '#64748b' : 'var(--status-offered)'
          }}
        />
      </div>
      {steps.map((step, idx) => {
        let stepClass = '';
        if (isRejected && idx === activeIndex) {
          stepClass = 'rejected';
        } else if (isWithdrawn && idx === activeIndex) {
          stepClass = 'withdrawn';
        } else if (idx < activeIndex) {
          stepClass = 'completed';
        } else if (idx === activeIndex) {
          stepClass = 'active';
        }
        
        let label = step;
        if (idx === 2 && isAwaiting) {
          label = 'Awaiting Offer Verification';
        }
        if (idx === 3) {
          if (isRejected) {
            label = 'Rejected';
          } else if (isWithdrawn) {
            label = 'Withdrawn';
          } else if (isApproved) {
            label = 'Placement Approved';
          }
        }
        
        return (
          <div className={`stepper-step ${stepClass}`} key={step}>
            <div className="stepper-circle" style={
              isRejected && idx === activeIndex ? { backgroundColor: 'var(--status-rejected)', borderColor: 'var(--status-rejected)', color: 'white' } :
              isWithdrawn && idx === activeIndex ? { backgroundColor: '#64748b', borderColor: '#64748b', color: 'white' } : {}
            }>
              {isRejected && idx === activeIndex ? '✕' : isWithdrawn && idx === activeIndex ? '⊘' : idx < activeIndex ? '✓' : idx + 1}
            </div>
            <div className="stepper-label">{label}</div>
          </div>
        );
      })}
    </div>
  );
};
export default Stepper;
