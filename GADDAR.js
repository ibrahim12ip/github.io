let currentEpisode = 1;
let currentPart = 1;
const totalParts = 25;

const videoPlayer = document.getElementById('videoPlayer');
const videoSource = document.getElementById('videoSource');
const currentEpisodeDiv = document.getElementById('currentEpisode');

function updateVideoSource() {
    videoSource.src = `vidyolar/GADDAR${currentEpisode}-${currentPart}.mp4`;
    videoPlayer.load();
    currentEpisodeDiv.textContent = `Bölüm: ${currentEpisode} Parça: ${currentPart}`;

    // Konsol mesajı ekleyelim
    console.log(`Loading video: Bölüm: ${currentEpisode} Parça: ${currentPart}`);
}

// Video yüklendiğinde otomatik oynatmayı sağla
videoPlayer.addEventListener('loadeddata', () => {
    console.log('Video data loaded');
    videoPlayer.play().catch(error => console.log('Play error: ', error));
});

// Video oynatılabilir olduğunda otomatik oynatmayı sağla
videoPlayer.addEventListener('canplay', () => {
    console.log('Video can play');
    videoPlayer.play().catch(error => console.log('Play error: ', error));
});

videoPlayer.addEventListener('ended', () => {
    if (currentPart < totalParts) {
        currentPart++;
    } else {
        currentPart = 1;
        currentEpisode++;
    }
    updateVideoSource();
});

document.getElementById('nextButton').addEventListener('click', () => {
    if (currentPart < totalParts) {
        currentPart++;
    } else {
        currentPart = 1;
        currentEpisode++;
    }
    updateVideoSource();
});

document.getElementById('prevButton').addEventListener('click', () => {
    if (currentPart > 1) {
        currentPart--;
    } else if (currentEpisode > 1) {
        currentEpisode--;
        currentPart = totalParts;
    }
    updateVideoSource();
});

document.getElementById('homeButton').addEventListener('click', () => {
    window.location.href = 'index.html'; // Ana sayfa URL'inizi buraya koyun
});

updateVideoSource();
