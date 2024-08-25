const audios = [];

function loadMusic(song, audioname, loop) {
    let musicplayer = new CPlayer();
    musicplayer.init(song);
    while(musicplayer.generate() < 1) {}
    let wave = musicplayer.createWave();
    audios[audioname] = document.createElement("audio");
    audios[audioname].src = URL.createObjectURL(new Blob([wave], {type: "audio/wav"}));
    audios[audioname].loop = loop;
}
function playAudio(audioname) {
    let audio = audios[audioname];
    if(audio) {
        audio.currentTime = 0;
        audio.play();
    }
}
function stopAudio(audioname) {
    let audio = audios[audioname];
    if(audio) {
        audio.pause();
        audio.currentTime = 0;
    }
}