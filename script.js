const artistsGrid = document.getElementById("artists-grid");

if (artistsGrid && typeof artists !== "undefined") {

    artists.forEach(artist => {

        const artistCard = document.createElement("div");

        artistCard.className = "artist-card";

        artistCard.innerHTML = `
            <div class="artist-image"></div>

            <h3>${artist.name}</h3>

            <p>${artist.genre} • ${artist.country}</p>
        `;

        artistsGrid.appendChild(artistCard);

    });

}


const albumsGrid = document.getElementById("albums-grid");

if (albumsGrid && typeof albums !== "undefined") {

    albums.forEach(album => {

        const albumCard = document.createElement("div");

        albumCard.className = "album-card";

        albumCard.innerHTML = `
            <div class="album-image">
                <div class="album-placeholder"></div>
            </div>

            <div class="album-info">
                <h3>${album.title}</h3>
                <p>${album.artist}</p>
                <span>${album.year} • ${album.genre}</span>
            </div>
        `;

        albumsGrid.appendChild(albumCard);

    });

}


const songsGrid = document.getElementById("songs-grid");

if (songsGrid && typeof songs !== "undefined") {

    songs.forEach(song => {

        const songCard = document.createElement("div");

        songCard.className = "music-card";

        songCard.innerHTML = `
            <div class="card-image"></div>

            <div class="card-info">
                <h3>${song.title}</h3>
                <p>${song.artist}</p>
                <span>${song.album} • ${song.year}</span>
            </div>
        `;

        songsGrid.appendChild(songCard);

    });

}


const playlistsGrid = document.getElementById("playlists-grid");

if (playlistsGrid && typeof playlists !== "undefined") {

    playlists.forEach(playlist => {

        const playlistCard = document.createElement("div");

        playlistCard.className = "playlist-card";

        playlistCard.innerHTML = `
            <div class="playlist-image">
                <span>▶</span>
            </div>

            <div class="playlist-info">
                <h3>${playlist.name}</h3>
                <p>${playlist.description}</p>
                <span>${playlist.songs.length} sange • ${playlist.creator}</span>
            </div>
        `;

        playlistsGrid.appendChild(playlistCard);

    });

}


/* Search */

const searchButton = document.getElementById("search-button");

const searchOverlay = document.getElementById("search-overlay");

const searchInput = document.getElementById("search-input");

const closeSearch = document.getElementById("close-search");

const searchResults = document.getElementById("search-results");


if (
    searchButton &&
    searchOverlay &&
    searchInput &&
    closeSearch &&
    searchResults
) {

    searchButton.addEventListener("click", () => {

        searchOverlay.classList.add("active");

        searchInput.focus();

    });


    closeSearch.addEventListener("click", () => {

        searchOverlay.classList.remove("active");

        searchInput.value = "";

        searchResults.innerHTML = "";

    });


    searchInput.addEventListener("input", () => {

        const query = searchInput.value.toLowerCase().trim();

        searchResults.innerHTML = "";

        if (!query) {
            return;
        }


        if (typeof artists !== "undefined") {

            artists
                .filter(artist =>
                    artist.name.toLowerCase().includes(query)
                )
                .forEach(artist => {

                    const result = document.createElement("div");

                    result.className = "search-result";

                    result.innerHTML = `
                        <strong>${artist.name}</strong>
                        <span>Kunstner</span>
                    `;

                    searchResults.appendChild(result);

                });

        }


        if (typeof songs !== "undefined") {

            songs
                .filter(song =>
                    song.title.toLowerCase().includes(query) ||
                    song.artist.toLowerCase().includes(query)
                )
                .forEach(song => {

                    const result = document.createElement("div");

                    result.className = "search-result";

                    result.innerHTML = `
                        <strong>${song.title}</strong>
                        <span>Sang · ${song.artist}</span>
                    `;

                    searchResults.appendChild(result);

                });

        }


        if (typeof albums !== "undefined") {

            albums
                .filter(album =>
                    album.title.toLowerCase().includes(query) ||
                    album.artist.toLowerCase().includes(query)
                )
                .forEach(album => {

                    const result = document.createElement("div");

                    result.className = "search-result";

                    result.innerHTML = `
                        <strong>${album.title}</strong>
                        <span>Album · ${album.artist}</span>
                    `;

                    searchResults.appendChild(result);

                });

        }


        if (searchResults.children.length === 0) {

            searchResults.innerHTML = `
                <p class="no-results">
                    Ingen resultater fundet.
                </p>
            `;

        }

    });

}