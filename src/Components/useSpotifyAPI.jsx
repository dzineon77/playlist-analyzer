import { useState } from 'react';

export const useSpotifyAPI = (accessToken) => {
    const [error, setError] = useState(null);

    const fetchFromSpotify = async (endpoint, options = {}) => {
        try {
            const response = await fetch(`https://api.spotify.com/v1/${endpoint}`, {
                headers: { 'Authorization': `Bearer ${accessToken}`, ...options.headers },
                ...options
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error.message);
            return data;
        } catch (error) {
            setError(error.message);
            return null;
        }
    };

    return { fetchFromSpotify, error };
};