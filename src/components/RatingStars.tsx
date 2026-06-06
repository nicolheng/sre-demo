import React from 'react';

interface RatingStarsProps {
  rating: number;
  onChange?: (rating: number) => void;
  readOnly?: boolean;
}

export const RatingStars: React.FC<RatingStarsProps> = ({ rating, onChange, readOnly = false }) => {
  return (
    <div style={{ display: 'flex', gap: '4px', fontSize: '20px' }}>
      {[1, 2, 3, 4, 5].map(star => (
        <span
          key={star}
          style={{ 
            color: star <= rating ? 'gold' : '#cbd5e1', 
            cursor: readOnly ? 'default' : 'pointer',
            transition: 'color 0.1s ease'
          }}
          onClick={() => !readOnly && onChange && onChange(star)}
        >
          ★
        </span>
      ))}
    </div>
  );
};
export default RatingStars;
