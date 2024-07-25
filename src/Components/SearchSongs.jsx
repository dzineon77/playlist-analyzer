import React, { useState } from 'react';
import FeatureCell from './FeatureCell';
import Instructions from '../Assets/instructions.png';
import { useSpotifyAPI } from './useSpotifyAPI';

export default function SearchSongs() {

    const [trackData, setTrackData] = useState(null);
    const [trackAudioFeatures, settrackAudioFeatures] = useState(null);
    const [recommendations, setRecommendations] = useState(null);
    const [error, setError] = useState(null);
    const accessToken = sessionStorage.getItem('access_token');

    const { fetchFromSpotify } = useSpotifyAPI(accessToken);

    const getTrackData = async (trackID) => {
        const data = await fetchFromSpotify(`tracks/${trackID}`);
        if (data) {
            setTrackData(data);
            setError(null);
        } else {
            setTrackData([]);
            setError(`Failed to fetch track: ${error.message}`);
        }
    };

    const getTrackAudioFeatures = async (trackID) => {
        const data = await fetchFromSpotify(`audio-features/${trackID}`);
        if (data) {
            settrackAudioFeatures(data);
            setError(null);
        } else {
            settrackAudioFeatures([]);
            setError(`Failed to fetch track audio features: ${error.message}`);
        }
    };

    const getRecommendations = async (trackID) => {
        const data = await fetchFromSpotify(`recommendations?seed_tracks=${trackID}`);
        if (data) {
            setRecommendations(data);
            setError(null);
        } else {
            setRecommendations([]);
            setError(`Failed to fetch recommendations: ${error.message}`);
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        const trackURL = event.target.trackURL.value;

        const trackID = trackURL.split('/').pop().split('?')[0];

        console.log(trackID);
        
        getTrackData(trackID);
        getTrackAudioFeatures(trackID);
        getRecommendations(trackID);

        event.target.reset();

    };

    const handleTrackClick = async (trackID) => {
        getTrackData(trackID);
        getTrackAudioFeatures(trackID);
        getRecommendations(trackID);
    };

    const MemoizedFeatureCell = React.memo(FeatureCell);
    
    return (
        <div className='SearchSongs max-w-4xl mx-auto px-4 justify-items-center'>
            
            <p className="font-bold mt-4 text-center">Enter a track's URL to get started</p>

            <form onSubmit={handleSubmit} className=''>

                <input
                    type="text"
                    id="myInput"

                    name="trackURL"
                    className="w-full border border-gray-400 p-2 rounded-lg"

                    placeholder="Enter track url ..."
                />

            </form>

            {error && <p className="text-red-500">Error: {error}</p>}

            {trackData ? (

                <>

                <div className="trackData text-center">
                    <h3 className='font-bold text-4xl'>{trackData.name}</h3>
                    <p className='text-2xl'>{trackData.artists[0].name}</p>
                    <p className='text-2xl'><strong>Album:</strong> {trackData.album.name}</p>
                    <script src="https://open.spotify.com/embed/iframe-api/v1" async></script>
                    
                    <div id='embed-iframe' className='flex justify-center'>
                        <iframe
                            title='Spotify Player'
                            src={`https://open.spotify.com/embed/track/${trackData.id}`}
                            width="500"
                            height="400"
                            allowtransparency="true"
                            allow="encrypted-media"
                            className='m-4'
                        ></iframe>
                    </div>
                </div>

                {trackAudioFeatures && (
                    <div className="trackAudioFeatures grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        <MemoizedFeatureCell label="Mode" value={trackAudioFeatures.mode ? 'Major' : 'Minor'} useProgressBar={false} />
                        <MemoizedFeatureCell label="Tempo" value={`${trackAudioFeatures.tempo} bpm`} useProgressBar={false} />
                        <MemoizedFeatureCell label="Duration" value={`${Math.floor((trackAudioFeatures.duration_ms/1000)/60)}m ${Math.round((trackAudioFeatures.duration_ms/1000)%60,0)}s`} useProgressBar={false} />
                        <MemoizedFeatureCell label="Time Signature" value={trackAudioFeatures.time_signature} useProgressBar={false} />

                        <MemoizedFeatureCell label="Danceability" value={trackAudioFeatures.danceability} />
                        <MemoizedFeatureCell label="Energy" value={trackAudioFeatures.energy} />
                        <MemoizedFeatureCell label="Speechiness" value={trackAudioFeatures.speechiness} />
                        <MemoizedFeatureCell label="Acousticness" value={trackAudioFeatures.acousticness} />
                        <MemoizedFeatureCell label="Instrumentalness" value={trackAudioFeatures.instrumentalness} />
                        <MemoizedFeatureCell label="Liveness" value={trackAudioFeatures.liveness} />
                        <MemoizedFeatureCell label="Valence" value={trackAudioFeatures.valence} />
                        <MemoizedFeatureCell label="Loudness" value={`${trackAudioFeatures.loudness} dB`} useProgressBar={false} />

                    </div>
                )}

                {recommendations && (
                    <div className="recommendations mt-4">
                        <h3 className='font-bold text-2xl mb-4'>Recommended Tracks</h3>
                        <div className="recommendationList grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {recommendations.tracks.slice(0, 3).map((track) => (
                                <div key={track.id} className="block text-center cursor-pointer border rounded-lg">
                                    <h4 className='text-sm font-semibold truncate p-2'>{track.name}</h4>
                                    <p className='text-sm truncate'><strong>{track.artists[0].name}</strong></p>
                                    <p className='text-sm truncate px-2'><strong>Album:</strong> {track.album.name}</p>
                                    <img src={track.album.images[0].url} alt={track.name} className='m-auto p-4' onClick={() => handleTrackClick(track.id)} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                </>

            ) : (
                <>
                <div className="Instructions text-center">
                    <p className="text-center mt-4 font-semibold">Find a track and copy song link as shown</p>
                    <img src={Instructions} alt="Instructions" className='m-auto' />
                </div>
                </>
            )
            }

        </div>
    );
}