/* =========================================================
   MUSIKBASEN
   DEL 1/4
   GRUNDLAG + MUSIC PLAYER + FAVORITTER
========================================================= */


/* =========================================================
   GRUNDLÆGGENDE HJÆLPEFUNKTIONER
========================================================= */

const MB = {

    currentSong: null,

    currentSongIndex: -1,

    currentAudio: null,

    isPlaying: false

};


/* ---------------------------------------------------------
   FIND UD AF OM VI ER I /pages/
--------------------------------------------------------- */

function isInsidePages() {

    return window.location.pathname.includes(
        "/pages/"
    );

}


/* ---------------------------------------------------------
   LINK TIL ANDRE SIDER
--------------------------------------------------------- */

function pageUrl(fileName) {

    if (isInsidePages()) {

        return fileName;

    }

    return `pages/${fileName}`;

}


/* ---------------------------------------------------------
   BILLEDE / ASSET PATH
--------------------------------------------------------- */

function assetPath(path) {

    if (!path) {

        return "";

    }

    if (
        path.startsWith("http://") ||
        path.startsWith("https://") ||
        path.startsWith("data:")
    ) {

        return path;

    }

    const cleanPath =
        path.replace(/^(\.\.\/)+/, "");

    if (isInsidePages()) {

        return `../${cleanPath}`;

    }

    return cleanPath;

}


/* ---------------------------------------------------------
   HTML-SIKKER TEKST
--------------------------------------------------------- */

function escapeHtml(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }

    return String(value)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

}


/* =========================================================
   FAVORITTER
========================================================= */


/* ---------------------------------------------------------
   HENT FAVORITSANGE
--------------------------------------------------------- */

function getFavorites() {

    const favorites =
        JSON.parse(
            localStorage.getItem("favorites")
        ) || [];


    /*
       Migrerer gamle favoritter fra det gamle system,
       så eksisterende favoritter ikke nødvendigvis forsvinder.
    */

    const oldFavorites =
        JSON.parse(
            localStorage.getItem(
                "musikbasen-favorites"
            )
        ) || [];


    oldFavorites.forEach(favorite => {

        if (
            typeof favorite === "string" &&
            favorite.startsWith("song-")
        ) {

            const songId =
                Number(
                    favorite.replace(
                        "song-",
                        ""
                    )
                );

            if (
                !favorites.includes(songId)
            ) {

                favorites.push(songId);

            }

        }

    });


    localStorage.setItem(
        "favorites",
        JSON.stringify(favorites)
    );


    return favorites;

}


/* ---------------------------------------------------------
   GEM FAVORITSANGE
--------------------------------------------------------- */

function saveFavorites(favorites) {

    localStorage.setItem(
        "favorites",
        JSON.stringify(favorites)
    );

}


/* ---------------------------------------------------------
   ER SANG FAVORIT?
--------------------------------------------------------- */

function isFavorite(songId) {

    return getFavorites().includes(
        songId
    );

}


/* ---------------------------------------------------------
   SKIFT FAVORIT
--------------------------------------------------------- */

function toggleFavorite(songId) {

    let favorites =
        getFavorites();


    if (
        favorites.includes(songId)
    ) {

        favorites =
            favorites.filter(
                id => id !== songId
            );

    } else {

        favorites.push(songId);

    }


    saveFavorites(favorites);


    updateFavoriteButtons();

}


/* ---------------------------------------------------------
   OPDATER ALLE FAVORITKNAPPER
--------------------------------------------------------- */

function updateFavoriteButtons() {

    document
        .querySelectorAll(
            ".favorite-song-button"
        )
        .forEach(button => {

            const songId =
                Number(
                    button.dataset.songId
                );


            if (
                isFavorite(songId)
            ) {

                button.textContent = "♥";

                button.classList.add(
                    "active"
                );

            } else {

                button.textContent = "♡";

                button.classList.remove(
                    "active"
                );

            }

        });

}


/* =========================================================
   PLAY HISTORY
========================================================= */

function addToPlayHistory(songId) {

    let playHistory =
        JSON.parse(
            localStorage.getItem(
                "playHistory"
            )
        ) || [];


    /*
       Fjern sangen først hvis den allerede findes.
       Derefter sættes den øverst.
    */

    playHistory =
        playHistory.filter(
            id => id !== songId
        );


    playHistory.unshift(
        songId
    );


    /*
       Maks 20 sange i historikken
    */

    playHistory =
        playHistory.slice(
            0,
            20
        );


    localStorage.setItem(
        "playHistory",
        JSON.stringify(playHistory)
    );

}


/* =========================================================
   SONG CARD BUILDER
========================================================= */

function createSongCard(song) {

    const songCard =
        document.createElement("div");


    songCard.className =
        "music-card";


    const cover =
        song.cover ||
        song.image ||
        "";


    songCard.innerHTML = `

        <div class="card-image">

            ${
                cover
                    ? `
                        <img
                            src="${assetPath(cover)}"
                            alt="${escapeHtml(song.title)}"
                        >
                    `
                    : ""
            }

        </div>


        <div class="card-info">

            <h3>
                ${escapeHtml(song.title)}
            </h3>

            <p>
                ${escapeHtml(song.artist)}
            </p>

            <span>
                ${escapeHtml(song.album || "Single")}
                •
                ${escapeHtml(song.year || "")}
            </span>

        </div>


        <button
            class="favorite-song-button"
            data-song-id="${song.id}"
            aria-label="Tilføj til favoritter"
        >
            ♡
        </button>

    `;


    const favoriteButton =
        songCard.querySelector(
            ".favorite-song-button"
        );


    if (
        favoriteButton
    ) {

        if (
            isFavorite(song.id)
        ) {

            favoriteButton.textContent =
                "♥";

            favoriteButton.classList.add(
                "active"
            );

        }


        favoriteButton.addEventListener(
            "click",
            event => {

                event.stopPropagation();

                toggleFavorite(
                    song.id
                );

            }
        );

    }


    songCard.addEventListener(
        "click",
        () => {

            selectSong(song);

        }
    );


    return songCard;

}


/* =========================================================
   MUSIC PLAYER
========================================================= */


/* ---------------------------------------------------------
   FIND SANGENS POSITION I DATABASE
--------------------------------------------------------- */

function getSongIndex(song) {

    if (
        typeof songs === "undefined"
    ) {

        return -1;

    }


    return songs.findIndex(
        databaseSong =>
            databaseSong.id === song.id
    );

}


/* ---------------------------------------------------------
   OPDATER PLAYERENS INFORMATION
--------------------------------------------------------- */

function updatePlayerInfo(song) {

    const playerTitle =
        document.getElementById(
            "player-title"
        ) ||
        document.querySelector(
            "[data-player-title]"
        );


    const playerArtist =
        document.getElementById(
            "player-artist"
        ) ||
        document.querySelector(
            "[data-player-artist]"
        );


    const playerImage =
        document.getElementById(
            "player-image"
        ) ||
        document.querySelector(
            "[data-player-image]"
        );


    if (
        playerTitle
    ) {

        playerTitle.textContent =
            song.title;

    }


    if (
        playerArtist
    ) {

        playerArtist.textContent =
            song.artist;

    }


    const cover =
        song.cover ||
        song.image ||
        "";


    if (
        playerImage &&
        cover
    ) {

        if (
            playerImage.tagName === "IMG"
        ) {

            playerImage.src =
                assetPath(cover);

            playerImage.alt =
                song.title;

        }

    }

}


/* ---------------------------------------------------------
   VÆLG EN SANG
--------------------------------------------------------- */

function selectSong(song) {

    if (!song) {

        return;

    }


    MB.currentSong =
        song;


    MB.currentSongIndex =
        getSongIndex(song);


    addToPlayHistory(
        song.id
    );


    updatePlayerInfo(song);


    const musicPlayer =
        document.getElementById(
            "music-player"
        );


    if (
        musicPlayer
    ) {

        musicPlayer.classList.add(
            "active"
        );

    }


    /*
       Hvis du senere får rigtige lydfiler,
       kan sangobjektet bruge:

       audio
       audioUrl
       previewUrl
    */

    const audioSource =
        song.audio ||
        song.audioUrl ||
        song.previewUrl ||
        null;


    if (
        audioSource
    ) {

        if (
            MB.currentAudio
        ) {

            MB.currentAudio.pause();

        }


        MB.currentAudio =
            new Audio(
                assetPath(audioSource)
            );


        MB.currentAudio.volume =
            Number(
                document.getElementById(
                    "player-volume-bar"
                )?.value || 1
            );


        MB.currentAudio.addEventListener(
            "ended",
            () => {

                playNextSong();

            }
        );


        MB.currentAudio.addEventListener(
            "timeupdate",
            updatePlayerProgress
        );


        MB.currentAudio.play()
            .then(() => {

                MB.isPlaying =
                    true;

                updatePlayButton();

            })
            .catch(() => {

                MB.isPlaying =
                    false;

                updatePlayButton();

            });

    } else {

        /*
           Ingen rigtig lydfil endnu.
           Sangen vælges stadig og gemmes i historikken.
        */

        MB.isPlaying =
            false;

        updatePlayButton();

    }

}


/* ---------------------------------------------------------
   OPDATER PLAY/PAUSE-KNAP
--------------------------------------------------------- */

function updatePlayButton() {

    const playerPlay =
        document.getElementById(
            "player-play"
        );


    if (!playerPlay) {

        return;

    }


    playerPlay.textContent =
        MB.isPlaying
            ? "⏸"
            : "▶";

}


/* ---------------------------------------------------------
   PLAY / PAUSE
--------------------------------------------------------- */

function togglePlayerPlayback() {

    if (
        !MB.currentSong
    ) {

        return;

    }


    if (
        !MB.currentAudio
    ) {

        return;

    }


    if (
        MB.isPlaying
    ) {

        MB.currentAudio.pause();

        MB.isPlaying =
            false;

    } else {

        MB.currentAudio.play();

        MB.isPlaying =
            true;

    }


    updatePlayButton();

}


/* ---------------------------------------------------------
   NÆSTE SANG
--------------------------------------------------------- */

function playNextSong() {

    if (
        typeof songs === "undefined" ||
        songs.length === 0
    ) {

        return;

    }


    if (
        MB.currentSongIndex === -1
    ) {

        selectSong(
            songs[0]
        );

        return;

    }


    MB.currentSongIndex =
        (
            MB.currentSongIndex + 1
        ) % songs.length;


    selectSong(
        songs[
            MB.currentSongIndex
        ]
    );

}


/* ---------------------------------------------------------
   FORRIGE SANG
--------------------------------------------------------- */

function playPreviousSong() {

    if (
        typeof songs === "undefined" ||
        songs.length === 0
    ) {

        return;

    }


    if (
        MB.currentSongIndex === -1
    ) {

        selectSong(
            songs[0]
        );

        return;

    }


    MB.currentSongIndex--;


    if (
        MB.currentSongIndex < 0
    ) {

        MB.currentSongIndex =
            songs.length - 1;

    }


    selectSong(
        songs[
            MB.currentSongIndex
        ]
    );

}


/* ---------------------------------------------------------
   PLAYER PROGRESS
--------------------------------------------------------- */

function updatePlayerProgress() {

    const progressBar =
        document.getElementById(
            "player-progress-bar"
        );


    if (
        !progressBar ||
        !MB.currentAudio ||
        !MB.currentAudio.duration
    ) {

        return;

    }


    progressBar.value =
        (
            MB.currentAudio.currentTime /
            MB.currentAudio.duration
        ) * 100;

}


/* ---------------------------------------------------------
   START PLAYER CONTROLS
--------------------------------------------------------- */

function initializeMusicPlayer() {

    const playerPlay =
        document.getElementById(
            "player-play"
        );

    const playerNext =
        document.getElementById(
            "player-next"
        );

    const playerPrev =
        document.getElementById(
            "player-prev"
        );

    const playerVolume =
        document.getElementById(
            "player-volume-bar"
        );

    const playerProgress =
        document.getElementById(
            "player-progress-bar"
        );


    if (playerPlay) {

        playerPlay.addEventListener(
            "click",
            togglePlayerPlayback
        );

    }


    if (playerNext) {

        playerNext.addEventListener(
            "click",
            playNextSong
        );

    }


    if (playerPrev) {

        playerPrev.addEventListener(
            "click",
            playPreviousSong
        );

    }


    if (playerVolume) {

        playerVolume.addEventListener(
            "input",
            () => {

                if (
                    MB.currentAudio
                ) {

                    MB.currentAudio.volume =
                        Number(
                            playerVolume.value
                        );

                }

            }
        );

    }


    if (playerProgress) {

        playerProgress.addEventListener(
            "input",
            () => {

                if (
                    MB.currentAudio &&
                    MB.currentAudio.duration
                ) {

                    MB.currentAudio.currentTime =
                        (
                            Number(
                                playerProgress.value
                            ) / 100
                        ) *
                        MB.currentAudio.duration;

                }

            }
        );

    }

}


/* =========================================================
   START PLAYER
========================================================= */

initializeMusicPlayer();
/* =========================================================
   MUSIKBASEN
   DEL 2/4
   SANGE + KUNSTNERE + ALBUMS + SØGNING
========================================================= */


/* =========================================================
   SONGS PAGE
========================================================= */

const songsGrid =
    document.getElementById(
        "songs-grid"
    );


if (
    songsGrid &&
    typeof songs !== "undefined"
) {

    songsGrid.innerHTML = "";


    songs.forEach(song => {

        const songCard =
            createSongCard(song);


        songsGrid.appendChild(
            songCard
        );

    });

}


/* =========================================================
   ARTISTS PAGE
========================================================= */

const artistsGrid =
    document.getElementById(
        "artists-grid"
    );


if (
    artistsGrid &&
    typeof artists !== "undefined"
) {

    artistsGrid.innerHTML = "";


    artists.forEach(artist => {

        const artistCard =
            document.createElement("div");


        artistCard.className =
            "artist-card";


        const artistImage =
            artist.image || "";


        artistCard.innerHTML = `

            <div class="artist-image">

                ${
                    artistImage
                        ? `
                            <img
                                src="${assetPath(artistImage)}"
                                alt="${escapeHtml(artist.name)}"
                            >
                        `
                        : ""
                }

            </div>


            <div class="artist-info">

                <h3>
                    ${escapeHtml(artist.name)}
                </h3>

                <p>
                    ${escapeHtml(artist.genre || "")}
                </p>

                ${
                    artist.listeners
                        ? `
                            <span>
                                ${escapeHtml(artist.listeners)}
                                månedlige lyttere
                            </span>
                        `
                        : ""
                }

            </div>

        `;


        artistCard.addEventListener(
            "click",
            () => {

                window.location.href =
                    `artist.html?id=${artist.id}`;

            }
        );


        artistsGrid.appendChild(
            artistCard
        );

    });

}


/* =========================================================
   ALBUMS PAGE
========================================================= */

const albumsGrid =
    document.getElementById(
        "albums-grid"
    );


if (
    albumsGrid &&
    typeof albums !== "undefined"
) {

    albumsGrid.innerHTML = "";


    albums.forEach(album => {

        const albumCard =
            document.createElement("div");


        albumCard.className =
            "album-card";


        albumCard.innerHTML = `

            <div class="album-image">

                ${
                    album.cover
                        ? `
                            <img
                                src="${assetPath(album.cover)}"
                                alt="${escapeHtml(album.title)}"
                            >
                        `
                        : ""
                }

            </div>


            <div class="album-info">

                <h3>
                    ${escapeHtml(album.title)}
                </h3>

                <p>
                    ${escapeHtml(album.artist)}
                </p>

                <span>
                    ${escapeHtml(album.year || "")}
                    •
                    ${escapeHtml(album.genre || "")}
                </span>

            </div>

        `;


        albumCard.addEventListener(
            "click",
            () => {

                window.location.href =
                    `album.html?id=${album.id}`;

            }
        );


        albumsGrid.appendChild(
            albumCard
        );

    });

}


/* =========================================================
   ARTIST DETAIL PAGE
========================================================= */

const artistDetailPage =
    document.getElementById(
        "artist-detail-page"
    );


if (
    artistDetailPage &&
    typeof artists !== "undefined"
) {

    const params =
        new URLSearchParams(
            window.location.search
        );


    const artistId =
        Number(
            params.get("id")
        );


    const selectedArtist =
        artists.find(
            artist =>
                artist.id === artistId
        );


    if (
        selectedArtist
    ) {

        const artistImage =
            document.getElementById(
                "artist-detail-image"
            );

        const artistName =
            document.getElementById(
                "artist-detail-name"
            );

        const artistGenre =
            document.getElementById(
                "artist-detail-genre"
            );

        const artistListeners =
            document.getElementById(
                "artist-detail-listeners"
            );


        if (
            artistImage &&
            selectedArtist.image
        ) {

            artistImage.src =
                assetPath(
                    selectedArtist.image
                );

            artistImage.alt =
                selectedArtist.name;

        }


        if (
            artistName
        ) {

            artistName.textContent =
                selectedArtist.name;

        }


        if (
            artistGenre
        ) {

            artistGenre.textContent =
                selectedArtist.genre || "";

        }


        if (
            artistListeners
        ) {

            artistListeners.textContent =
                selectedArtist.listeners ||
                "";

        }


        /*
           ARTIST SONGS
        */

        const artistSongs =
            document.getElementById(
                "artist-songs"
            );


        if (
            artistSongs &&
            typeof songs !== "undefined"
        ) {

            artistSongs.innerHTML = "";


            const matchingSongs =
                songs.filter(
                    song =>
                        song.artist ===
                        selectedArtist.name
                );


            matchingSongs.forEach(song => {

                artistSongs.appendChild(
                    createSongCard(song)
                );

            });

        }


        /*
           ARTIST ALBUMS
        */

        const artistAlbums =
            document.getElementById(
                "artist-albums"
            );


        if (
            artistAlbums &&
            typeof albums !== "undefined"
        ) {

            artistAlbums.innerHTML = "";


            const matchingAlbums =
                albums.filter(
                    album =>
                        album.artist ===
                        selectedArtist.name
                );


            matchingAlbums.forEach(album => {

                const albumCard =
                    document.createElement("div");


                albumCard.className =
                    "album-card";


                albumCard.innerHTML = `

                    <div class="album-image">

                        ${
                            album.cover
                                ? `
                                    <img
                                        src="${assetPath(album.cover)}"
                                        alt="${escapeHtml(album.title)}"
                                    >
                                `
                                : ""
                        }

                    </div>


                    <div class="album-info">

                        <h3>
                            ${escapeHtml(album.title)}
                        </h3>

                        <p>
                            ${escapeHtml(album.year || "")}
                        </p>

                    </div>

                `;


                albumCard.addEventListener(
                    "click",
                    () => {

                        window.location.href =
                            `album.html?id=${album.id}`;

                    }
                );


                artistAlbums.appendChild(
                    albumCard
                );

            });

        }

    }

}


/* =========================================================
   ALBUM DETAIL PAGE
========================================================= */

const albumDetailPage =
    document.getElementById(
        "album-detail-page"
    );


if (
    albumDetailPage &&
    typeof albums !== "undefined"
) {

    const params =
        new URLSearchParams(
            window.location.search
        );


    const albumId =
        Number(
            params.get("id")
        );


    const selectedAlbum =
        albums.find(
            album =>
                album.id === albumId
        );


    if (
        selectedAlbum
    ) {

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


        if (
            albumImage &&
            selectedAlbum.cover
        ) {

            albumImage.src =
                assetPath(
                    selectedAlbum.cover
                );

            albumImage.alt =
                `${selectedAlbum.title} – ${selectedAlbum.artist}`;

        }


        if (
            albumTitle
        ) {

            albumTitle.textContent =
                selectedAlbum.title;

        }


        if (
            albumArtist
        ) {

            albumArtist.textContent =
                selectedAlbum.artist;


            if (
                typeof artists !== "undefined"
            ) {

                const selectedArtist =
                    artists.find(
                        artist =>
                            artist.name ===
                            selectedAlbum.artist
                    );


                if (
                    selectedArtist
                ) {

                    albumArtist.href =
                        `artist.html?id=${selectedArtist.id}`;

                }

            }

        }


        if (
            albumMeta
        ) {

            albumMeta.textContent =
                `${selectedAlbum.year} • ${selectedAlbum.genre}`;

        }


        /*
           ALBUM SONGS
        */

        const albumSongs =
            document.getElementById(
                "album-songs"
            );


        if (
            albumSongs &&
            typeof songs !== "undefined"
        ) {

            albumSongs.innerHTML = "";


            const matchingSongs =
                songs.filter(
                    song =>
                        song.album ===
                        selectedAlbum.title
                );


            matchingSongs.forEach(song => {

                albumSongs.appendChild(
                    createSongCard(song)
                );

            });

        }

    }

}


/* =========================================================
   SEARCH
========================================================= */

const searchInput =
    document.getElementById(
        "search-input"
    );


const searchResults =
    document.getElementById(
        "search-results"
    );


if (
    searchInput &&
    searchResults
) {

    searchInput.addEventListener(
        "input",
        () => {

            const query =
                searchInput.value
                    .trim()
                    .toLowerCase();


            searchResults.innerHTML = "";


            if (
                query.length < 1
            ) {

                searchResults.style.display =
                    "none";

                return;

            }


            const results = [];


            /*
               SONG RESULTS
            */

            if (
                typeof songs !== "undefined"
            ) {

                songs.forEach(song => {

                    const searchableText =
                        `${song.title} ${song.artist} ${song.album || ""}`
                            .toLowerCase();


                    if (
                        searchableText.includes(
                            query
                        )
                    ) {

                        results.push({
                            type: "song",
                            data: song
                        });

                    }

                });

            }


            /*
               ARTIST RESULTS
            */

            if (
                typeof artists !== "undefined"
            ) {

                artists.forEach(artist => {

                    const searchableText =
                        `${artist.name} ${artist.genre || ""}`
                            .toLowerCase();


                    if (
                        searchableText.includes(
                            query
                        )
                    ) {

                        results.push({
                            type: "artist",
                            data: artist
                        });

                    }

                });

            }


            /*
               ALBUM RESULTS
            */

            if (
                typeof albums !== "undefined"
            ) {

                albums.forEach(album => {

                    const searchableText =
                        `${album.title} ${album.artist}`
                            .toLowerCase();


                    if (
                        searchableText.includes(
                            query
                        )
                    ) {

                        results.push({
                            type: "album",
                            data: album
                        });

                    }

                });

            }


            /*
               MAX 10 RESULTATER
            */

            results
                .slice(0, 10)
                .forEach(result => {

                    const resultItem =
                        document.createElement(
                            "div"
                        );


                    resultItem.className =
                        "search-result-item";


                    if (
                        result.type === "song"
                    ) {

                        resultItem.innerHTML = `
                            <strong>
                                ${escapeHtml(
                                    result.data.title
                                )}
                            </strong>

                            <span>
                                Sang •
                                ${escapeHtml(
                                    result.data.artist
                                )}
                            </span>
                        `;


                        resultItem.addEventListener(
                            "click",
                            () => {

                                selectSong(
                                    result.data
                                );

                                searchResults.style.display =
                                    "none";

                            }
                        );

                    }


                    if (
                        result.type === "artist"
                    ) {

                        resultItem.innerHTML = `
                            <strong>
                                ${escapeHtml(
                                    result.data.name
                                )}
                            </strong>

                            <span>
                                Kunstner
                            </span>
                        `;


                        resultItem.addEventListener(
                            "click",
                            () => {

                                window.location.href =
                                    pageUrl(
                                        `artist.html?id=${result.data.id}`
                                    );

                            }
                        );

                    }


                    if (
                        result.type === "album"
                    ) {

                        resultItem.innerHTML = `
                            <strong>
                                ${escapeHtml(
                                    result.data.title
                                )}
                            </strong>

                            <span>
                                Album •
                                ${escapeHtml(
                                    result.data.artist
                                )}
                            </span>
                        `;


                        resultItem.addEventListener(
                            "click",
                            () => {

                                window.location.href =
                                    pageUrl(
                                        `album.html?id=${result.data.id}`
                                    );

                            }
                        );

                    }


                    searchResults.appendChild(
                        resultItem
                    );

                });


            searchResults.style.display =
                results.length > 0
                    ? "block"
                    : "none";

        }
    );

}


/* =========================================================
   FAVORITES BUTTON I HEADER
========================================================= */

const favoritesButton =
    document.getElementById(
        "favorites-button"
    );


if (
    favoritesButton
) {

    favoritesButton.addEventListener(
        "click",
        () => {

            window.location.href =
                pageUrl(
                    "favorites.html"
                );

        }
    );

}
console.log("MusikBasen nye script.js er loaded");