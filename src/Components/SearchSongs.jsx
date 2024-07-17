
export default function SearchSongs() {

    const handleSubmit = (event) => {
        event.preventDefault();
    };
    
    return (
        <div className='SearchSongs'>
            <div className="header">
                <h1>Search for a song</h1>
                <p>Find characteristics of a specific song</p>
                <input
                type="text"
                id="myInput"
                onSubmit={handleSubmit}
                placeholder="Search a song"
            />
            </div>

        </div>
    );
}