import React, { useEffect, useState } from 'react';
import SearchPlaylists from '../Components/SearchPlaylists';
import SearchSongs from '../Components/SearchSongs';
import UserPanel from '../Components/UserPanel';
import { useSpotifyAPI } from '../Components/useSpotifyAPI';
import BackgroundGradient from '../Components/BackgroundGradient';
import { useNavigate } from 'react-router-dom';
import Toggle from '../Components/Toggle';

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

// Wrapper component to handle auth redirect (error=access_denied)
function AuthRedirectHandler({ children }) {
    const navigate = useNavigate();
    
    useEffect(() => {
        if (window.location.href.includes('error=access_denied')) {
            sessionStorage.clear();
            navigate('/?auth_error=access_denied');
        }
    }, [navigate]);

    if (window.location.href.includes('error=access_denied')) {
        return null;
    }

    return children;
}

export default function Analyze() {

    const [accessToken, setAccessToken] = useState(sessionStorage.getItem('access_token'));
    const [isToggled, setIsToggled] = useState(false);
    const [playlists, setPlaylists] = useState([]);
    const [userProfileData, setUserProfileData] = useState(null);
    const [error, setError] = useState(null);
    const { fetchFromSpotify } = useSpotifyAPI(accessToken);

    useEffect(() => {
        async function initializeToken() {
            const token = await getOrRefreshToken(setError);
            setAccessToken(token);
        }
        initializeToken();
    }, []);

    useEffect(() => {
        if (accessToken) {
            getUserProfile();
            getPlaylists();
        }
        //eslint-disable-next-line
    }, [accessToken]);

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

    return (
        <AuthRedirectHandler>
        <div className="relative min-h-screen">
            <BackgroundGradient />
            
            {/* User Panel */}
            <div className="relative">
                <UserPanel userData={userProfileData}/>
            </div>
            
            {/* Main Content */}
            <div className='relative z-10 min-h-screen flex items-center justify-center p-10'>
                <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-xl p-4 md:p-8 max-w-3xl w-full mx-4">
                    <div className="header bg-white-light/90 backdrop-blur-sm rounded-lg shadow-xl p-4 md:p-8 m-4 md:m-10">
                        <h1 className='text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 text-center'>Playlist Analyzer</h1>
                        {error && <p className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 text-center text-red-500">Error: {error}</p>}
                    </div>

                    <div className="grid justify-items-center bg-white-light/90 backdrop-blur-sm rounded-lg shadow-xl p-4 md:p-8">
                        
                        <Toggle isToggled={isToggled} onToggle={handleToggleChange} />

                        <div className="results content-center">
                            {isToggled ? <SearchPlaylists playlists={playlists}/> : <SearchSongs />}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </AuthRedirectHandler>
    );
}