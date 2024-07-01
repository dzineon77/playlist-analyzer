
export default function SearchPlaylists({ playlists }) {
    const handleInputChange = (event) => {
        const filter = event.target.value.toUpperCase();
        const ul = document.getElementById("myUL");
        const li = ul.getElementsByTagName("li");

        for (let i = 0; i < li.length; i++) {
            const a = li[i].getElementsByTagName("p")[0];
            const txtValue = a.textContent || a.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                li[i].style.display = "";
            } else {
                li[i].style.display = "none";
            }
        }
    };

    return (
        <div className="SearchPlaylists">
            <input
                type="text"
                id="myInput"
                onKeyUp={handleInputChange}
                placeholder="Search playlists"
            />

            <ul id="myUL">
                {playlists.map((playlist, index) => (
                    <li key={index}>
                        {/* <img className="playlistPic" src={playlist.images[0].url} alt={playlist.name} href="#"/> */}
                        <p>{playlist.name}</p>
                        <p>Tracks Total: {playlist.tracks.total}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}
