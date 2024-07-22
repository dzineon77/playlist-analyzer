import React from 'react';
import MiniProgressBar from './MiniProgressBar';

const FeatureCell = ({ label, value, useProgressBar = true }) => (
  <div className="bg-white p-2 rounded-lg shadow">
    {useProgressBar ? (
      <MiniProgressBar value={value} label={label} />
    ) : (
      <>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-sm">{value}</p>
      </>
    )}
  </div>
);

export default FeatureCell;