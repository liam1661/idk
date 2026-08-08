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