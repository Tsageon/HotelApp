import React from 'react';
import './Fade.css'; 

const Fade = ({ children, duration = 500 }) => {
  return (
    <div className="fade" style={{ animationDuration: `${duration}ms` }}>
      {children}
    </div>
  );
};

export default Fade;
