import React from 'react';

const spinnerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '200px',
};

const dotStyle = {
  width: '12px',
  height: '12px',
  margin: '0 6px',
  borderRadius: '50%',
  backgroundColor: '#ef0381',
  animation: 'bounce 1.4s infinite ease-in-out both',
};

const LoadingSpinner = () => (
  <div style={spinnerStyle}>
    <style>{`
      @keyframes bounce {
        0%, 80%, 100% { transform: scale(0); }
        40% { transform: scale(1); }
      }
    `}</style>
    <div style={{ ...dotStyle, animationDelay: '-0.32s' }} />
    <div style={{ ...dotStyle, animationDelay: '-0.16s' }} />
    <div style={dotStyle} />
  </div>
);

export default LoadingSpinner;
