import React from 'react';
import Spotify_Logo from '../Assets/Spotify_logo_without_text.svg.png';

export default function SearchPlaylists({ playlists }) {
    const handleInputChange = (event) => {
        const filter = event.target.value.toUpperCase();
        const ul = document.getElementById("myUL");
        const li = ul.getElementsByTagName("li");
        
        for (let i = 0; i < li.length; i++) {
            const a = li[i].getElementsByTagName("p")[0];
            const txtValue = a.textContent || a.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                li[i].style.display = "";
            } else {
                li[i].style.display = "none";
            }
        }
    };
    
    return (
        <div className="SearchPlaylists max-w-4xl mx-auto px-4">
            <input
                type="text"
                id="myInput"
                onKeyUp={handleInputChange}
                placeholder="Search playlists ..."
                className="w-full p-2 mb-4 border rounded"
            />
            
            <ul id="myUL" className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-4">
                {playlists.map((playlist, index) => (
                    <li key={index} className="flex flex-col items-center">
                        <div className="w-40 h-40 mb-2 overflow-hidden rounded-lg">
                            <img 
                                className="w-full h-full object-cover" 
                                src={playlist.images && playlist.images.length > 0 ? playlist.images[0].url : Spotify_Logo} 
                                alt={playlist.name || 'Playlist'} 
                            />
                        </div>
                        <p className="font-semibold text-center">{playlist.name || 'Untitled Playlist'}</p>
                        <p className="text-sm text-gray-600">Tracks: {playlist.tracks ? playlist.tracks.total : 'N/A'}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}