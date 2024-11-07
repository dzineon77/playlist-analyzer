import React from 'react';

const Progress = ({ value, className }) => (
  <div className={`w-full bg-gray rounded-full overflow-hidden md:mb-2 ${className}`}>
    <div 
      className="bg-gray-dark rounded-full h-full"
      style={{ width: `${value}%` }}
    />
  </div>
);

const TrackAnalysis = ({ audioFeatures }) => {
  const metrics = [
    {
      label: 'Mode',
      value: audioFeatures.mode === 1 ? 'Major' : 'Minor',
      type: 'text'
    },
    {
      label: 'Tempo',
      value: `${audioFeatures.tempo.toFixed(3)} bpm`,
      type: 'text'
    },
    {
      label: 'Duration',
      value: `${Math.floor(audioFeatures.duration_ms / 60000)}m ${Math.floor((audioFeatures.duration_ms % 60000) / 1000)}s`,
      type: 'text'
    },
    {
      label: 'Time Signature',
      value: audioFeatures.time_signature,
      type: 'text'
    },
    {
      label: 'Danceability',
      value: audioFeatures.danceability,
      type: 'progress'
    },
    {
      label: 'Energy',
      value: audioFeatures.energy,
      type: 'progress'
    },
    {
      label: 'Speechiness',
      value: audioFeatures.speechiness,
      type: 'progress'
    },
    {
      label: 'Acousticness',
      value: audioFeatures.acousticness,
      type: 'progress'
    },
    {
      label: 'Instrumentalness',
      value: audioFeatures.instrumentalness,
      type: 'progress'
    },
    {
      label: 'Liveness',
      value: audioFeatures.liveness,
      type: 'progress'
    },
    {
      label: 'Valence',
      value: audioFeatures.valence,
      type: 'progress'
    },
    {
      label: 'Loudness',
      value: `${audioFeatures.loudness.toFixed(3)} dB`,
      type: 'text'
    }
  ];

  return (
    <div className="w-full bg-white/90 backdrop-blur rounded-lg shadow-lg">
      <div className="p-6">
        <div className="space-y-4">
          {metrics.map((metric, index) => (
            <div key={metric.label} className="pb-4 border-b border-gray-200 last:border-b-0">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">{metric.label}</span>
                <span className="text-sm text-gray-600">
                  {metric.type === 'progress' 
                    ? `${(metric.value * 100).toFixed(1)}%`
                    : metric.value}
                </span>
              </div>
              {metric.type === 'progress' && (
                <Progress 
                  value={metric.value * 100} 
                  className="h-2"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrackAnalysis;