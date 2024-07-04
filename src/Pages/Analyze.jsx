import React, { useEffect, useState } from 'react';
import SearchPlaylists from '../Components/SearchPlaylists';
import SearchUsers from '../Components/SearchUsers';
import { useNavigate } from 'react-router-dom';

async function getToken(setAccessToken, setError) {
    const code = new URLSearchParams(window.location.search).get('code');
    if (!code) {
        setError("No authorization code found. Please try logging in again.");
        return;
    }

    let codeVerifier = sessionStorage.getItem('code_verifier');
    const clientId = '59b9850087ac4d05b261fc70a5431b3c';
    const redirectUri = 'http://localhost:3000/analyze';
    const url = 'https://accounts.spotify.com/api/token';

    const payload = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            client_id: clientId,
            grant_type: 'authorization_code',
            code,
            redirect_uri: redirectUri,
            code_verifier: codeVerifier,
        }),
    };

    try {
        const response = await fetch(url, payload);
        const data = await response.json();

        if (data.access_token) {
            sessionStorage.setItem('access_token', data.access_token);
            sessionStorage.setItem('refresh_token', data.refresh_token);
            setAccessToken(data.access_token);
        } else {
            setError("Failed to obtain access token. Error: " + (data.error || "Unknown error"));
        }
    } catch (error) {
        setError("Error during token retrieval: " + error.message);
    }
}

async function refreshAccessToken(setError) {
    const refreshToken = sessionStorage.getItem('refresh_token');
    if (!refreshToken) {
        setError("No refresh token available. Please log in again.");
        return null;
    }

    const clientId = '59b9850087ac4d05b261fc70a5431b3c';
    const refreshUrl = 'https://accounts.spotify.com/api/token';

    const payload = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
            client_id: clientId
        }),
    };

    try {
        const response = await fetch(refreshUrl, payload);
        const data = await response.json();
        if (data.access_token) {
            sessionStorage.setItem('access_token', data.access_token);
            return data.access_token;
        } else {
            setError("Failed to refresh token. Error: " + (data.error || "Unknown error"));
            return null;
        }
    } catch (error) {
        setError("Error refreshing token: " + error.message);
        return null;
    }
}

async function ensureFreshToken(setAccessToken, setError) {
    let token = sessionStorage.getItem('access_token');
    if (!token) {
        token = await refreshAccessToken(setError);
        if (!token) {
            setError("Failed to obtain a valid token. Please log in again.");
            return null;
        }
        setAccessToken(token);
    }
    return token;
}

export default function Analyze() {
    const [accessToken, setAccessToken] = useState(sessionStorage.getItem('access_token'));
    const [isToggled, setIsToggled] = useState(false);
    const [playlists, setPlaylists] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleToggleChange = () => {
        setIsToggled(!isToggled);
    };

    useEffect(() => {
        const code = new URLSearchParams(window.location.search).get('code');
        if (code) {
            // New authorization code, get a new token
            getToken(setAccessToken, setError);
        } else if (!accessToken) {
            // No code and no token, redirect to home
            navigate('/');
        }
    }, [navigate]);

    useEffect(() => {
        if (accessToken) {
            getPlaylists();
        }
    }, [accessToken]);

    const getPlaylists = async () => {
        const token = await ensureFreshToken(setAccessToken, setError);
        if (!token) return;

        try {
            const response = await fetch('https://api.spotify.com/v1/me/playlists?limit=10', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.error.message}`);
            }

            const data = await response.json();
            setPlaylists(data.items);
            console.log('Playlists:', data.items);
            setError(null);
        } catch (error) {
            console.error('Error fetching playlists:', error);
            setError("Failed to fetch playlists: " + error.message);
            if (error.message.includes('401')) {
                // Token might be expired, try refreshing
                const newToken = await refreshAccessToken(setError);
                if (newToken) {
                    setAccessToken(newToken);
                    // Retry fetching playlists with new token
                    getPlaylists();
                }
                else {
                    // If refresh fails, redirect to home for re-authorization
                    navigate('/');
                }
            }
        }
    };

    const handleLogout = () => {
        sessionStorage.clear();
        navigate('/');
    };

    return (
        <div className='min-h-screen bg-green-light flex items-center justify-center p-10'>
            <div className="min-w-fit bg-white rounded-lg shadow-xl p-8">
                <div className="header bg-white-light rounded-lg shadow-xl p-8 m-10">
                    <h1 className='text-xl font-bold'>Playlist Analyzer</h1>
                    <p>Access Token: {accessToken ? `${accessToken.substring(0, 10)}...` : 'No token'}</p>
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