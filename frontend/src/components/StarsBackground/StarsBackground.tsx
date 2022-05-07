import React from 'react';
import './StarsBackground.scss';

const StarsBackground: React.FC = () => {
  const countOfStars = 10;
  return (
    <div className="stars">
      {Array.from({ length: countOfStars }).map((item, key) => (
        <div key={key} className="star"></div>
      ))}
    </div>
  );
};

export default StarsBackground;
