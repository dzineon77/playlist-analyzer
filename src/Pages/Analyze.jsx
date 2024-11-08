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

async function getOrRefreshToken(setError) {
    console.log('getOrRefreshToken called');
    const code = new URLSearchParams(window.location.search).get('code');
    const storedToken = sessionStorage.getItem('access_token');
    const tokenRequestInProgress = sessionStorage.getItem('token_request_in_progress');
    
    // console.log('Code exists:', !!code);
    // console.log('Stored token exists:', !!storedToken);
    // console.log('token_request_in_progress = ', tokenRequestInProgress);
    
    // Return existing token if valid
    if (storedToken) {
        // console.log('Using stored token');
        return storedToken;
    }
    
    // Prevent multiple simultaneous token requests
    if (tokenRequestInProgress === 'true') {
        // console.log('Token request already in progress');
        return null;
    }
    
    if (code) {
        // console.log('Exchanging code for token');
        // console.log('CODE = ', code);
        const codeVerifier = sessionStorage.getItem('code_verifier');
        // console.log('CODE VERIFIER = ', codeVerifier);
        
        if (!codeVerifier) {
            // console.error('No code verifier found');
            setError('Authentication failed: No code verifier');
            return null;
        }

        try {
            sessionStorage.setItem('token_request_in_progress', 'true');
            
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
            };

            const response = await fetch('https://accounts.spotify.com/api/token', payload);
            const data = await response.json();
            
            if (data.access_token) {
                sessionStorage.setItem('access_token', data.access_token);
                // console.log('TOKEN = ', data.access_token);

                // Clear URL parameters and token request flag
                window.history.replaceState({}, document.title, window.location.pathname);
                sessionStorage.removeItem('token_request_in_progress');
                return data.access_token;
            } else {
                console.error('Token exchange failed:', data.error);
                setError(`Failed to obtain access token: ${data.error}`);
                sessionStorage.removeItem('token_request_in_progress');
                return null;
            }
        } catch (error) {
            console.error('Token exchange error:', error);
            setError(`Failed to exchange token: ${error.message}`);
            sessionStorage.removeItem('token_request_in_progress');
            return null;
        }
    }
    return null;
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
    const [error, setError] = useState(null);

    useEffect(() => {
        
        async function initializeToken() {
            // console.log('Initializing token...');
            const token = await getOrRefreshToken(setError);
            if (token) {
                // console.log('Setting new access token: ', token);
                setAccessToken(token);
            }
        }
        
        initializeToken();
        
    }, [accessToken]);

    const [isToggled, setIsToggled] = useState(false);
    const [playlists, setPlaylists] = useState([]);
    const [userProfileData, setUserProfileData] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const { fetchFromSpotify } = useSpotifyAPI(accessToken);

    useEffect(() => {
        async function fetchData() {
            if (!accessToken) return;
            
            try {
                // Fetch profile
                const profile = await fetchFromSpotify('me');
                if (profile) {
                    setUserProfileData(profile);
                }

                // Then fetch playlists 
                const playlistData = await fetchFromSpotify('me/playlists?limit=50');
                if (playlistData) {
                    setPlaylists(playlistData.items);
                }
                
                setError(null);
                setIsLoaded(true);
            } catch (err) {
                setError(`Failed to fetch data: ${err.message}`);
            } finally {
                setIsLoaded(true);
            }
        }
    
            fetchData();
            }, [accessToken, fetchFromSpotify]);

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
                                {isLoaded ? (
                                    isToggled ? <SearchPlaylists playlists={playlists} /> : <SearchSongs />
                                ) : (
                                    <p>Loading...</p>
                                )}
                        </div>

                    </div>
                </div>
            </div>
        </div>
        </AuthRedirectHandler>
    );
}