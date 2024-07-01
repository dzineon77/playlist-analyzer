export default function SearchPlaylists({ playlists }) {
    return (
        <div className='SearchPlaylists'>
            <div className="header">
                <h1>Search Playlists</h1>
                <p>Choose from one of your own playlists</p>
            </div>
            <ul>
                {playlists.map((playlist, index) => (
                    <li key={index}>
                        <p>Name: {playlist.name}</p>
                        <p>URI: {playlist.uri}</p>
                        <p>Tracks Total: {playlist.tracks.total}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}