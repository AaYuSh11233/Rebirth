const apiKey = "45210820-3f02812c4f876fa0edb4e05c3";

let page = 1;
let query = '';
let totalImagesLoaded = 0;
const imagesPerPage = 20;

const A = document.getElementById("a");
const B = document.getElementById("b");
const C = document.getElementById("c");
const D = document.getElementById("d");

const fetchImages = async () => {
    const url = `https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(query)}&image_type=photo&pretty=true&page=${page}&per_page=${imagesPerPage}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.hits;
}

const displayImages = (images) => {
    images.forEach((image) => {
        const img = document.createElement("img");
        img.src = image.largeImageURL;
        img.alt = image.tags;
        C.appendChild(img);
    });
}

const searchImages = async () => {
    page = 1;
    totalImagesLoaded = 0;
    query = A.value.trim();

    if (query === '') {
        V.style.display = 'block';
        intro.play();
        C.innerHTML = '';
        D.style.display = 'none';
        return;
    }

    V.style.display='none'

    C.innerHTML = "";
    const images = await fetchImages();
    displayImages(images);
    totalImagesLoaded += images.length;
    page++;
    checkLoadMoreButton();
}

const loadMoreImages = async () => {
    const images = await fetchImages();
    if (images.length === 0) return;
    displayImages(images);
    totalImagesLoaded += images.length;
    page++;
    checkLoadMoreButton();
}

const handleScroll = async () => {
    if (V.style.display !== 'none') {
        return;
    }

    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
        if (totalImagesLoaded < 1000) {
            await loadMoreImages();
        }
    }
}

const checkLoadMoreButton = () => {
    if (totalImagesLoaded >= 1000) {
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

const handleEnterKey = (event) => {
    if (event.key === 'Enter') {
        searchImages();
    }
}

document.addEventListener("DOMContentLoaded", function() {
    const header = document.querySelector('header');
    header.addEventListener('click', function(event) {
        if (event.button === 0) {
            event.preventDefault();
        }
    });
});

B.addEventListener("click", searchImages);

A.addEventListener("keydown", handleEnterKey);

D.addEventListener("click", async () => {
    await loadMoreImages();
});

D.style.display = 'none';
window.addEventListener('scroll', handleScroll);
