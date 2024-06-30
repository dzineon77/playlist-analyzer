import React, { useEffect, useState } from 'react';

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
  const redirectUri = 'http://localhost:3000';
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

async function getToken(setAccessToken) {
  const code = new URLSearchParams(window.location.search).get('code');
  if (!code) return;

  let codeVerifier = localStorage.getItem('code_verifier');
  const clientId = '59b9850087ac4d05b261fc70a5431b3c';
  const redirectUri = 'http://localhost:3000';
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

export default function Home() {
    const [accessToken, setAccessToken] = useState(localStorage.getItem('access_token'));

    useEffect(() => {
        getToken(setAccessToken);
    }, []);

    return (
        <div>
            <h1>Playlist Analyzer</h1>
            <p>Welcome to Playlist Analyzer! This app will help you analyze various characterists in your Spotify playlists.</p>
            <p>Click the button below to authorize access to your Spotify account to get started</p>
            <button onClick={requestUserAuth}>Login</button>
            <p>Access Token: {accessToken}</p>
        </div>
    );
}
