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
    `artists.html?id=${artist.id}`;

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
    document.getElementById("artist-detail-page");

const artistsListPage =
    document.getElementById("artists-list-page");


if (
    artistDetailPage &&
    typeof artists !== "undefined"
) {

    const params =
        new URLSearchParams(
            window.location.search
        );

    const artistId =
        Number(params.get("id"));

    /*
       Hvis der er et artist-id,
       viser vi kunstnersiden.
    */

    if (artistId) {

        const selectedArtist =
            artists.find(
                artist =>
                    artist.id === artistId
            );


        if (selectedArtist) {

            /* -----------------------------------------
               VIS KUN KUNSTNERDETALJER
            ----------------------------------------- */

            if (artistsListPage) {

                artistsListPage.style.display =
                    "none";

            }


            artistDetailPage.style.display =
                "block";


            /* -----------------------------------------
               ARTIST NAVN
            ----------------------------------------- */

            const artistName =
                document.getElementById(
                    "artist-name"
                );


            if (artistName) {

                artistName.textContent =
                    selectedArtist.name;

            }


            /* -----------------------------------------
               ARTIST BESKRIVELSE
            ----------------------------------------- */

            const artistDescription =
                document.getElementById(
                    "artist-description"
                );


            if (artistDescription) {

                artistDescription.textContent =
                    `${selectedArtist.name} er en dansk kunstner på MusikBasen.`;

            }


            /* -----------------------------------------
               GENRE
            ----------------------------------------- */

            const artistGenre =
                document.getElementById(
                    "artist-genre"
                );


            if (artistGenre) {

                artistGenre.textContent =
                    selectedArtist.genre || "";

            }


            /* -----------------------------------------
               COUNTRY
            ----------------------------------------- */

            const artistCountry =
                document.getElementById(
                    "artist-country"
                );


            if (artistCountry) {

                artistCountry.textContent =
                    selectedArtist.country || "";

            }


            /* -----------------------------------------
               ARTIST BILLEDE
            ----------------------------------------- */

            const artistHeroImage =
                artistDetailPage.querySelector(
                    ".artist-hero-image"
                );


            if (artistHeroImage) {

                if (
                    selectedArtist.image
                ) {

                    artistHeroImage.innerHTML = `

                        <img
                            src="${assetPath(
                                selectedArtist.image
                            )}"
                            alt="${escapeHtml(
                                selectedArtist.name
                            )}"
                        >

                    `;

                } else {

                    artistHeroImage.innerHTML = `

                        <div class="artist-placeholder-name">

                            ${escapeHtml(
                                selectedArtist.name
                            )}

                        </div>

                    `;

                }

            }


            /* -----------------------------------------
               ARTIST SANGE
            ----------------------------------------- */

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


                if (
                    matchingSongs.length === 0
                ) {

                    artistSongs.innerHTML = `

                        <p class="empty-message">
                            Denne kunstner har ingen sange endnu.
                        </p>

                    `;

                } else {

                    matchingSongs.forEach(
                        song => {

                            artistSongs.appendChild(
                                createSongCard(song)
                            );

                        }
                    );

                }

            }


            /* -----------------------------------------
               ARTIST ALBUMS
            ----------------------------------------- */

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


                if (
                    matchingAlbums.length === 0
                ) {

                    artistAlbums.innerHTML = `

                        <p class="empty-message">
                            Denne kunstner har ingen albums endnu.
                        </p>

                    `;

                } else {

                    matchingAlbums.forEach(
                        album => {

                            const albumCard =
                                document.createElement(
                                    "div"
                                );


                            albumCard.className =
                                "album-card";


                            albumCard.innerHTML = `

                                <div class="album-image">

                                    ${
                                        album.cover
                                            ? `
                                                <img
                                                    src="${assetPath(
                                                        album.cover
                                                    )}"
                                                    alt="${escapeHtml(
                                                        album.title
                                                    )}"
                                                >
                                            `
                                            : ""
                                    }

                                </div>


                                <div class="album-info">

                                    <h3>
                                        ${escapeHtml(
                                            album.title
                                        )}
                                    </h3>

                                    <p>
                                        ${escapeHtml(
                                            album.artist
                                        )}
                                    </p>

                                    <span>
                                        ${escapeHtml(
                                            album.year || ""
                                        )}
                                    </span>

                                </div>

                            `;


                            albumCard.addEventListener(
                                "click",
                                () => {

                                    window.location.href =
                                        pageUrl(
                                            `album.html?id=${album.id}`
                                        );

                                }
                            );


                            artistAlbums.appendChild(
                                albumCard
                            );

                        }
                    );

                }

            }

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
/* =========================================================
   MUSIKBASEN
   DEL 3/4
   PLAYLISTER + BRUGER-PLAYLISTER
========================================================= */


/* =========================================================
   OFFICIELLE MUSIKBASEN PLAYLISTER
========================================================= */

const playlistsGrid =
    document.getElementById(
        "playlists-grid"
    );


if (
    playlistsGrid &&
    typeof playlists !== "undefined"
) {

    playlistsGrid.innerHTML = "";


    playlists.forEach(playlist => {

        const playlistCard =
            document.createElement("div");


        playlistCard.className =
            "playlist-card";


        playlistCard.innerHTML = `

            <div
                class="playlist-image playlist-${escapeHtml(
                    playlist.color || "default"
                )}"
            >

                <span>▶</span>

            </div>


            <div class="playlist-info">

                <h3>
                    ${escapeHtml(
                        playlist.name
                    )}
                </h3>

                <p>
                    ${escapeHtml(
                        playlist.description
                    )}
                </p>

                <span>
                    ${
                        Array.isArray(
                            playlist.songs
                        )
                            ? playlist.songs.length
                            : 0
                    }
                    sange
                    •
                    ${escapeHtml(
                        playlist.creator ||
                        "MusikBasen"
                    )}
                </span>

            </div>

        `;


        playlistCard.addEventListener(
            "click",
            () => {

                window.location.href =
                    pageUrl(
                        `playlists.html?id=${playlist.id}`
                    );

            }
        );


        playlistsGrid.appendChild(
            playlistCard
        );

    });

}


/* =========================================================
   USER PLAYLIST HELPERS
========================================================= */


/* ---------------------------------------------------------
   HENT BRUGERENS PLAYLISTER
--------------------------------------------------------- */

function getUserPlaylists() {

    return JSON.parse(
        localStorage.getItem(
            "userPlaylists"
        )
    ) || [];

}


/* ---------------------------------------------------------
   GEM BRUGERENS PLAYLISTER
--------------------------------------------------------- */

function saveUserPlaylists(
    userPlaylists
) {

    localStorage.setItem(
        "userPlaylists",
        JSON.stringify(
            userPlaylists
        )
    );

}


/* =========================================================
   USER PLAYLISTS PÅ PROFIL
========================================================= */

const profilePlaylists =
    document.getElementById(
        "profile-playlists"
    );


if (
    profilePlaylists
) {

    const userPlaylists =
        getUserPlaylists();


    profilePlaylists.innerHTML =
        "";


    if (
        userPlaylists.length === 0
    ) {

        profilePlaylists.innerHTML = `

            <p class="empty-message">
                Du har ikke oprettet nogen
                playlister endnu.
            </p>

        `;

    } else {

        userPlaylists.forEach(
            playlist => {

                const playlistCard =
                    document.createElement(
                        "div"
                    );


                playlistCard.className =
                    "playlist-card";


                playlistCard.innerHTML = `

                    <div
                        class="playlist-image"
                    >

                        <span>▶</span>

                    </div>


                    <div
                        class="playlist-info"
                    >

                        <h3>
                            ${escapeHtml(
                                playlist.name
                            )}
                        </h3>

                        <p>
                            ${escapeHtml(
                                playlist.description ||
                                ""
                            )}
                        </p>

                        <span>
                            ${
                                Array.isArray(
                                    playlist.songs
                                )
                                    ? playlist.songs.length
                                    : 0
                            }
                            sange
                            •
                            Din playlist
                        </span>

                    </div>

                `;


                playlistCard.addEventListener(
                    "click",
                    () => {

                        window.location.href =
                            pageUrl(
                                `playlists.html?id=${playlist.id}&user=true`
                            );

                    }
                );


                profilePlaylists.appendChild(
                    playlistCard
                );

            }
        );

    }

}


/* =========================================================
   PLAYLIST DETAIL
========================================================= */

const playlistDetail =
    document.getElementById(
        "playlist-detail"
    );


const playlistList =
    document.getElementById(
        "playlists"
    );


if (
    playlistDetail &&
    playlistList
) {

    const params =
        new URLSearchParams(
            window.location.search
        );


    const selectedPlaylistId =
        Number(
            params.get("id")
        );


    const isUserPlaylist =
        params.get("user") === "true";


    /*
       USER PLAYLIST
    */

    if (
        isUserPlaylist &&
        selectedPlaylistId
    ) {

        const userPlaylists =
            getUserPlaylists();


        const selectedPlaylist =
            userPlaylists.find(
                playlist =>
                    playlist.id ===
                    selectedPlaylistId
            );


        if (
            selectedPlaylist
        ) {

            renderPlaylistDetail(
                selectedPlaylist,
                true
            );

        }

    }


    /*
       OFFICIEL PLAYLIST
    */

    else if (
        selectedPlaylistId &&
        typeof playlists !== "undefined"
    ) {

        const selectedPlaylist =
            playlists.find(
                playlist =>
                    playlist.id ===
                    selectedPlaylistId
            );


        if (
            selectedPlaylist
        ) {

            renderPlaylistDetail(
                selectedPlaylist,
                false
            );

        }

    }

}


/* =========================================================
   RENDER PLAYLIST DETAIL
========================================================= */

function renderPlaylistDetail(
    playlist,
    isUserPlaylist
) {

    if (
        !playlist
    ) {

        return;

    }


    const playlistDetail =
        document.getElementById(
            "playlist-detail"
        );


    const playlistList =
        document.getElementById(
            "playlists"
        );


    if (
        !playlistDetail
    ) {

        return;

    }


    if (
        playlistList
    ) {

        playlistList.style.display =
            "none";

    }


    playlistDetail.style.display =
        "block";


    const playlistName =
        document.getElementById(
            "playlist-name"
        );


    const playlistDescription =
        document.getElementById(
            "playlist-description"
        );


    if (
        playlistName
    ) {

        playlistName.textContent =
            playlist.name;

    }


    if (
        playlistDescription
    ) {

        playlistDescription.textContent =
            playlist.description ||
            "";

    }


    const playlistSongs =
        document.getElementById(
            "playlist-songs"
        );


    if (
        !playlistSongs
    ) {

        return;

    }


    playlistSongs.innerHTML =
        "";


    if (
        !Array.isArray(
            playlist.songs
        ) ||
        typeof songs === "undefined"
    ) {

        playlistSongs.innerHTML = `

            <p class="empty-message">
                Denne playlist har ingen sange endnu.
            </p>

        `;

        return;

    }


    const playlistSongList =
        playlist.songs
            .map(
                songId =>
                    songs.find(
                        song =>
                            song.id ===
                            songId
                    )
            )
            .filter(
                song => song
            );


    if (
        playlistSongList.length === 0
    ) {

        playlistSongs.innerHTML = `

            <p class="empty-message">
                Denne playlist har ingen sange endnu.
            </p>

        `;

        return;

    }


    playlistSongList.forEach(
        song => {

            const songCard =
                createSongCard(song);


            playlistSongs.appendChild(
                songCard
            );

        }
    );


    /*
       Hvis det er brugerens playlist,
       tilføjer vi en lille markering.
    */

    if (
        isUserPlaylist
    ) {

        playlistDetail.classList.add(
            "user-playlist-detail"
        );

    } else {

        playlistDetail.classList.remove(
            "user-playlist-detail"
        );

    }

}


/* =========================================================
   OPRET NY BRUGER-PLAYLIST
========================================================= */

function createUserPlaylist(
    name,
    description = ""
) {

    const cleanName =
        String(
            name || ""
        ).trim();


    if (
        !cleanName
    ) {

        return null;

    }


    const userPlaylists =
        getUserPlaylists();


    const newPlaylist = {

        id:
            Date.now(),

        name:
            cleanName,

        description:
            String(
                description || ""
            ).trim(),

        creator:
            "Dig",

        songs:
            [],

        color:
            "user"

    };


    userPlaylists.push(
        newPlaylist
    );


    saveUserPlaylists(
        userPlaylists
    );


    return newPlaylist;

}


/* =========================================================
   TILFØJ SANG TIL BRUGER-PLAYLIST
========================================================= */

function addSongToUserPlaylist(
    playlistId,
    songId
) {

    const userPlaylists =
        getUserPlaylists();


    const playlist =
        userPlaylists.find(
            item =>
                item.id ===
                playlistId
        );


    if (
        !playlist
    ) {

        return false;

    }


    if (
        !Array.isArray(
            playlist.songs
        )
    ) {

        playlist.songs = [];

    }


    if (
        playlist.songs.includes(
            songId
        )
    ) {

        return false;

    }


    playlist.songs.push(
        songId
    );


    saveUserPlaylists(
        userPlaylists
    );


    return true;

}


/* =========================================================
   FJERN SANG FRA BRUGER-PLAYLIST
========================================================= */

function removeSongFromUserPlaylist(
    playlistId,
    songId
) {

    const userPlaylists =
        getUserPlaylists();


    const playlist =
        userPlaylists.find(
            item =>
                item.id ===
                playlistId
        );


    if (
        !playlist ||
        !Array.isArray(
            playlist.songs
        )
    ) {

        return false;

    }


    playlist.songs =
        playlist.songs.filter(
            id =>
                id !== songId
        );


    saveUserPlaylists(
        userPlaylists
    );


    return true;

}


/* =========================================================
   SLET BRUGER-PLAYLIST
========================================================= */

function deleteUserPlaylist(
    playlistId
) {

    let userPlaylists =
        getUserPlaylists();


    userPlaylists =
        userPlaylists.filter(
            playlist =>
                playlist.id !==
                playlistId
        );


    saveUserPlaylists(
        userPlaylists
    );

}
/* =========================================================
   MUSIKBASEN
   DEL 4/4
   RANKINGS + PROFIL + PLAY HISTORY
========================================================= */


/* =========================================================
   RANKINGS
========================================================= */


/* ---------------------------------------------------------
   TOP ARTISTS
--------------------------------------------------------- */

const topArtists =
    document.getElementById(
        "top-artists"
    );


if (
    topArtists &&
    typeof artists !== "undefined"
) {

    topArtists.innerHTML = "";


    artists
        .slice(0, 10)
        .forEach(
            (artist, index) => {

                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "ranking-item";


                item.innerHTML = `

                    <div
                        class="ranking-position"
                    >
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


                    <div
                        class="ranking-artist-image"
                    >

                        ${
                            artist.image
                                ? `
                                    <img
                                        src="${assetPath(
                                            artist.image
                                        )}"
                                        alt="${escapeHtml(
                                            artist.name
                                        )}"
                                    >
                                `
                                : ""
                        }

                    </div>


                    <div
                        class="ranking-info"
                    >

                        <h3>
                            ${escapeHtml(
                                artist.name
                            )}
                        </h3>

                        <p>
                            ${escapeHtml(
                                artist.genre || ""
                            )}
                            ${
                                artist.country
                                    ? ` • ${escapeHtml(
                                        artist.country
                                    )}`
                                    : ""
                            }
                        </p>

                    </div>

                `;


                item.addEventListener(
                    "click",
                    () => {

                        window.location.href =
                            pageUrl(
    `artists.html?id=${artist.id}`
);
                    }
                );


                topArtists.appendChild(
                    item
                );

            }
        );

}


/* ---------------------------------------------------------
   TOP SONGS
--------------------------------------------------------- */

const rankingsTopSongs =
    document.getElementById(
        "top-songs"
    );


if (
    rankingsTopSongs &&
    typeof songs !== "undefined"
) {

    rankingsTopSongs.innerHTML = "";


    songs
        .slice(0, 10)
        .forEach(
            (song, index) => {

                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "ranking-item";


                item.innerHTML = `

                    <div
                        class="ranking-position"
                    >
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


                    <div
                        class="ranking-info"
                    >

                        <h3>
                            ${escapeHtml(
                                song.title
                            )}
                        </h3>

                        <p>
                            ${escapeHtml(
                                song.artist
                            )}
                            ${
                                song.album
                                    ? ` • ${escapeHtml(
                                        song.album
                                    )}`
                                    : ""
                            }
                        </p>

                    </div>

                `;


                item.addEventListener(
                    "click",
                    () => {

                        selectSong(
                            song
                        );

                    }
                );


                rankingsTopSongs.appendChild(
                    item
                );

            }
        );

}


/* ---------------------------------------------------------
   TOP ALBUMS
--------------------------------------------------------- */

const topAlbums =
    document.getElementById(
        "top-albums"
    );


if (
    topAlbums &&
    typeof albums !== "undefined"
) {

    topAlbums.innerHTML = "";


    albums
        .slice(0, 10)
        .forEach(
            (album, index) => {

                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "ranking-item";


                item.innerHTML = `

                    <div
                        class="ranking-position"
                    >
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


                    <div
                        class="ranking-album-image"
                    >

                        ${
                            album.cover
                                ? `
                                    <img
                                        src="${assetPath(
                                            album.cover
                                        )}"
                                        alt="${escapeHtml(
                                            album.title
                                        )}"
                                    >
                                `
                                : ""
                        }

                    </div>


                    <div
                        class="ranking-info"
                    >

                        <h3>
                            ${escapeHtml(
                                album.title
                            )}
                        </h3>

                        <p>
                            ${escapeHtml(
                                album.artist
                            )}
                            •
                            ${escapeHtml(
                                album.year || ""
                            )}
                        </p>

                    </div>

                `;


                item.addEventListener(
                    "click",
                    () => {

                        window.location.href =
                            pageUrl(
                                `album.html?id=${album.id}`
                            );

                    }
                );


                topAlbums.appendChild(
                    item
                );

            }
        );

}


/* =========================================================
   PROFILE — FAVORITES
========================================================= */

const profileFavorites =
    document.getElementById(
        "profile-favorites"
    );


if (
    profileFavorites &&
    typeof songs !== "undefined"
) {

    profileFavorites.innerHTML = "";


    const favorites =
        getFavorites();


    const favoriteSongs =
        songs.filter(
            song =>
                favorites.includes(
                    song.id
                )
        );


    if (
        favoriteSongs.length === 0
    ) {

        profileFavorites.innerHTML = `

            <p class="empty-message">
                Du har ingen favoritsange endnu.
            </p>

        `;

    } else {

        favoriteSongs.forEach(
            song => {

                profileFavorites.appendChild(
                    createSongCard(song)
                );

            }
        );

    }

}


/* =========================================================
   PROFILE — PLAY HISTORY
========================================================= */

const profileHistory =
    document.getElementById(
        "profile-history"
    );


if (
    profileHistory &&
    typeof songs !== "undefined"
) {

    profileHistory.innerHTML = "";


    const historyIds =
        JSON.parse(
            localStorage.getItem(
                "playHistory"
            )
        ) || [];


    const historySongs =
        historyIds

            .map(
                songId =>
                    songs.find(
                        song =>
                            song.id ===
                            songId
                    )
            )

            .filter(
                song => song
            );


    if (
        historySongs.length === 0
    ) {

        profileHistory.innerHTML = `

            <p class="empty-message">
                Du har ikke afspillet
                nogen sange endnu.
            </p>

        `;

    } else {

        historySongs.forEach(
            song => {

                profileHistory.appendChild(
                    createSongCard(song)
                );

            }
        );

    }

}


/* =========================================================
   PROFILE — STATISTIK
========================================================= */

const profileStats =
    document.getElementById(
        "profile-stats"
    );


if (
    profileStats &&
    typeof songs !== "undefined"
) {

    const favorites =
        getFavorites();


    const history =
        JSON.parse(
            localStorage.getItem(
                "playHistory"
            )
        ) || [];


    profileStats.innerHTML = `

        <div class="profile-stat">

            <strong>
                ${favorites.length}
            </strong>

            <span>
                Favoritsange
            </span>

        </div>


        <div class="profile-stat">

            <strong>
                ${history.length}
            </strong>

            <span>
                Afspillede sange
            </span>

        </div>


        <div class="profile-stat">

            <strong>
                ${
                    new Set(
                        history
                    ).size
                }
            </strong>

            <span>
                Forskellige sange
            </span>

        </div>

    `;

}


/* =========================================================
   PROFILE — MOST PLAYED ARTISTS
========================================================= */

const profileTopArtists =
    document.getElementById(
        "profile-top-artists"
    );


if (
    profileTopArtists &&
    typeof songs !== "undefined" &&
    typeof artists !== "undefined"
) {

    const history =
        JSON.parse(
            localStorage.getItem(
                "playHistory"
            )
        ) || [];


    const artistCounts = {};


    history.forEach(
        songId => {

            const song =
                songs.find(
                    item =>
                        item.id ===
                        songId
                );


            if (
                !song
            ) {

                return;

            }


            artistCounts[
                song.artist
            ] =
                (
                    artistCounts[
                        song.artist
                    ] || 0
                ) + 1;

        }
    );


    const sortedArtists =
        Object.entries(
            artistCounts
        )
            .sort(
                (
                    [, a],
                    [, b]
                ) =>
                    b - a
            )
            .slice(
                0,
                5
            );


    profileTopArtists.innerHTML =
        "";


    sortedArtists.forEach(
        ([artistName, count]) => {

            const artist =
                artists.find(
                    item =>
                        item.name ===
                        artistName
                );


            if (
                !artist
            ) {

                return;

            }


            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "ranking-item";


            item.innerHTML = `

                <div
                    class="ranking-artist-image"
                >

                    ${
                        artist.image
                            ? `
                                <img
                                    src="${assetPath(
                                        artist.image
                                    )}"
                                    alt="${escapeHtml(
                                        artist.name
                                    )}"
                                >
                            `
                            : ""
                    }

                </div>


                <div
                    class="ranking-info"
                >

                    <h3>
                        ${escapeHtml(
                            artist.name
                        )}
                    </h3>

                    <p>
                        ${count}
                        afspilninger
                    </p>

                </div>

            `;


            profileTopArtists.appendChild(
                item
            );

        }
    );

}


/* =========================================================
   SIDSTE INITIALISERING
========================================================= */

updateFavoriteButtons();