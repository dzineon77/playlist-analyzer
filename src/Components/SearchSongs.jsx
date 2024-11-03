import React, { useState, useCallback } from 'react';
import FeatureCell from './FeatureCell';
import Instructions from '../Assets/instructions.png';
import { useSpotifyAPI } from './useSpotifyAPI';

export default function SearchSongs() {

    const [trackData, setTrackData] = useState(null);
    const [trackAudioFeatures, setTrackAudioFeatures] = useState(null);
    const [recommendations, setRecommendations] = useState(null);
    const [error, setError] = useState(null);
    const accessToken = sessionStorage.getItem('access_token');

    const { fetchFromSpotify } = useSpotifyAPI(accessToken);

    const getTrackData = useCallback(async (trackID) => {
        const data = await fetchFromSpotify(`tracks/${trackID}`);
        if (data) {
            setTrackData(data);
            setError(null);
            return true;
        } else {
            setTrackData(null);
            setError(`Failed to fetch track: ${error?.message}`);
            return false;
        }
        // eslint-disable-next-line
    }, [fetchFromSpotify]);

    const getTrackAudioFeatures = useCallback(async (trackID) => {
        const data = await fetchFromSpotify(`audio-features/${trackID}`);
        if (data) {
            setTrackAudioFeatures(data);
            return true;
        } else {
            setTrackAudioFeatures(null);
            return false;
        }
    }, [fetchFromSpotify]);

    const getRecommendations = useCallback(async (trackID) => {
        const data = await fetchFromSpotify(`recommendations?seed_tracks=${trackID}`);
        if (data) {
            setRecommendations(data);
            return true;
        } else {
            setRecommendations(null);
            return false;
        }
    }, [fetchFromSpotify]);

    const handleSubmit = (event) => {
        event.preventDefault();

        const trackURL = event.target.trackURL.value;

        const trackID = trackURL.split('/').pop().split('?')[0];

        // console.log(trackID);
        
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
        <div className="SearchSongs mx-auto px-2 md:px-4 lg:px-8 space-y-6">
            
            <div className="text-center space-y-4">
                <h2 className="text-lg md:text-2xl font-bold">Enter a track's URL to get started</h2>
                
                <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
                    <input
                        type="text"
                        name="trackURL"
                        className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter track URL..."
                    />
                </form>
            </div>

            {error && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
                    <p className="text-red-700">{error}</p>
                </div>
            )}

            {trackData ? (
                <>
                <div className="space-y-8">
                    <div className="text-center space-y-2">
                        <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold line-clamp-2">{trackData.name}</h3>
                        <p className="text-lg sm:text-xl md:text-2xl">{trackData.artists[0].name}</p>
                        <p className="text-lg sm:text-xl md:text-2xl line-clamp-1">
                            <strong>Album:</strong> {trackData.album.name}
                        </p>
                        
                        <div className="aspect-video max-w-2xl mx-auto rounded-lg overflow-hidden shadow-lg">
                            <iframe
                                title="Spotify Player"
                                src={`https://open.spotify.com/embed/track/${trackData.id}`}
                                width="100%"
                                height="100%"
                                allowTransparency="true"
                                allow="encrypted-media"
                                className="border-0"
                            />
                        </div>
                    </div>

                    {trackAudioFeatures && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4 bg-white rounded-lg shadow">
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
                        <div className="space-y-4">
                            <h3 className="text-2xl font-bold">Recommended Tracks</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {recommendations.tracks.slice(0, 3).map((track) => (
                                    <div 
                                        key={track.id} 
                                        className="p-4 border rounded-lg shadow-md hover:shadow-lg transition-shadow space-y-2 cursor-pointer"
                                        onClick={() => getTrackData(track.id)}
                                    >
                                        <div className="aspect-square overflow-hidden rounded-lg">
                                            <img 
                                                src={track.album.images[0].url} 
                                                alt={track.name} 
                                                className="w-full h-full object-cover"
                                                loading="lazy"
                                                onClick={() => handleTrackClick(track.id)}
                                            />
                                        </div>
                                        <h4 className="font-semibold line-clamp-1">{track.name}</h4>
                                        <p className="text-sm text-gray-600 line-clamp-1">{track.artists[0].name}</p>
                                        <p className="text-sm text-gray-500 line-clamp-1">{track.album.name}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                </>

            ) : (
                <>
                <div className="text-center space-y-4 ">
                    <p className="font-semibold">Find a track and copy song link as shown</p>
                    <img 
                        src={Instructions} 
                        alt="Instructions" 
                        className="max-w-md mx-auto rounded-lg shadow object-scale-down"
                        loading="lazy"
                    />
                </div>
                </>
            )}
        </div>
    );
}