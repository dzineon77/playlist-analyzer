const SongCard = ({ song, isSelected, onClick }) => {
  return (
    <div
      className={`
        w-full md:w-48 p-4 rounded-lg cursor-pointer transition-all duration-300
        ${isSelected 
          ? 'bg-green shadow-lg scale-105' 
          : 'bg-gray hover:bg-white/80 shadow hover:shadow-md'
        }
      `}
      onClick={onClick}
    >
      <img
        src={song.coverImage}
        alt={`${song.title} cover`}
        className="w-full h-32 md:h-40 object-cover rounded-md mb-3"
      />
      <h3 className="font-semibold text-sm md:text-base text-gray-800 truncate">
        {song.title}
      </h3>
      <p className="text-xs md:text-sm text-gray-600 truncate">
        {song.artist}
      </p>
    </div>
  );
};

export default SongCard;