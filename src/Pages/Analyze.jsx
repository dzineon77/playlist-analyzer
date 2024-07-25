import React, { useEffect, useState } from 'react';
import SearchPlaylists from '../Components/SearchPlaylists';
import SearchSongs from '../Components/SearchSongs';
import UserPanel from '../Components/UserPanel';
import { useSpotifyAPI } from '../Components/useSpotifyAPI';

const CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = 'https://playlist-analyzer.vercel.app/analyze';

async function handleTokenResponse(response, setError) {
    const data = await response.json();
    if (data.access_token) {
        sessionStorage.setItem('access_token', data.access_token);
        return data.access_token;
    } else {
        console.log(`Failed to obtain access token. Error: ${data.error}`);
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

            const payload = {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                  client_id: CLIENT_ID,
                  grant_type: 'authorization_code',
                  code,
                  redirect_uri: REDIRECT_URI,
                  code_verifier: codeVerifier,
                }),
              }

            try {
                const response = await fetch('https://accounts.spotify.com/api/token', payload);
                return handleTokenResponse(response, setError);
            } catch (error) {
                console.log('Failed to exchange code for access token:', error);
                setError(`Failed to exchange code for access token: ${error.message}`);
                return null;
            }
        }
    }
}

export default function Analyze() {
    const [accessToken, setAccessToken] = useState(sessionStorage.getItem('access_token'));
    const [isToggled, setIsToggled] = useState(false);
    const [playlists, setPlaylists] = useState([]);
    const [userProfileData, setUserProfileData] = useState(null);
    const [error, setError] = useState(null);

    const { fetchFromSpotify } = useSpotifyAPI(accessToken);

    // 50 is max
    const getPlaylists = async () => {
        const data = await fetchFromSpotify('me/playlists?limit=50');
        if (data) {
            setPlaylists(data.items);
            setError(null);
        } else {
            setPlaylists([]);
            setError(`Failed to fetch playlist: ${error.message}`);
        }
    };

    const getUserProfile = async () => {
        const data = await fetchFromSpotify('me');
        if (data) {
            setUserProfileData(data);
            setError(null);
        } else {
            setUserProfileData([]);
            setError(`Failed to fetch user profile: ${error.message}`);
        }
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
            getUserProfile();
        }
        //eslint-disable-next-line
    }, [accessToken]);

    return (
        <>
        <UserPanel userData={userProfileData}/>        
        <div className='min-h-screen bg-green-light flex items-center justify-center p-10'>
            <div className="w-3/4 bg-white rounded-lg shadow-xl p-8">
                <div className="header bg-white-light rounded-lg shadow-xl p-8 m-10">
                    <h1 className='text-4xl font-bold'>Playlist Analyzer</h1>
                    {error && <p className="text-red-500">Error: {error}</p>}
                </div>

                <div className="grid justify-items-center bg-white-light rounded-lg shadow-xl p-8 ">
                    <input
                        type="checkbox"
                        id="toggle"
                        className="toggleCheckbox"
                        onChange={handleToggleChange}
                        checked={isToggled}
                    />
                    <label htmlFor="toggle" className="toggleContainer">
                        <div>Search Songs</div>
                        <div>Your Playlists</div>
                    </label>

                    <div className="results min-w-full">
                        {isToggled ? <SearchPlaylists playlists={playlists}/> : <SearchSongs />}
                    </div>
                </div>
            </div>
        </div>

        </>
    );
}