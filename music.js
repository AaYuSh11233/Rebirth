document.addEventListener('DOMContentLoaded', () => {
    const audioElement = document.getElementById('backgroundMusic');

    const songs = [
        'song1.mp3',
        //'song2.mp3',
        //'song3.mp3'
    ];

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    shuffle(songs);
    let currentIndex = 0;

    function playNextSong() {
        audioElement.src = songs[currentIndex];
        audioElement.play();
        currentIndex = (currentIndex + 1) % songs.length;
    }

    function startMusic() {
        audioElement.loop = true;
        playNextSong();
        audioElement.addEventListener('ended', playNextSong);
    }

    function stopMusic() {
        audioElement.pause();
        audioElement.currentTime = 0;
    }

    const searchInput = document.getElementById('a');
    searchInput.addEventListener('input', () => {
        if (searchInput.value.trim() === '') {
            startMusic();
        } else {
            stopMusic();
        }
    });

    if (searchInput.value.trim() === '') {
        startMusic();
    }
});
