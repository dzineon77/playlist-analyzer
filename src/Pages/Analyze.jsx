import React, { useEffect, useState } from 'react';
import { getToken } from './Home.jsx';
import SearchPlaylists from '../Components/SearchPlaylists.jsx';
import SearchUsers from '../Components/SearchUsers.jsx';


export default function Analyze() {

    const [accessToken, setAccessToken] = useState(localStorage.getItem('access_token'));

    useEffect(() => {
        getToken(setAccessToken);
    }, []);

    const [isToggled, setIsToggled] = useState(false);

    const handleToggleChange = () => {
        setIsToggled(!isToggled);
    };

    return (
        <div className='Analyze'>
            <div className="header">
                <h1>Playlist Analyzer</h1>
                <p>Search for a Spotify playlist URL to get started.</p>
                <p>Access Token: {accessToken}</p>
            </div>

            <div className="container">

                <div className="search">
                    <input type="checkbox" id="toggle" class="toggleCheckbox" onChange={handleToggleChange} // Update to handle change
                        checked={isToggled}/>
                        <label htmlFor="toggle" class='toggleContainer'>
                            <div>Search Users</div>   
                            <div>Your Playlists</div>
                        </label>
                </div>

                <div className="results">
                {isToggled ? <SearchPlaylists /> : <SearchUsers />}

                </div>
            </div>

        </div>
    );
}