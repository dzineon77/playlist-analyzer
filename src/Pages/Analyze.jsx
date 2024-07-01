import React, { useEffect, useState } from 'react';
import SearchPlaylists from '../Components/SearchPlaylists.jsx';
import SearchUsers from '../Components/SearchUsers.jsx';
import { getToken } from './Home.jsx';

export default function Analyze() {
    const [accessToken, setAccessToken] = useState(localStorage.getItem('access_token'));
    const [isToggled, setIsToggled] = useState(false);
    const [playlists, setPlaylists] = useState([]);

    const handleToggleChange = () => {
        setIsToggled(!isToggled);
    };

    useEffect(() => {
        getToken(setAccessToken);
        getPlaylists();
    }, [accessToken]);
    
    const getPlaylists = async () => {
        try {
            const response = await fetch('https://api.spotify.com/v1/me/playlists', {
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
        <div className='min-h-screen bg-green-light flex items-center justify-center p-10'>
            <div className="min-w-fit bg-white rounded-lg shadow-xl p-8">
                <div className="header bg-white-light rounded-lg shadow-xl p-8 m-10">
                    <h1 className='text-xl font-bold'>Playlist Analyzer</h1>
                    <p>Access Token: {accessToken}</p>
                </div>

            <div className="grid justify-items-center bg-white-light rounded-lg shadow-xl p-8">
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

                <div className="results">
                    {isToggled ? <SearchPlaylists playlists={playlists}/> : <SearchUsers />}
                </div>
            </div>
        </div>
    </div>
    );
}