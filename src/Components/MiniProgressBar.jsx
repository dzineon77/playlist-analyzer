import React from 'react';

const MiniProgressBar = ({ value, label }) => (
  <div className="flex flex-col items-center p-2 bg-white rounded-lg shadow">
    <div className="w-full bg-gray rounded-full h-4 mb-2 overflow-hidden">
      <div 
        className="bg-blue h-full rounded-full transition-all duration-300 ease-in-out"
        style={{ width: `${value * 100}%` }}
      ></div>
    </div>
    <span className="text-sm font-medium">{label}</span>
    <span className="text-xs text-gray-500">{value.toFixed(3)}</span>
  </div>
);

export default MiniProgressBar;