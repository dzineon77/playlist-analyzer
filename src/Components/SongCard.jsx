const SongCard = ({ song, isSelected, onClick }) => (
  <>
    <div 
      className={`min-w-[150px] p-5 rounded-lg cursor-pointer transition-all duration-300 transform hover:scale-103 ${
        isSelected ? 'bg-green shadow-lg' : 'bg-gray'
      }`}
      onClick={onClick}
    >
      <div className="w-full aspect-square mb-3 rounded-lg overflow-hidden">
        <img 
          src={song.coverImage} 
          alt={`${song.title} cover`}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <h3 className="font-semibold text-gray-800 truncate">{song.title}</h3>
      <p className="text-sm text-gray-600">{song.artist}</p>
    </div>
    </>
  );

  export default SongCard;