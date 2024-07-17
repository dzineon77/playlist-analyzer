import React from 'react';

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
        <div className="SearchPlaylists">
            <h2>Search Playlists</h2>
            <input
                type="text"
                id="myInput"
                onKeyUp={handleInputChange}
                placeholder="Search playlists"
            />
            
            <ul id="myUL">
                {playlists.map((playlist, index) => (
                    <li key={index}>
                        <img 
                            className="playlistPic" 
                            src={playlist.images && playlist.images.length > 0 ? playlist.images[0].url : './Assets/Spotify_logo_without_text.svg.png'} 
                            alt={playlist.name || 'Playlist'} 
                        />
                        <p>{playlist.name || 'Untitled Playlist'}</p>
                        <p>Tracks Total: {playlist.tracks ? playlist.tracks.total : 'N/A'}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}