import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import FeatureCell from './FeatureCell';

export default function SearchSongs() {

    const [trackData, setTrackData] = useState(null);
    const [trackAF, setTrackAF] = useState(null);
    const [recommendations, setRecommendations] = useState(null);
    const [error, setError] = useState(null);
    const accessToken = sessionStorage.getItem('access_token');

    const getTrackData = async (trackID) => {
        try {
            const response = await fetch(`https://api.spotify.com/v1/tracks/${trackID}`, {
                headers: { 'Authorization': `Bearer ${accessToken}` }
            });

            const data = await response.json();
            console.log(data);
            setTrackData(data);
            setError(null);
        } catch (error) {
            console.log('Error fetching track:', error);
            setTrackData([]);
            setError("Failed to fetch track: " + error.message);
        }
    };

    const getTrackAF = async (trackID) => {
        try {
            const response = await fetch(`https://api.spotify.com/v1/audio-features/${trackID}`, {
                headers: { 'Authorization': `Bearer ${accessToken}` }
            });

            const data = await response.json();
            console.log(data);
            setTrackAF(data);
            setError(null);
        } catch (error) {
            console.log('Error fetching track:', error);
            setTrackAF([]);
            setError("Failed to fetch track: " + error.message);
        }
    };

    const getRecommendations = async (trackID) => {
        try {
            const seed_tracks = [trackID];
            const response = await fetch(`https://api.spotify.com/v1/recommendations?seed_tracks=${seed_tracks}&limit=3`, {
                headers: { 'Authorization': `Bearer ${accessToken}` }
            });

            const data = await response.json();
            console.log(data);
            setRecommendations(data);
            setError(null);
        } catch (error) {
            console.log('Error fetching recommendations:', error);
            console.log('Error fetching recommendations:', error.message);
            setRecommendations([]);
            setError("Failed to fetch recommendations: " + error.message);
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        const trackURL = event.target.trackURL.value;

        const trackID = trackURL.split('/').pop().split('?')[0];

        console.log(trackID);
        
        getTrackData(trackID);
        getTrackAF(trackID);
        getRecommendations(trackID);

        event.target.reset();

    };

    const handleTrackClick = async (trackID) => {
        getTrackData(trackID);
        getTrackAF(trackID);
        getRecommendations(trackID);
    };
    
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


            {trackData && (
                <div className="trackData text-center">
                    <h3 className='font-bold text-4xl'>{trackData.name}</h3>
                    <p className='text-2xl'>{trackData.artists[0].name}</p>
                    <p className='text-2xl'><strong>Album:</strong> {trackData.album.name}</p>
                    <div className='flex justify-center'>
                        <img src={trackData.album.images[0].url} alt={trackData.name} className='m-4 max-w-md max-h-md' />
                    </div>
                </div>
            )}


            {trackAF && (
                <div className="trackAF grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    <FeatureCell label="Mode" value={trackAF.mode ? 'Major' : 'Minor'} useProgressBar={false} />
                    <FeatureCell label="Tempo" value={`${trackAF.tempo} bpm`} useProgressBar={false} />
                    <FeatureCell label="Duration" value={`${Math.floor((trackAF.duration_ms/1000)/60)}m ${Math.round((trackAF.duration_ms/1000)%60,0)}s`} useProgressBar={false} />
                    <FeatureCell label="Time Signature" value={trackAF.time_signature} useProgressBar={false} />

                    <FeatureCell label="Danceability" value={trackAF.danceability} />
                    <FeatureCell label="Energy" value={trackAF.energy} />
                    <FeatureCell label="Speechiness" value={trackAF.speechiness} />
                    <FeatureCell label="Acousticness" value={trackAF.acousticness} />
                    <FeatureCell label="Instrumentalness" value={trackAF.instrumentalness} />
                    <FeatureCell label="Liveness" value={trackAF.liveness} />
                    <FeatureCell label="Valence" value={trackAF.valence} />
                    <FeatureCell label="Loudness" value={`${trackAF.loudness} dB`} useProgressBar={false} />

                </div>
            )}
            
            {recommendations && (
                <div className="recommendations mt-4">
                    <h3 className='font-bold text-2xl mb-4'>Recommended Tracks</h3>
                    <div className="recommendationList grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {recommendations.tracks.slice(0, 3).map((track) => (
                            <div key={track.id} className="block text-center cursor-pointer border rounded-lg">
                                <h4 className='text-sm font-semibold truncate p-2'>{track.name}</h4>
                                <p className='text-sm truncate'>{track.artists[0].name}</p>
                                <p className='text-sm truncate'><strong>Album:</strong> {track.album.name}</p>
                                <img src={track.album.images[0].url} alt={track.name} className='m-auto p-4' onClick={() => handleTrackClick(track.id)} />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {error && <p className="text-red-500">Error: {error}</p>}

        </div>
    );
}