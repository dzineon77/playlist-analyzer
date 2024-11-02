import React, { useState, useEffect } from 'react';
import { Music, ArrowBigRightDash, SquareChevronLeft, Volume2, Mic2, Activity, Timer, Zap, Speech } from 'lucide-react';

// Import all demo song cover images
import song1Cover from '../Assets/DemoSongIcons/StayinAlive.jpeg'; 
import song2Cover from '../Assets/DemoSongIcons/StrangeLand.jpeg';
import song3Cover from '../Assets/DemoSongIcons/MortalMan.jpeg';

// Simulated song data with audio features
const DEMO_SONGS = [
  {
    id: 1,
    title: "Stayin Alive",
    artist: "Bee Gees",
    coverImage: song1Cover,
    features: {
      energy: 0.773,
      danceability: 0.702,
      valence: 0.953,
      tempo: 103.56,
      acousticness: 0.029,
      speechiness: 0.034
    }
  },
  {
    id: 2,
    title: "Strange Land",
    artist: "88rising, NIKI, Phum Viphurit",
    coverImage: song2Cover,
    features: {
      energy: 0.265,
      danceability: 0.65,
      valence: 0.156,
      tempo: 75.00,
      acousticness: 0.903,
      speechiness: 0.050
    }
  },
  {
    id: 3,
    title: "Mortal Man",
    artist: "Kendrick Lamar",
    coverImage: song3Cover,
    features: {
      energy: 0.525,
      danceability: 0.567,
      valence: 0.416,
      tempo: 86.94,
      acousticness: 0.665,
      speechiness: 0.750
    }
  }
];

const FeatureBar = ({ value, label, icon: Icon }) => (
  <div className="mb-2">
    <div className="flex items-center mb-1">
      <Icon size={16} className="mr-2 text-green-600" />
      <span className="text-lg text-gray-600">{label}</span>
      <span className="ml-auto text-lg font-medium">{Math.round(value * 100)}%</span>
    </div>
    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
      <div 
        className="h-full bg-green-500 rounded-full transition-all duration-500 ease-out"
        style={{ width: `${value * 100}%` }}
      />
    </div>
  </div>
);

const SongCard = ({ song, isSelected, onClick }) => (
  <div 
    className={`min-w-[150px] p-5 rounded-lg cursor-pointer transition-all duration-300 transform hover:scale-103 ${
      isSelected ? 'bg-green shadow-lg' : 'bg-gray'
    }`}
    onClick={onClick}
  >
    <div className="w-full aspect-square mb-3 rounded-lg overflow-hidden">
      <img 
        src={song.coverImage} 
        alt={`${song.title} cover`}
        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
      />
    </div>
    <h3 className="font-semibold text-gray-800 truncate">{song.title}</h3>
    <p className="text-sm text-gray-600">{song.artist}</p>
  </div>
);

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
  // State to manage whether to show the sliding window
  const [showSlider, setShowSlider] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (selectedSong) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 500);
      return () => clearTimeout(timer);
    }
  }, [selectedSong]);
    
  return (
    <div className="min-h-screen bg-green-light flex items-center justify-center p-4">
      <div className="bg-white-light rounded-lg shadow-xl p-8 max-w-3xl w-full">

        {showSlider ? (
          <div className="demo-content relative">

            <button
              onClick={() => setShowSlider(false)}
              className="mb-6 p-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <SquareChevronLeft className='absolute top-4 left-4' size={32} />
            </button>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Audio Feature Analysis Demo</h2>
              <p className="text-gray-600">Select a song to see its audio features</p>
            </div>

            <div className="flex space-x-4 mb-8 overflow-x-auto justify-center pb-4">
              {DEMO_SONGS.map(song => (
                <SongCard
                  key={song.id}
                  song={song}
                  isSelected={selectedSong?.id === song.id}
                  onClick={() => setSelectedSong(song)}
                />
              ))}
            </div>

            {selectedSong && (
              <div className={`transition-opacity duration-500 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                  {selectedSong.title} - Audio Features
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

            <div className="text-center mb-8">
              <Music className="mx-auto text-green-500 mb-4" size={48} />
              <h1 className="text-4xl font-bold text-gray-800 mb-2">Playlist Analyzer</h1>
              <p className="text-gray-600">Discover insights about your music by exploring audio features and trends</p>
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

              <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Ready to explore?</h2>
                  <p className="text-sm text-gray-600">Connect your Spotify account to get started</p>
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
  );
};
export default Home;
