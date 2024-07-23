import React, { useState } from 'react';
import Spotify_Logo from '../Assets/Spotify_logo_without_text.svg.png';
import { SquareChevronLeft } from 'lucide-react';

export default function SearchPlaylists({ playlists }) {

    const [selectedPlaylist, setSelectedPlaylist] = useState(null);
    const [error, setError] = useState(null);
    const accessToken = sessionStorage.getItem('access_token');

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

    const getPlaylistData = async (playlistID) => {
        try {
            const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistID}`, {
                headers: { 'Authorization': `Bearer ${accessToken}` }
            });

            const data = await response.json();
            console.log(data.tracks.items);
            setSelectedPlaylist(data);
            setError(null);
        } catch (error) {
            console.log('Error fetching playlist:', error);
            setSelectedPlaylist([]);
            setError("Failed to fetch playlist: " + error.message);
        }
    }
    
    const handleClick = (playlistID) => {
        getPlaylistData(playlistID);
    };

    
    return (
        <div className="SearchPlaylists max-w-4xl mx-auto px-4 min-w-full">

            {error && <p className="text-red-500">{error}</p>}

            {!selectedPlaylist ? (

            <>
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
                            <div className="w-40 h-40 mb-2 overflow-hidden rounded-lg cursor-pointer">
                                <img
                                    className="w-full h-full object-cover"
                                    src={playlist.images && playlist.images.length > 0 ? playlist.images[0].url : Spotify_Logo}
                                    alt={playlist.name || 'Playlist'}
                                    onClick={() => handleClick(playlist.id)} />
                            </div>
                            <p className="font-semibold text-center">{playlist.name || 'Untitled Playlist'}</p>
                            <p className="text-sm text-gray-600">Tracks: {playlist.tracks ? playlist.tracks.total : 'N/A'}</p>
                        </li>
                    ))}
                </ul>
            </>

            ) :

            <>
            <button onClick={() => setSelectedPlaylist(null)} className="flex justify-left "><SquareChevronLeft size={36}>Back</SquareChevronLeft></button>

            <script src="https://open.spotify.com/embed/iframe-api/v1" async></script>
            
            <input
                type="text"
                id="myInput"
                onKeyUp={handleInputChange}
                placeholder="Search tracks ..."
                className="w-full p-2 mb-4 border rounded"
            />

            {/* <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-4">
                {selectedPlaylist.tracks.items.map((track, index) => (
                    <div key={index} className="flex flex-col items-center">
                        <div className="w-40 h-40 mb-2 overflow-hidden rounded-lg">
                            <img
                                className="w-full h-full object-cover"
                                src={track.track.album.images && track.track.album.images.length > 0 ? track.track.album.images[0].url : Spotify_Logo}
                                alt={track.track.name || 'Track'} />
                        </div>
                        <p className="font-semibold text-center">{track.track || 'Untitled Track'}</p>
                        <p className="text-sm text-gray-600">{track.track.artists.map(artist => artist.name).join(', ')}</p>
                    </div>
                ))}
            </div> */}


            <div id="embed-iframe">
                <iframe
                    title="Spotify Playlist"
                    src={`https://open.spotify.com/embed/playlist/${selectedPlaylist.id}`}
                    width="100%"
                    height="500"
                    allowtransparency="true"
                    allow="encrypted-media"
                    className='mb-4'
                ></iframe>
            </div>

            </>
            }
        </div>
    );
}