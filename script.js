
/* ========================= */
/* ARTISTS */
/* ========================= */

const artistsGrid = document.getElementById("artists-grid");

if (artistsGrid && typeof artists !== "undefined") {

    artists.forEach(artist => {

        const artistCard = 
        document.createElement("div");

        artistCard.className = "artist-card";

       artistCard.innerHTML = `
    <div
        class="artist-image"
        style="
            --artist-hue:
            ${(artist.id * 47) % 360};
        "
    >
        ${
            artist.image
                ? `<img
                    src="../${artist.image}"
                    alt="${artist.name}"
                >`
                : `<span class="artist-placeholder-name">
                    ${artist.name}
                   </span>`
        }
    </div>

    <h3>${artist.name}</h3>

    <p>${artist.genre} • ${artist.country}</p>
`;
        artistCard.addEventListener("click", () => {

            window.location.href = 
            `artists.html?id=${artist.id}`;

        });

        artistsGrid.appendChild(artistCard);

    });

}

const artistDetailPage = document.getElementById("artist-detail-page");
const artistsListPage = document.getElementById("artists-list-page");

const urlParams = new URLSearchParams(window.location.search);
const selectedArtistId = Number(urlParams.get("id"));

if (
    artistDetailPage &&
    artistsListPage &&
    selectedArtistId
) {

    const selectedArtist = artists.find(
        artist => artist.id === selectedArtistId
    );

    if (selectedArtist) {

        artistsListPage.style.display = "none";
        artistDetailPage.style.display = "block";

        document.getElementById("artist-name").textContent =
            selectedArtist.name;

        document.getElementById("artist-description").textContent =
            selectedArtist.description;

        document.getElementById("artist-genre").textContent =
            selectedArtist.genre;

        document.getElementById("artist-country").textContent =
            selectedArtist.country;
            
            const artistHeroImage =
    document.querySelector(".artist-hero-image");

if (
    artistHeroImage &&
    selectedArtist.image
) {

    artistHeroImage.innerHTML = `
        <img
            src="../${selectedArtist.image}"
            alt="${selectedArtist.name}"
        >
    `;

}

if (
    artistHeroImage &&
    selectedArtist.image
) {

    artistHeroImage.innerHTML = `
        <img
            src="../${selectedArtist.image}"
            alt="${selectedArtist.name}"
        >
    `;

}
                
            const artistAlbums = document.getElementById("artist-albums");
            const artistSongs = document.getElementById("artist-songs");
            const artistPopularSongs = document.getElementById("artist-popular-songs");
            if (
    artistPopularSongs &&
    typeof songs !== "undefined"
) {

    const popularSongs =
        songs
            .filter(
                song =>
                    song.artist ===
                    selectedArtist.name
            )
            .slice(0, 5);

    artistPopularSongs.innerHTML = "";

    popularSongs.forEach(song => {

        const popularSongCard =
            document.createElement("div");

        popularSongCard.className =
            "music-card";

        popularSongCard.innerHTML = `
            <div class="card-image"></div>

            <div class="card-info">
                <h3>${song.title}</h3>

                <p>${song.artist}</p>

                <span>
                    ${song.album} • ${song.year}
                </span>
            </div>
        `;

        popularSongCard.addEventListener(
            "click",
            () => {

                selectSong(song);

            }
        );

        artistPopularSongs.appendChild(
            popularSongCard
        );

    });

}

    if (artistAlbums && typeof albums !== "undefined") {

        const matchingAlbums = albums.filter(
            album => album.artist === selectedArtist.name
        );

        artistAlbums.innerHTML = "";

        matchingAlbums.forEach(album => {

            const albumCard = document.createElement("div");

            albumCard.className = "album-card";

            albumCard.innerHTML = `
                <div class="album-image">
    <img
        src="../${album.cover}"
        alt="${album.title} – ${album.artist}"
    >
</div>

                <div class="album-info">
                    <h3>${album.title}</h3>
                    <p>${album.artist}</p>
                    <span>${album.year} • ${album.genre}</span>
                </div>
            `;
albumCard.addEventListener("click", () => {

    window.location.href =
        `album.html?id=${album.id}`;

});
            artistAlbums.appendChild(albumCard);

        });
    }


    if (artistSongs && typeof songs !== "undefined") {

        const matchingSongs = songs.filter(
            song => song.artist === selectedArtist.name
        );

        artistSongs.innerHTML = "";

        matchingSongs.forEach(song => {

            const songCard = document.createElement("div");
            
            songCard.dataset.trackNumber =
                matchingSongs.indexOf(song) + 1;

            songCard.className = "music-card";

            songCard.innerHTML = `
                <div class="card-image"></div>

                <div class="card-info">
                    <h3>${song.title}</h3>
                    <p>${song.artist}</p>
                    <span>${song.album} • ${song.year}</span>
                </div>
            `;
songCard.addEventListener("click", () => {

    selectSong(song);

});
            artistSongs.appendChild(songCard);

        });
    }

    }

}

/* ========================= */
/* ALBUMS */
/* ========================= */

const albumsGrid = document.getElementById("albums-grid");

if (albumsGrid && typeof albums !== "undefined") {

    albums.forEach(album => {

        const albumCard = document.createElement("div");

        albumCard.className = "album-card";

        albumCard.innerHTML = `
            <div class="album-image">
    <img
        src="../${album.cover}"
        alt="${album.title} – ${album.artist}"
    >
</div>
            <div class="album-info">
                <h3>${album.title}</h3>

                <p>${album.artist}</p>

                <span>
                    ${album.year} • ${album.genre}
                </span>
            </div>
        `;

            albumCard.addEventListener("click", () => {

            window.location.href =
                `album.html?id=${album.id}`;

        });

        albumsGrid.appendChild(albumCard);

    });

}


/* ========================= */
/* SONGS */
/* ========================= */

const songCard =
    document.createElement("div");

songCard.className =
    "music-card";

songCard.dataset.trackNumber =
    matchingSongs.indexOf(song) + 1;

      songCard.innerHTML = `
    <div class="card-image"></div>

    <div class="card-info">

        <h3>${song.title}</h3>

        <p>${song.artist}</p>

        <span>
            ${song.album} • ${song.year}
        </span>

    </div>

    <button
        class="favorite-song-button"
        data-song-id="${song.id}"
    >
        ♡
    </button>
`;

const favoriteButton =
    songCard.querySelector(".favorite-song-button");
    let savedFavorites =
    JSON.parse(
        localStorage.getItem("favorites")
    ) || [];

if (savedFavorites.includes(song.id)) {

    favoriteButton.textContent = "♥";

}

favoriteButton.addEventListener("click", (event) => {

    event.stopPropagation();

    let favorites =
        JSON.parse(
            localStorage.getItem("favorites")
        ) || [];

    if (favorites.includes(song.id)) {

        favorites =
            favorites.filter(
                id => id !== song.id
            );

        favoriteButton.textContent = "♡";

    } else {

        favorites.push(song.id);

        favoriteButton.textContent = "♥";

    }

  localStorage.setItem(
    "favorites",
    JSON.stringify(favorites)
);

songCard.addEventListener("click", () => {

    selectSong(song);

});

songsGrid.appendChild(songCard);

});
/* ==================== */
/* PLAYLISTS */
/* ========================= */

const playlistsGrid =
    document.getElementById("playlists-grid");

if (
    playlistsGrid &&
    typeof playlists !== "undefined"
) {

    playlists.forEach(playlist => {

        const playlistCard =
            document.createElement("div");

        playlistCard.className =
            "playlist-card";

        playlistCard.innerHTML = `
            <div class="playlist-image">
                <span>▶</span>
            </div>

            <div class="playlist-info">

                <h3>${playlist.name}</h3>

                <p>${playlist.description}</p>

                <span>
                    ${playlist.songs.length}
                    sange •
                    ${playlist.creator}
                </span>

            </div>
        `;

        playlistCard.addEventListener("click", () => {

            window.location.href =
                `playlists.html?id=${playlist.id}`;

        });

                playlistsGrid.appendChild(playlistCard);

    });

}

/* ========================= */
/* SEARCH */
/* ========================= */

const searchButton =
    document.getElementById("search-button");

const searchOverlay =
    document.getElementById("search-overlay");

const searchInput =
    document.getElementById("search-input");

const closeSearch =
    document.getElementById("close-search");

const searchResults =
    document.getElementById("search-results");


if (
    searchButton &&
    searchOverlay &&
    searchInput &&
    closeSearch &&
    searchResults
) {

    /* Open search */

    searchButton.addEventListener("click", () => {

        searchOverlay.classList.add("active");

        searchInput.focus();

    });


    /* Close search */

    closeSearch.addEventListener("click", () => {

        searchOverlay.classList.remove("active");

        searchInput.value = "";

        searchResults.innerHTML = "";

    });


    /* Search */

    searchInput.addEventListener("input", () => {

        const query =
            searchInput.value
                .toLowerCase()
                .trim();

        searchResults.innerHTML = "";


        if (!query) {
            return;
        }


        /* Artists */

        if (typeof artists !== "undefined") {

            artists
                .filter(artist =>
                    artist.name
                        .toLowerCase()
                        .includes(query)
                )
                .forEach(artist => {

                    const result =
                        document.createElement("div");

                    result.className =
                        "search-result";

                    result.innerHTML = `
                        <strong>
                            ${artist.name}
                        </strong>

                        <span>
                            Kunstner
                        </span>
                    `;


                    result.addEventListener(
                        "click",
                        () => {

                    window.location.href =
                                `artists.html?id=${encodeURIComponent(artist.id)}`;
                        }
                    );


                    searchResults.appendChild(result);

                });

        }


        /* Songs */

        if (typeof songs !== "undefined") {

            songs
                .filter(song =>
                    song.title
                        .toLowerCase()
                        .includes(query) ||

                    song.artist
                        .toLowerCase()
                        .includes(query)
                )
                .forEach(song => {

                    const result =
                        document.createElement("div");

                    result.className =
                        "search-result";

                    result.innerHTML = `
                        <strong>
                            ${song.title}
                        </strong>

                        <span>
                            Sang · ${song.artist}
                        </span>
                    `;


                    searchResults.appendChild(result);

                });

        }


        /* Albums */

        if (typeof albums !== "undefined") {

            albums
                .filter(album =>
                    album.title
                        .toLowerCase()
                        .includes(query) ||

                    album.artist
                        .toLowerCase()
                        .includes(query)
                )
                .forEach(album => {

                    const result =
                        document.createElement("div");

                    result.className =
                        "search-result";

                    result.innerHTML = `
                        <strong>
                            ${album.title}
                        </strong>

                        <span>
                            Album · ${album.artist}
                        </span>
                    `;


                    searchResults.appendChild(result);

                });

        }


        /* No results */

        if (searchResults.children.length === 0) {

            searchResults.innerHTML = `
                <p class="no-results">
                    Ingen resultater fundet.
                </p>
            `;

        }

    });

}


/* ========================= */
/* ARTIST DETAIL PAGE */
/* ========================= */

const artistNameElement =
    document.getElementById("artist-name");


if (
    artistNameElement &&
    typeof artists !== "undefined"
) {

    const params =
        new URLSearchParams(
            window.location.search
        );


    const artistId =
        Number(params.get("id"));


    const artist =
        artists.find(
            artist => artist.id === artistId
        );


    if (artist) {

        document.title =
            `${artist.name} | MusikBasen`;


        /* Artist information */

        const nameElement =
            document.getElementById(
                "artist-name"
            );

        const descriptionElement =
            document.getElementById(
                "artist-description"
            );

        const genreElement =
            document.getElementById(
                "artist-genre"
            );

        const countryElement =
            document.getElementById(
                "artist-country"
            );


        if (nameElement) {
            nameElement.textContent =
                artist.name;
        }


        if (descriptionElement) {
            descriptionElement.textContent =
                artist.description;
        }


        if (genreElement) {
            genreElement.textContent =
                artist.genre;
        }


        if (countryElement) {
            countryElement.textContent =
                artist.country;
        }


        /* Artist albums */

        const artistAlbums =
            document.getElementById(
                "artist-albums"
            );


        if (
            artistAlbums &&
            typeof albums !== "undefined"
        ) {

            albums
                .filter(album =>
                    album.artist === artist.name
                )
                .forEach(album => {

                    const card =
                        document.createElement("div");

                    card.className =
                        "album-card";


                    card.innerHTML = `
                        <div class="album-image">

                            <div class="album-placeholder">
                            </div>

                        </div>

                        <div class="album-info">

                            <h3>
                                ${album.title}
                            </h3>

                            <p>
                                ${album.artist}
                            </p>

                            <span>
                                ${album.year}
                                •
                                ${album.genre}
                            </span>

                        </div>
                    `;


                    artistAlbums.appendChild(card);

                });

        }


        /* Artist songs */

        const artistSongs =
            document.getElementById(
                "artist-songs"
            );


        if (
            artistSongs &&
            typeof songs !== "undefined"
        ) {

            songs
                .filter(song =>
                    song.artist === artist.name
                )
                .forEach(song => {

                    const card =
                        document.createElement("div");

                    card.className =
                        "music-card";


                    card.innerHTML = `
                        <div class="card-image"></div>

                        <div class="card-info">

                            <h3>
                                ${song.title}
                            </h3>

                            <p>
                                ${song.artist}
                            </p>

                            <span>
                                ${song.album}
                                •
                                ${song.year}
                            </span>

                        </div>
                    `;


                    artistSongs.appendChild(card);

                });

        }

    }

}
/* ========================= */
/* FAVORITES */
/* ========================= */

function getFavorites() {

    return JSON.parse(
        localStorage.getItem("musikbasen-favorites")
    ) || [];

}


function saveFavorites(favorites) {

    localStorage.setItem(
        "musikbasen-favorites",
        JSON.stringify(favorites)
    );

}


function toggleFavorite(type, id) {

    const favorites = getFavorites();

    const favoriteId = `${type}-${id}`;

    const existingIndex =
        favorites.indexOf(favoriteId);


    if (existingIndex !== -1) {

        favorites.splice(existingIndex, 1);

    } else {

        favorites.push(favoriteId);

    }


    saveFavorites(favorites);

    updateFavoriteButtons();

    renderFavorites();

}


function isFavorite(type, id) {

    const favorites = getFavorites();

    return favorites.includes(
        `${type}-${id}`
    );

}



/* ========================= */
/* FAVORITES PAGE */
/* ========================= */

function renderFavorites() {

    const favoritesGrid =
        document.getElementById(
            "favorites-grid"
        );


    if (!favoritesGrid) {
        return;
    }


    const favorites =
        getFavorites();


    if (favorites.length === 0) {

        favoritesGrid.innerHTML = `

            <div class="empty-favorites">

                <h3>
                    Ingen favoritter endnu
                </h3>

                <p>
                    Tryk på ♡ på en sang,
                    et album eller en kunstner
                    for at gemme den her.
                </p>

            </div>

        `;

        return;

    }


    favoritesGrid.innerHTML = "";


    favorites.forEach(favorite => {

        const [type, id] =
            favorite.split("-");


        const card =
            document.createElement("div");


        card.className =
            "music-card";


        card.innerHTML = `

            <div class="card-image"></div>

            <div class="card-info">

                <span>
                    ${type}
                </span>

                <h3>
                    Favorit #${id}
                </h3>

            </div>

        `;


        favoritesGrid.appendChild(card);

    });

}


/* ========================= */
/* START FAVORITES */
/* ========================= */

renderFavorites();


// =========================
// MUSIC PLAYER
// =========================

const musicPlayer = document.getElementById("music-player");
const playerPlay = document.getElementById("player-play");
const playerProgress = document.getElementById("player-progress-bar");
const playerVolume = document.getElementById("player-volume-bar");

let currentAudio = null;
let isPlaying = false;


// PLAY / PAUSE

if (playerPlay) {

    playerPlay.addEventListener("click", () => {

        if (!currentAudio) {
            return;
        }

        if (isPlaying) {

            currentAudio.pause();
            isPlaying = false;

            playerPlay.textContent = "▶";

        } else {

            currentAudio.play();
            isPlaying = true;

            playerPlay.textContent = "⏸";

        }

    });

}


// VOLUME

if (playerVolume) {

    playerVolume.addEventListener("input", () => {

        if (currentAudio) {
            currentAudio.volume = playerVolume.value;
        }

    });

}
// =========================
// PLAYLIST DETAIL
// =========================

const playlistDetail =
    document.getElementById("playlist-detail");

const playlistList =
    document.getElementById("playlists");

if (
    playlistDetail &&
    playlistList &&
    typeof playlists !== "undefined"
) {

    const params =
        new URLSearchParams(window.location.search);

    const playlistId =
        Number(params.get("id"));

    const selectedPlaylist =
        playlists.find(
            playlist => playlist.id === playlistId
        );

    if (selectedPlaylist) {

        playlistList.style.display = "none";
        playlistDetail.style.display = "block";

        document.getElementById("playlist-name").textContent =
            selectedPlaylist.name;

        document.getElementById("playlist-description").textContent =
            selectedPlaylist.description;
            const playlistSongs =
    
            document.getElementById("playlist-songs");

if (
    playlistSongs &&
    typeof songs !== "undefined"
) {

    playlistSongs.innerHTML = "";

    const matchingSongs =
        songs.filter(song =>
            selectedPlaylist.songs.includes(song.id)
        );

    matchingSongs.forEach(song => {

        const songCard =
            document.createElement("div");

        songCard.className = "music-card";

        songCard.innerHTML = `
            <div class="card-image"></div>

            <div class="card-info">

                <h3>${song.title}</h3>

                <p>${song.artist}</p>

                <span>
                    ${song.album} • ${song.year}
                </span>

            </div>
        `;

        playlistSongs.appendChild(songCard);

    });

}

    }

}
// =========================
// PROFILE PLAYLISTS
// =========================

const profilePlaylists =
    document.getElementById("profile-playlists");

if (
    profilePlaylists &&
    typeof playlists !== "undefined"
) {

    playlists.forEach(playlist => {

        const playlistCard =
            document.createElement("div");

        playlistCard.className =
            "playlist-card";

        playlistCard.innerHTML = `
            <div class="playlist-image">
                <span>▶</span>
            </div>

            <div class="playlist-info">
                <h3>${playlist.name}</h3>

                <p>${playlist.description}</p>

                <span>
                    ${playlist.songs.length} sange
                </span>
            </div>
        `;

        profilePlaylists.appendChild(playlistCard);

    });

}
// =========================
// RANKINGS
// =========================

const topArtists =
    document.getElementById("top-artists");

const topSongs =
    document.getElementById("top-songs");


if (topArtists) {

    const artistRanking = [
        { name: "Gilli", value: "1,2 mio. streams" },
        { name: "Branco", value: "980.000 streams" },
        { name: "Kesi", value: "870.000 streams" },
        { name: "Ude Af Kontrol", value: "760.000 streams" },
        { name: "Sivas", value: "690.000 streams" },
        { name: "Benny Jamz", value: "610.000 streams" }
    ];

    artistRanking.forEach((artist, index) => {

        const item =
            document.createElement("div");

        item.className = "ranking-item";

        item.innerHTML = `
            <div class="ranking-number">
    ${
        index === 0
            ? "🥇"
            : index === 1
            ? "🥈"
            : index === 2
            ? "🥉"
            : `#${index + 1}`
    }
</div>

            <div class="ranking-info">
                <strong>${artist.name}</strong>
                <span>Kunstner</span>
            </div>

            <div class="ranking-value">
                ${artist.value}
            </div>
        `;

        topArtists.appendChild(item);

    });

}


if (topSongs) {

    const songRanking = [
        { title: "Penge Kommer Går", artist: "Gilli", value: "420.000 streams" },
        { title: "All In", artist: "Branco", value: "390.000 streams" },
        { title: "Søvnløs", artist: "Kesi", value: "350.000 streams" },
        { title: "Tro På", artist: "Node", value: "320.000 streams" },
        { title: "Knokler Hårdt", artist: "Gilli", value: "290.000 streams" }
    ];

    songRanking.forEach((song, index) => {

        const item =
            document.createElement("div");

        item.className = "ranking-item";
item.innerHTML = `
    <div class="ranking-number">
        ${
            index === 0
                ? "🥇"
                : index === 1
                ? "🥈"
                : index === 2
                ? "🥉"
                : `#${index + 1}`
        }
    </div>

            <div class="ranking-info">
                <strong>${song.title}</strong>
                <span>${song.artist}</span>
            </div>

            <div class="ranking-value">
                ${song.value}
            </div>
        `;

        topSongs.appendChild(item);

    });

}
// =========================
// FAVORITES BUTTON
// =========================

const favoritesButton =
    document.getElementById("favorites-button");

if (favoritesButton) {

    favoritesButton.addEventListener("click", () => {

        window.location.href = "pages/favorites.html";

    });

}
// =========================
// MUSIC PLAYER
// =========================

let currentSongIndex = -1;

function selectSong(song) {

    if (!musicPlayer) return;

    currentSongIndex =
        songs.findIndex(
            item => item.id === song.id
        );

    musicPlayer.style.display = "flex";

    playerTitle.textContent =
        song.title;

    playerArtist.textContent =
        song.artist;

}

const playerPrev =
    document.getElementById("player-prev");

const playerNext =
    document.getElementById("player-next");

if (playerPrev) {

    playerPrev.addEventListener("click", () => {

        if (currentSongIndex <= 0) {

            currentSongIndex =
                songs.length - 1;

        } else {

            currentSongIndex--;

        }

          selectSong(
            songs[currentSongIndex]
        );

    });

}


    if (playerNext) {

    playerNext.addEventListener("click", () => {

        if (
            currentSongIndex >=
            songs.length - 1
        ) {

            currentSongIndex = 0;

        } else {

            currentSongIndex++;

        }

        selectSong(
            songs[currentSongIndex]
        );

    });

}

let currentVolume = 1;

if (playerVolume) {

    playerVolume.addEventListener("input", () => {

        currentVolume =
            Number(playerVolume.value);

    });

}
const playerProgressBar =
    document.getElementById("player-progress-bar");

if (playerProgressBar) {

    playerProgressBar.addEventListener("input", () => {

        // Klar til rigtig lyd senere

    });

}
/* ========================= */
/* ALBUM DETAIL PAGE */
/* ========================= */

const albumDetailPage =
    document.getElementById("album-detail-page");

if (
    albumDetailPage &&
    typeof albums !== "undefined"
) {

    const albumParams =
        new URLSearchParams(
            window.location.search
        );

    const selectedAlbumId =
        Number(albumParams.get("id"));

    const selectedAlbum =
        albums.find(
            album => album.id === selectedAlbumId
        );

    if (selectedAlbum) {

        const albumImage =
            document.getElementById(
                "album-detail-image"
            );

        const albumTitle =
            document.getElementById(
                "album-detail-title"
            );

        const albumArtist =
            document.getElementById(
                "album-detail-artist"
            );

        const albumMeta =
            document.getElementById(
                "album-detail-meta"
            );


        if (albumImage) {

            albumImage.src =
                "../" + selectedAlbum.cover;

            albumImage.alt =
                selectedAlbum.title +
                " – " +
                selectedAlbum.artist;

        }


        if (albumTitle) {

            albumTitle.textContent =
                selectedAlbum.title;

        }

        

    if (albumArtist) {

    albumArtist.textContent =
        selectedAlbum.artist;

    const selectedArtist =
        artists.find(
            artist =>
                artist.name ===
                selectedAlbum.artist
        );

    if (selectedArtist) {

        albumArtist.href =
            `artist.html?id=${selectedArtist.id}`;

    }

}

    const selectedArtist =
        artists.find(
            artist =>
                artist.name ===
                selectedAlbum.artist
        );

    if (selectedArtist) {

        albumArtist.href =
            `artist.html?id=${selectedArtist.id}`;

    }

}

        if (albumMeta) {

            albumMeta.textContent =
                selectedAlbum.year +
                " • " +
                selectedAlbum.genre;
                        const albumSongs =
            document.getElementById("album-songs");

        if (
            albumSongs &&
            typeof songs !== "undefined"
        ) {

            const matchingSongs =
                songs.filter(
                    song =>
                        song.album ===
                        selectedAlbum.title
                );

            albumSongs.innerHTML = "";

            matchingSongs.forEach(song => {

                const songCard =
                    document.createElement("div");

                songCard.className =
                    "music-card";

                songCard.innerHTML = `
    <div class="card-image"></div>

    <div class="card-info">

        <h3>${song.title}</h3>

        <p>${song.artist}</p>

        <span>
            ${song.year} • ${song.genre}
        </span>

    </div>

    <button
        class="favorite-song-button"
        data-song-id="${song.id}"
    >
        ♡
    </button>
`;
const favoriteButton =
    songCard.querySelector(
        ".favorite-song-button"
    );

let savedFavorites =
    JSON.parse(
        localStorage.getItem("favorites")
    ) || [];

if (savedFavorites.includes(song.id)) {

    favoriteButton.textContent = "♥";

}

favoriteButton.addEventListener(
    "click",
    (event) => {

        event.stopPropagation();

        let favorites =
            JSON.parse(
                localStorage.getItem("favorites")
            ) || [];

        if (favorites.includes(song.id)) {

            favorites =
                favorites.filter(
                    id => id !== song.id
                );

            favoriteButton.textContent = "♡";

        } else {

            favorites.push(song.id);

            favoriteButton.textContent = "♥";

        }

        localStorage.setItem(
            "favorites",
            JSON.stringify(favorites)
        );

    }
);
                songCard.addEventListener(
                    "click",
                    () => {

                        selectSong(song);

                    }
                );

                albumSongs.appendChild(songCard);

            });

        }

        }

    }
