import React, { useEffect, useState } from 'react';
import SearchPlaylists from '../Components/SearchPlaylists.jsx';
import SearchUsers from '../Components/SearchUsers.jsx';
import { getToken } from './Home.jsx';

export default function Analyze() {
    const [accessToken, setAccessToken] = useState(localStorage.getItem('access_token'));
    const [isToggled, setIsToggled] = useState(false);
    const [playlists, setPlaylists] = useState([]);

    useEffect(() => {
        getToken(setAccessToken);
        getPlaylists();
    }, []);

    const handleToggleChange = () => {
        setIsToggled(!isToggled);
    };

    const getPlaylists = async () => {
        try {
            const response = await fetch('https://api.spotify.com/v1/me/playlists?limit=100', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            const data = await response.json();
            setPlaylists(data.items);
            console.log('Playlists:', data.items)
        } catch (error) {
            console.error('Error fetching playlists:', error);
        }
    };

    return (
        <div className='Analyze'>
            <div className="header">
                <h1>Playlist Analyzer</h1>
                <p>Search for a Spotify playlist URL to get started.</p>
                <p>Access Token: {accessToken}</p>
            </div>

            <div className="container">
                <div className="search">
                    <input
                        type="checkbox"
                        id="toggle"
                        className="toggleCheckbox"
                        onChange={handleToggleChange}
                        checked={isToggled}
                    />
                    <label htmlFor="toggle" className="toggleContainer">
                        <div>Search Users</div>
                        <div>Your Playlists</div>
                    </label>
                </div>

                <div className="results">
                    {isToggled ? <SearchPlaylists playlists={playlists}/> : <SearchUsers />}
                </div>
            </div>
        </div>
    );
}