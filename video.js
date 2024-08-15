const menuButton = document.getElementById("menuButton");
const menu = document.getElementById("menu");

menuButton.addEventListener("click", () => {
    menu.style.display = (menu.style.display === "block") ? "none" : "block";
});

const apiKey = "AIzaSyAezAv9DqwP1cbbk0RjlNfh2eeUzye8zHY";

let pageToken = '';
let query = '';
const maxResults = 10;

const A = document.getElementById("a");
const B = document.getElementById("b");
const C = document.getElementById("c");
const D = document.getElementById("d");

const fetchVideos = async () => {
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${encodeURIComponent(query)}&key=${apiKey}&maxResults=${maxResults}&pageToken=${pageToken}`;
    const response = await fetch(url);
    const data = await response.json();
    pageToken = data.nextPageToken || '';
    return data.items;
}

const displayVideos = (videos) => {
    videos.forEach((video) => {
        const videoId = video.id.videoId;
        const videoTitle = video.snippet.title;
        const videoThumbnail = video.snippet.thumbnails.medium.url;

        const videoElement = document.createElement("div");
        videoElement.className = 'video-item';
        videoElement.innerHTML = `
            <a href="https://www.youtube.com/watch?v=${videoId}" target="_blank">
                <img src="${videoThumbnail}" alt="${videoTitle}">
                <p>${videoTitle}</p>
            </a>
        `;
        C.appendChild(videoElement);
    });
}

const searchVideos = async () => {
    pageToken = '';
    query = A.value.trim();

    if (query === '') {
        V.style.display = 'block';
        intro.play();
        C.innerHTML = '';
        D.style.display = 'none';
        return;
    }

    V.style.display = 'none';

    C.innerHTML = '';
    const videos = await fetchVideos();
    displayVideos(videos);
    checkLoadMoreButton();
}

const loadMoreVideos = async () => {
    const videos = await fetchVideos();
    if (videos.length === 0) return;
    displayVideos(videos);
    checkLoadMoreButton();
}

const handleScroll = async () => {
    if (V.style.display !== 'none') {
        return;
    }

    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
        await loadMoreVideos();
    }
}

const checkLoadMoreButton = () => {
    if (!pageToken) {
        D.style.display = 'none';
    } else {
        D.style.display = 'block';
    }
}

const logo = document.getElementById("J");

logo.addEventListener("contextmenu", function(event) {
    event.preventDefault();
});

const introVideo = document.getElementById("intro");

introVideo.addEventListener("contextmenu", function(event) {
    event.preventDefault();
});

const botn = document.getElementById("b");

botn.addEventListener("contextmenu", function(event) {
    event.preventDefault();
});

document.addEventListener('DOMContentLoaded', (event) => {
    const header = document.querySelector('header');
    header.addEventListener('contextmenu', (event) => {
        event.preventDefault();
    });
});

const handleEnterKey = (event) => {
    if (event.key === 'Enter') {
        searchVideos();
    }
}

B.addEventListener("click", searchVideos);

A.addEventListener("keydown", handleEnterKey);

D.addEventListener("click", async () => {
    await loadMoreVideos();
});

D.style.display = 'none';
window.addEventListener('scroll', handleScroll);