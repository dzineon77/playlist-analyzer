import React, { useState } from 'react';
import Spotify_Logo from '../Assets/Spotify_logo_without_text.svg.png';
import { SquareChevronLeft } from 'lucide-react';
import FeatureCell from './FeatureCell';
import { useSpotifyAPI } from './useSpotifyAPI';

export default function SearchPlaylists({ playlists }) {

    const [selectedPlaylist, setSelectedPlaylist] = useState(null);
    const [selectedPlaylistTracks, setSelectedPlaylistTracks] = useState(null);
    const [trackAudioFeatures, setTrackAudioFeatures] = useState(null);
    const [error, setError] = useState(null);
    const accessToken = sessionStorage.getItem('access_token');

    const { fetchFromSpotify } = useSpotifyAPI(accessToken);

    const getPlaylistData = async (playlistID) => {
        const data = await fetchFromSpotify(`playlists/${playlistID}`);
        if (data) {
            setSelectedPlaylist(data);
            setSelectedPlaylistTracks(parsePlaylistTracks(data.tracks.items));
            setError(null);
        } else {
            setSelectedPlaylist([]);
            setSelectedPlaylistTracks([]);
            setError(`Failed to fetch playlist: ${error.message}`);
        }
    }

    const getTrackAudioFeatures = async (trackID) => {
        const data = await fetchFromSpotify(`audio-features/${trackID}`);
        if (data) {
            setTrackAudioFeatures(data);
            setError(null);
        } else {
            setTrackAudioFeatures([]);
            setError(`Failed to fetch track audio features: ${error.message}`);
        }
    };
    
    const handlePlaylistClick = (playlistID) => {
        getPlaylistData(playlistID);
    };

    const handleFilter = (event) => {
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

    const parsePlaylistTracks = (trackList) => {
        const tracks = [];

        trackList.forEach((track) => {
            if (track.track) {
                tracks.push(track);
            }
        });
        console.log(tracks);
        return tracks;
    };

    const handleTrackClick = (trackID) => {
        getTrackAudioFeatures(trackID);
    };

    const returnToMenu = () => {
        setSelectedPlaylist(null);
        setSelectedPlaylistTracks(null);
        setTrackAudioFeatures(null);
    };

    
    return (
        <div className="SearchPlaylists max-w-4xl mx-auto px-4 min-w-full">

            {error && <p className="text-red-500">{error}</p>}

            {!selectedPlaylist ? (

            <>
                <input
                    type="text"
                    id="myInput"
                    onKeyUp={handleFilter}
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
                                    onClick={() => handlePlaylistClick(playlist.id)} />
                            </div>
                            <p className="font-semibold text-center">{playlist.name || 'Untitled Playlist'}</p>
                            <p className="text-sm text-gray-600">Tracks: {playlist.tracks ? playlist.tracks.total : 'N/A'}</p>
                        </li>
                    ))}
                </ul>
            </>

            ) :

            <>
            <button onClick={() => returnToMenu()} className="flex justify-left "><SquareChevronLeft size={36}>Back</SquareChevronLeft></button>

            {selectedPlaylistTracks && selectedPlaylistTracks.length > 0 ? (
                
                <>

                <input
                type="text"
                id="myInput"
                onKeyUp={handleFilter}
                placeholder="Search tracks ..."
                className="w-full p-2 mb-4 border rounded"
                />

                <div className="gridContainer h-96 overflow-y-scroll mb-8">
                    <ul id="myUL" className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-4">
                        {selectedPlaylistTracks.map((track, index) => (
                            <li key={index} className="flex flex-col items-center overflow-hidden">
                                <div className="w-40 h-40 mb-2 overflow-hidden rounded-lg cursor-pointer">
                                    <img
                                    className="w-full h-full object-cover"
                                    src={track.track.album.images && track.track.album.images.length > 0 ? track.track.album.images[0].url : Spotify_Logo}
                                    alt={track.track.name || 'Track'}
                                    onClick={() => handleTrackClick(track.track.id)}
                                    />
                                </div>
                                <p className="font-semibold text-center">{track.track.name || 'Untitled Track'}</p>
                                <p className="text-sm text-gray-600">{track.track.artists ? track.track.artists.map((artist) => artist.name).join(', ') : 'N/A'}</p>
                            </li>
                        ))}
                    </ul>
                </div>

                {trackAudioFeatures && (
                <div className="trackAudioFeatures grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 my-8">
                    <FeatureCell label="Mode" value={trackAudioFeatures.mode ? 'Major' : 'Minor'} useProgressBar={false} />
                    <FeatureCell label="Tempo" value={`${trackAudioFeatures.tempo} bpm`} useProgressBar={false} />
                    <FeatureCell label="Duration" value={`${Math.floor((trackAudioFeatures.duration_ms/1000)/60)}m ${Math.round((trackAudioFeatures.duration_ms/1000)%60,0)}s`} useProgressBar={false} />
                    <FeatureCell label="Time Signature" value={trackAudioFeatures.time_signature} useProgressBar={false} />

                    <FeatureCell label="Danceability" value={trackAudioFeatures.danceability} />
                    <FeatureCell label="Energy" value={trackAudioFeatures.energy} />
                    <FeatureCell label="Speechiness" value={trackAudioFeatures.speechiness} />
                    <FeatureCell label="Acousticness" value={trackAudioFeatures.acousticness} />
                    <FeatureCell label="Instrumentalness" value={trackAudioFeatures.instrumentalness} />
                    <FeatureCell label="Liveness" value={trackAudioFeatures.liveness} />
                    <FeatureCell label="Valence" value={trackAudioFeatures.valence} />
                    <FeatureCell label="Loudness" value={`${trackAudioFeatures.loudness} dB`} useProgressBar={false} />

                </div>
            )}

                </>

            ) : (
                <p className="text-red-500">No tracks found in this playlist.</p>
            )}

            <script src="https://open.spotify.com/embed/iframe-api/v1" async></script>

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