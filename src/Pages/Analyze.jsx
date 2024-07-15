import React, { useEffect, useState } from 'react';
import SearchPlaylists from '../Components/SearchPlaylists';
import SearchUsers from '../Components/SearchUsers';
import { useNavigate } from 'react-router-dom';

const CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = 'http://localhost:3000/analyze';

async function handleTokenResponse(response, setError) {
    const data = await response.json();
    if (data.access_token) {
        sessionStorage.setItem('access_token', data.access_token);
        return data.access_token;
    } else {
        setError("Failed to obtain access token. Error: " + (data.error || "Unknown error"));
        return null;
    }
}

async function getOrRefreshToken(setError) {
    const code = new URLSearchParams(window.location.search).get('code');
    const storedToken = sessionStorage.getItem('access_token');
    
    if (storedToken) {
        // Token already stored
        return storedToken;
    }
    else {
        // Token not stored
        if (code) {
            // Exchange code for token
            const codeVerifier = sessionStorage.getItem('code_verifier');
            const response = await fetch('https://accounts.spotify.com/api/token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                    client_id: CLIENT_ID,
                    grant_type: 'authorization_code',
                    code,
                    redirect_uri: REDIRECT_URI,
                    code_verifier: codeVerifier,
                }),
            });
            return handleTokenResponse(response, setError);
        } else {
            // No code, redirect to login
            setError('No code, redirecting to login');
            console.log('No code, redirecting to login');
            sessionStorage.clear();
            window.location.href = 'http://localhost:3000/';
            return null;
        }
    }
}

export default function Analyze() {
    const [accessToken, setAccessToken] = useState(sessionStorage.getItem('access_token'));
    const [isToggled, setIsToggled] = useState(false);
    const [playlists, setPlaylists] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const getPlaylists = async () => {
        try {
            const response = await fetch('https://api.spotify.com/v1/me/playlists?limit=10', {
                headers: { Authorization: `Bearer ${accessToken}` }
            });

            const data = await response.json();
            setPlaylists(data.items);
            setError(null);
        } catch (error) {
            console.error('Error fetching playlists:', error);
            setError("Failed to fetch playlists: " + error.message);
        }
    };

    const handleLogout = () => {
        sessionStorage.clear();
        navigate('/');
    };

    const handleToggleChange = () => setIsToggled(!isToggled);

    useEffect(() => {
        async function initializeToken() {
            const token = await getOrRefreshToken(setError);
            setAccessToken(token);
        }
        initializeToken();
    }, []);

    useEffect(() => {
        if (accessToken) {
            getPlaylists();
        }
        //eslint-disable-next-line
    }, [accessToken]);

    return (
        <div className='min-h-screen bg-green-light flex items-center justify-center p-10'>
            <div className="min-w-fit bg-white rounded-lg shadow-xl p-8">
                <div className="header bg-white-light rounded-lg shadow-xl p-8 m-10">
                    <h1 className='text-xl font-bold'>Playlist Analyzer</h1>
                    {error && <p className="text-red-500">Error: {error}</p>}
                    <button
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full mt-4"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
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