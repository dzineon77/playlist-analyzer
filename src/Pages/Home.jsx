import React, { useState, useEffect } from 'react';
import { ArrowBigRightDash, SquareChevronLeft, Volume2, Mic2, Activity, Timer, Zap, Speech } from 'lucide-react';
import BackgroundGradient from '../Components/BackgroundGradient';
import FeatureBar from '../Components/FeatureBar';
import SongCard from '../Components/SongCard';
import Alert from '../Components/Alert';
import { useLocation } from 'react-router-dom';

// Import all demo song cover images
import song1Cover from '../Assets/DemoSongIcons/StayinAlive.jpeg'; 
import song2Cover from '../Assets/DemoSongIcons/StrangeLand.jpeg';
import song3Cover from '../Assets/DemoSongIcons/MortalMan.jpeg';
import Spotify_Logo from '../Assets/Spotify_logo_without_text.svg.png';

// Demo song data structured to match Spotify API response format
const DEMO_SONGS = [
  {
    track: {
      id: 1,
      name: "Stayin Alive",
      artists: [{ name: "Bee Gees" }],
      album: {
        images: [{ url: song1Cover }]
      },
      features: {
        energy: 0.773,
        danceability: 0.702,
        valence: 0.953,
        tempo: 103.56,
        acousticness: 0.029,
        speechiness: 0.034
      }
    }
  },
  {
    track: {
      id: 2,
      name: "Strange Land",
      artists: [
        { name: "88rising" },
        { name: "NIKI" },
        { name: "Phum Viphurit" }
      ],
      album: {
        images: [{ url: song2Cover }]
      },
      features: {
        energy: 0.265,
        danceability: 0.65,
        valence: 0.156,
        tempo: 75.00,
        acousticness: 0.903,
        speechiness: 0.050
      }
    }
  },
  {
    track: {
      id: 3,
      name: "Mortal Man",
      artists: [{ name: "Kendrick Lamar" }],
      album: {
        images: [{ url: song3Cover }]
      },
      features: {
        energy: 0.525,
        danceability: 0.567,
        valence: 0.416,
        tempo: 86.94,
        acousticness: 0.665,
        speechiness: 0.750
      }
    }
  }
];

// Necessary for authorization code flow, following PKCE encryption standard
// https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow
async function generateCodeChallenge() {
  const generateRandomString = (length) => {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const values = crypto.getRandomValues(new Uint8Array(length));
    return values.reduce((acc, x) => acc + possible[x % possible.length], "");
  };

  const codeVerifier = generateRandomString(64);

  const sha256 = async (plain) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    return window.crypto.subtle.digest('SHA-256', data);
  };

  const base64encode = (input) => {
    return btoa(String.fromCharCode(...new Uint8Array(input)))
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
  };

  const hashed = await sha256(codeVerifier);
  const codeChallenge = base64encode(hashed);

  return { codeVerifier, codeChallenge };
}

// Use SHA256 hashed codeChallenge to request an access token
// Change redirectUri here for proper navigation 
async function requestUserAuth() {
  const { codeVerifier, codeChallenge } = await generateCodeChallenge();

  const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;

  const redirectUri = 'https://playlist-analyzer.vercel.app/analyze';

  const scope = 'user-read-private user-read-email playlist-read-private';
  const authUrl = new URL("https://accounts.spotify.com/authorize");
  
  // Clear any existing session data
  sessionStorage.clear();

  sessionStorage.setItem('code_verifier', codeVerifier);

  const params = {
    response_type: 'code',
    client_id: clientId,
    scope,
    code_challenge_method: 'S256',
    code_challenge: codeChallenge,
    redirect_uri: redirectUri,
  };

  authUrl.search = new URLSearchParams(params).toString();
  window.location.href = authUrl.toString();
}

function Home() {
  
  // State to manage whether to show the demo and select a song
  const [showSlider, setShowSlider] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('auth_error') === 'access_denied') {
      setShowAlert(true);
      window.history.replaceState({}, '', '/');
    }
  }, [location]);

  useEffect(() => {
    if (selectedSong) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 500);
      return () => clearTimeout(timer);
    }
  }, [selectedSong]);
    
  const handleSongSelect = (trackId) => {
    const selected = DEMO_SONGS.find(song => song.track.id === trackId);
    setSelectedSong(selected?.track);
  };

  return (
    <div className="relative min-h-screen">
      <BackgroundGradient />
      
      {showAlert && (
        <Alert
          title="Access Denied"
          message="You've denied access to Spotify. Please try connecting again."
          onClose={() => setShowAlert(false)}
        />
      )}

      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-xl p-4 md:p-8 max-w-3xl w-full mx-4">
          {showSlider ? (
            <div className="demo-content">

              <button
                onClick={() => setShowSlider(false)}
                className="mb-6 p-2 md:p-4 absolute top-2 left-2 md:top-4 md:left-4 text-gray hover:text-gray-dark transition-colors"
              >
                <SquareChevronLeft size={24} className="md:w-8 md:h-8" />
                </button>

                <div className="mb-4 md:mb-8">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">Audio Features Analysis</h2>
                <p className="text-sm md:text-base text-gray-600">Select a song to get started</p>
              </div>

            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-2 md:overflow-x-auto justify-start md:justify-center pb-4">

                {DEMO_SONGS.map(song => (
                  <SongCard
                    key={song.track.id}
                    item={song}
                    isSelected={selectedSong?.id === song.track.id}
                    onClick={handleSongSelect}
                  />
              ))}
            </div>

            {selectedSong && (
              <div className={`transition-opacity duration-500 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                {selectedSong.name} - {selectedSong.artists.map(artist => artist.name).join(', ')}
                </h3>
                <div className="space-y-4">
                  <FeatureBar value={selectedSong.features.energy} label="Energy" icon={Zap} />
                  <FeatureBar value={selectedSong.features.danceability} label="Danceability" icon={Activity} />
                  <FeatureBar value={selectedSong.features.valence} label="Mood" icon={Volume2} />
                  <FeatureBar value={selectedSong.features.acousticness} label="Acousticness" icon={Mic2} />
                  <FeatureBar value={selectedSong.features.speechiness} label="Speechiness" icon={Speech} />
                </div>
                <div className="mt-4 p-2 bg-gray-50 rounded-lg">
                  <div className="flex justify-center">
                    <Timer className="text-green-600 mr-2" size={20} />
                    <span className="text-gray-700">Tempo: {selectedSong.features.tempo} BPM</span>
                  </div>
                </div>
              </div>
            )}

          </div>
        ) : (
            <div className="main-content">
              <div className="text-center mb-6 md:mb-8">
                <img className="w-36 h-36 object-cover justify-self-center mb-2 md:mb-4" src={Spotify_Logo} alt='Spotify Logo'></img>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Playlist Analyzer</h1>
                <p className="text-sm md:text-base text-gray-600 px-4">Discover insights about your music by exploring audio features and trends</p>
              </div>

              <div className="space-y-6">
                <button
                  className="w-full bg-green-dark hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
                  onClick={() => setShowSlider(true)}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <span>Try the Demo</span>
                    <ArrowBigRightDash className="w-5 h-5" />
                  </div>
                </button>

                <div className="bg-gray backdrop-blur-sm rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Ready to explore?</h2>
                    <p className="text-sm md:text-base text-gray-600 px-4">Connect your Spotify account to get started</p>
                  </div>
                  <button
                    className="bg-green-dark hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
                    onClick={requestUserAuth}
                  >
                    Connect
                  </button>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
    </div>
  );
};
export default Home;
