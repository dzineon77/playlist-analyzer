import React, { useEffect, useState } from 'react';
import { Music } from 'lucide-react';

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

  const clientId = '59b9850087ac4d05b261fc70a5431b3c';
  const redirectUri = 'http://localhost:3000/analyze';
  const scope = 'user-read-private user-read-email';
  const authUrl = new URL("https://accounts.spotify.com/authorize");

  window.localStorage.setItem('code_verifier', codeVerifier);

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

export async function getToken(setAccessToken) {
  const code = new URLSearchParams(window.location.search).get('code');
  if (!code) return;

  let codeVerifier = localStorage.getItem('code_verifier');
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

  const response = await fetch(url, payload);
  const data = await response.json();

  if (data.access_token) {
    localStorage.setItem('access_token', data.access_token);
    setAccessToken(data.access_token);
  }
}

function Home() {
    const [accessToken, setAccessToken] = useState(localStorage.getItem('access_token'));

    useEffect(() => {
        getToken(setAccessToken);
    }, []);

    return (
    <div className="min-h-screen bg-green-light flex items-center justify-center p-4">
      <div className="bg-white-light rounded-lg shadow-xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <Music className="mx-auto text-green-500 mb-4" size={48} />
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Playlist Analyzer</h1>
          <p className="text-gray-600">Discover insights about your music by exploring audio features and trends</p>
        </div>

        <div className="space-y-6">
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
    </div>
  );
};

export default Home;
