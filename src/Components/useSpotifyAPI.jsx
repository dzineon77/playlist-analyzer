// useSpotifyAPI.jsx
import { useState, useCallback } from 'react';

export const useSpotifyAPI = (accessToken) => {
    const [error, setError] = useState(null);

    const fetchFromSpotify = useCallback(async (endpoint, options = {}) => {
        if (!accessToken) {
            console.log('No access token available');
            return null;
        }

        console.log(`Making request to ${endpoint}`);

        try {
            const response = await fetch(`https://api.spotify.com/v1/${endpoint}`, {
                headers: { 
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                    ...options.headers 
                },
                ...options
            });

            // Log all response headers
            const headers = {};
            response.headers.forEach((value, key) => {
                headers[key] = value;
            });


            if (response.status === 429) {
                console.error(`Rate limited on ${endpoint}`, {
                    status: response.status,
                    statusText: response.statusText,
                    headers: headers
                });
            }

            const data = await response.json();
            console.log(`Response data for ${endpoint}:`, {
                status: response.status,
                ok: response.ok,
                data: data
            });

            if (!response.ok) throw new Error(data.error?.message || 'API request failed');
            return data;
        } catch (error) {
            // console.error(`Error in ${endpoint}:`, error);
            setError(error.message);
            return null;
        }
    }, [accessToken]);

    return { fetchFromSpotify, error };
};