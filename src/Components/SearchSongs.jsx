import React, { useState } from 'react';
// import getorRefreshToken from '../Analyze';

export default function SearchSongs() {

    const [trackData, setTrackData] = useState(null);
    const [trackAF, setTrackAF] = useState(null);
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

    const handleSubmit = (event) => {
        event.preventDefault();

        const trackID = event.target.trackID.value;

        console.log(trackID);
        
        getTrackData(trackID);
        getTrackAF(trackID);

        event.target.reset();


    };
    
    return (
        <div className='SearchSongs max-w-4xl mx-auto px-4'>
            
            <h2 className="text-2xl font-bold mb-4 text-center">Enter a track's Spotify ID</h2>

            <form onSubmit={handleSubmit}>

                <input
                    type="text"
                    id="myInput"

                    name="trackID"
                    className="w-full border border-gray-400 p-2 rounded-lg"

                    placeholder="Enter track ID ..."
                />

            </form>


            {trackData && (
                <div className="trackData">
                    <h3>{trackData.name}</h3>
                    <p>{trackData.artists[0].name}</p>
                    <p>{trackData.album.name}</p>
                    <img src={trackData.album.images[0].url} alt={trackData.name} />
                </div>
            )}    

            {trackAF && (
                <div className="trackAF">
                    <p>{trackAF.danceability}</p>
                    <p>{trackAF.energy}</p>
                    <p>{trackAF.key}</p>
                    <p>{trackAF.loudness}</p>
                    <p>{trackAF.mode}</p>
                    <p>{trackAF.speechiness}</p>
                    <p>{trackAF.acousticness}</p>
                    <p>{trackAF.instrumentalness}</p>
                    <p>{trackAF.liveness}</p>
                    <p>{trackAF.valence}</p>
                    <p>{trackAF.tempo}</p>
                    <p>{trackAF.duration_ms}</p>
                    <p>{trackAF.time_signature}</p>
                </div>
            )}
            
            {error && <p className="text-red-500">Error: {error}</p>}

        </div>
    );
}