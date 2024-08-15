const audioElement = document.getElementById('backgroundMusic');
const songs = [
    //'ajeeb.mpeg',
    //'blackmail.mpeg',
    //'dil.mpeg',
    //'kuch.mpeg',
    'perfect.mpeg',
    'photo.mpeg',
    //'pal do pal.mpeg',
    //'tum hi ho.mpeg',
    //'lag ja gale.mpeg',
    //'khamosiyaan.mpeg',
    'song1.mp3',
];

let currentSongIndex = -1;
let previousSongIndex = -1;
let isPlaying = false;
let lastRightClickTime = 0;

function loadAudioState() {
    const savedSong = sessionStorage.getItem('currentSong');
    const savedIsPlaying = sessionStorage.getItem('isPlaying') === 'true';

    if (savedSong) {
        audioElement.src = savedSong;
        isPlaying = savedIsPlaying;
        if (isPlaying) {
            audioElement.play();
        }
    }
}

function saveAudioState() {
    sessionStorage.setItem('currentSong', audioElement.src);
    sessionStorage.setItem('isPlaying', isPlaying.toString());
}

function playNextSong() {
    const shuffledSongs = songs.sort(() => Math.random() - 0.5);
    const randomSongIndex = Math.floor(Math.random() * shuffledSongs.length);
    
    audioElement.src = shuffledSongs[randomSongIndex];
    previousSongIndex = currentSongIndex;
    currentSongIndex = randomSongIndex;
    audioElement.play();
    isPlaying = true;
    saveAudioState();
}

function playPreviousSong() {
    if (previousSongIndex !== -1) {
        audioElement.src = songs[previousSongIndex];
        audioElement.play();
        isPlaying = true;
        saveAudioState();
    }
}

function toggleMusic() {
    if (isPlaying) {
        audioElement.pause();
        isPlaying = false;
    } else {
        if (audioElement.src === '') {
            playNextSong();
        } else {
            audioElement.play();
            isPlaying = true;
        }
    }
    saveAudioState();
}

function handleRightClick(event) {
    event.preventDefault();
    
    const now = Date.now();
    if (now - lastRightClickTime < 300) {
        playPreviousSong();
    } else {
        playNextSong();
    }
    lastRightClickTime = now;
}

document.addEventListener('DOMContentLoaded', () => {
    loadAudioState();

    const playMusicButton = document.getElementById('playMusic');
    if (playMusicButton) {
        playMusicButton.addEventListener('click', toggleMusic);
        playMusicButton.addEventListener('contextmenu', handleRightClick);
    }

    audioElement.addEventListener('ended', playNextSong);
});