import React from 'react';

interface MobileFrameProps {
  children: React.ReactNode;
  active: boolean;
  onToggle: (val: boolean) => void;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ children, active, onToggle }) => {
  if (!active) {
    return <div className="slide-up">{children}</div>;
  }

  return (
    <div className="mobile-frame-wrapper">
      <div className="mobile-preview-toggle">
        <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => onToggle(false)}>
          🖥️ Switch to Full Screen Desktop
        </button>
      </div>
      <div className="mobile-phone-shell slide-up">
        <div className="mobile-phone-notch" />
        <div className="mobile-screen-content">
          {children}
        </div>
      </div>
    </div>
  );
};
export default MobileFrame;
