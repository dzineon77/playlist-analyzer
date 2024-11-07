import React from 'react';
import Spotify_Logo from '../Assets/Spotify_logo_without_text.svg.png';

const SongCard = ({ item, isPlaylist = false, onClick, isSelected = false }) => {
  const getImage = () => {
    if (isPlaylist) {
      return item.images?.[0]?.url || Spotify_Logo;
    }
    return item.track.album.images?.[0]?.url || Spotify_Logo;
  };

  const getTitle = () => {
    if (isPlaylist) {
      return item.name || 'Untitled Playlist';
    }
    return item.track.name || 'Untitled Track';
  };

  const getSubtitle = () => {
    if (isPlaylist) {
      return `Tracks: ${item.tracks?.total || 'N/A'}`;
    }
    return item.track.artists?.map(artist => artist.name).join(', ') || 'N/A';
  };

  return (
    <div className='SongCard'>
      <div
        className={`
          w-full p-4 rounded-lg cursor-pointer transition-all duration-300
          ${isSelected 
            ? 'bg-green shadow-lg' 
            : 'bg-white/80 hover:bg-white/90 shadow hover:shadow-md'
          }
        `}
        onClick={() => onClick(isPlaylist ? item.id : item.track.id)}
      >
        <div className={`w-full aspect-square mb-3 overflow-hidden rounded-lg`}>
          <img
            src={getImage()}
            alt={`${getTitle()} cover`}
            className="w-full h-full object-contain"
            loading="lazy"
          />
        </div>
        <h3 className="font-semibold text-sm md:text-base text-gray-800 line-clamp-2">
          {getTitle()}
        </h3>
        <p className="text-xs md:text-sm text-gray-600">
          {getSubtitle()}
        </p>
      </div>
    </div>
  );
};

export default SongCard;