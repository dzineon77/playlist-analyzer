import React, { useState } from 'react';
import TrackCard from '../Components/TrackCard';
import SongCard from '../Components/SongCard';
import { SquareChevronLeft } from 'lucide-react';
import { useSpotifyAPI } from './useSpotifyAPI';
import { debounce } from 'lodash';

export default function SearchPlaylists({ playlists }) {

    const [selectedPlaylist, setSelectedPlaylist] = useState(null);
    const [selectedPlaylistTracks, setSelectedPlaylistTracks] = useState(null);
    const [trackAudioFeatures, setTrackAudioFeatures] = useState(null);
    const [error, setError] = useState(null);
    const accessToken = sessionStorage.getItem('access_token');

    const { fetchFromSpotify } = useSpotifyAPI(accessToken);

    // max # tracks returned is 100
    const getPlaylistData = async (playlistID) => {
        const data = await fetchFromSpotify(`playlists/${playlistID}`);
        if (data) {
            setSelectedPlaylist(data);
            // console.log(data);
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
        const container = document.getElementById("myUL");
        const cards = container.getElementsByClassName("SongCard");
        
        for (let i = 0; i < cards.length; i++) {
          const title = cards[i].querySelector('h3').textContent;
          const subtitle = cards[i].querySelector('p').textContent;
          const txtValue = title + ' ' + subtitle;
          
          if (txtValue.toUpperCase().indexOf(filter) > -1) {
            cards[i].style.display = "";
          } else {
            cards[i].style.display = "none";
          }
        }
      };

    const debouncedHandleFilter = debounce(handleFilter, 500);

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
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 w-full">

            {error && <p className="text-red-500 text-center py-2">{error}</p>}

            {!selectedPlaylist ? (

            <>
                    <input
                        type="text"
                        id="myInput"
                        onKeyUp={debouncedHandleFilter}
                        placeholder="Search playlists ..."
                        className="w-full p-2 mb-4 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" id="myUL">
                    {playlists.map((playlist) => (
                        <SongCard
                        key={playlist.id}
                        item={playlist}
                        isPlaylist={true}
                        onClick={handlePlaylistClick}
                        />
                    ))}
                    </div>
                </>

            ) : 

            <>
            <button onClick={() => returnToMenu()} className="mb-6 p-2 md:p-4 md:absolute top-2 left-2 md:top-4 md:left-4 text-gray hover:text-gray-dark transition-colors"><SquareChevronLeft size={30}>Back</SquareChevronLeft></button>

            {selectedPlaylistTracks && selectedPlaylistTracks.length > 0 ? (
                
                <>

                <input
                type="text"
                id="myInput"
                onKeyUp={debouncedHandleFilter}
                placeholder="Search tracks ..."
                className="w-full p-2 mb-4 border rounded"
                />

                <div className="gridContainer h-96 overflow-y-scroll mb-8">

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-4 mb-8" id="myUL">
                        {selectedPlaylistTracks.map((track, index) => (
                            <SongCard
                            key={index}
                            item={track}
                            isPlaylist={false}
                            onClick={handleTrackClick}
                            isSelected={trackAudioFeatures?.id === track.track.id}
                            />
                        ))}
                    </div>
                </div>

                {trackAudioFeatures && (

                    <div className="mb-8">
                        <TrackCard audioFeatures={trackAudioFeatures} />
                    </div>
            
            )}

                </>

            ) : (
                <p className="text-red-500">No tracks found in this playlist.</p>
            )}

            <div className="aspect-video md:aspect-square max-w-2xl rounded-lg overflow-hidden shadow-lg spotify-embed-fix">

                <iframe
                    title="Spotify Playlist"
                    src={`https://open.spotify.com/embed/playlist/${selectedPlaylist.id}`}
                    width="100%"
                    height="100%"
                    // allowTransparency="true"
                    allow="encrypted-media"
                    className="border-0" // Negative margin only on medium and large screens
                />

            </div>

            </>

            }
        </div>
    );
}