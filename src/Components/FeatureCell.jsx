import React from 'react';
import MiniProgressBar from './MiniProgressBar';

const featureDescriptions = {
  "Mode": "Indicates the modality (major or minor) of the track.",
  "Tempo": "The speed at which a piece of music is played, measured in beats per minute (BPM).",
  "Duration": "The length of the track.",
  "Time Signature": "An indication of rhythm following the number of beats in each measure.",
  "Danceability": "Describes how suitable a track is for dancing.",
  "Energy": "Represents a perceptual measure of intensity and activity.",
  "Speechiness": "Detects the presence of spoken words in a track.",
  "Acousticness": "Measures the acoustic sound of a track.",
  "Instrumentalness": "Predicts whether a track contains no vocals.",
  "Liveness": "Detects the presence of an audience in the recording.",
  "Valence": "Describes the musical positiveness conveyed by a track.",
  "Loudness": "The overall loudness of a track in decibels (dB)."
};

const FeatureCell = ({ label, value, useProgressBar = true }) => (
  <>
  <div className='relative group'>

    <div className="bg-white p-2 rounded-lg shadow hover:bg-gray cursor-pointer">
      {useProgressBar ? (
        <MiniProgressBar value={value} label={label} />
      ) : (
        <>
          <p className="text-sm font-medium">{label}</p>
          <p className="text-sm">{value}</p>
        </>
      )}
    </div>
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-white text-black text-xs rounded py-1 px-2 z-10 w-48">
      {featureDescriptions[label]}
      <svg className="absolute text-black h-2 w-full left-0 top-full" viewBox="0 0 255 255" xmlSpace="preserve">
          <polygon className="fill-current" points="0,0 127.5,127.5 255,0" />
      </svg>
    </div>

  </div>
  </>
);

export default FeatureCell;