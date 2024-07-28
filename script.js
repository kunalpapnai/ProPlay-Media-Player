/************Video Element Creation***********/ 
const videoBtn = document.querySelector("#videoBtn");
const videoInput = document.querySelector("#videoInput");
const videoPlayer = document.querySelector("#main");
const totalTimeElem = document.querySelector("#totalTime");
const currentTimeElem = document.querySelector("#currentTime");
const slider = document.querySelector("#slider");

let video;
let duration;
let timerObj;
let currentPlayTime = 0;
let isPlaying = false;

const handleInput = () =>{
    videoInput.click();
}

const acceptInputHandler = (obj) =>{
    let selectedVideo;
    //console.log(obj);

    /*****drag and drop*******/ 
    if(obj.type == "drop"){
        selectedVideo = obj.dataTransfer.files[0];
    } else{
        selectedVideo = obj.target.files[0];
    }

    // src -> base64
    const link = URL.createObjectURL(selectedVideo);

    const videoElement = document.createElement("video");
    videoElement.src = link;
    //console.log(videoElement);

    videoElement.setAttribute("class", "video");

    //check if there is any video already present
    if(videoPlayer.children.length > 0){
        
        //if present -> remove it
        videoPlayer.removeChild(videoPlayer.children[0]);
    }

    // now after the above check -> add videoElement
    videoPlayer.appendChild(videoElement);
    video = videoElement;
    isPlaying = true;
    setPlayPause();
    videoElement.play();
    videoElement.volume = 0.3;

    videoElement.addEventListener("loadedmetadata", function (){
        // it gives time in seconds(decimal value) -> convert it into seconds(whole number)
        duration = Math.round(videoElement.duration);
        //convert seconds into hrs:mins:secs
        let time = timeFormat(duration);
        totalTimeElem.innerText = time;
        slider.setAttribute("max", duration);
        startTimer();
    })
}

videoBtn.addEventListener("click", handleInput);
videoInput.addEventListener("change", acceptInputHandler);

/**********Volume and Playback Speed**********/ 
const speedUp = document.querySelector("#speedUp");
const speedDown = document.querySelector("#speedDown");
const volumeUp = document.querySelector("#volumeUp");
const volumeDown = document.querySelector("#volumeDown");
const toast = document.querySelector(".toast");

const speedUpHandler = () => {
    const videoElement = document.querySelector("video");
    if(videoElement == null){
        return;
    }

    if(videoElement.playbackRate > 3){
        return;
    }

    const increasedSpeed = videoElement.playbackRate + 0.5;
    videoElement.playbackRate = increasedSpeed;

    showToast(increasedSpeed + "X");
}

const speedDownHandler = () => {
    const videoElement = document.querySelector("video");
    if(videoElement == null){
        return;
    }

    if(videoElement.playbackRate > 0){
        const decreasedSpeed = videoElement.playbackRate - 0.5;
        videoElement.playbackRate = decreasedSpeed;

        showToast(decreasedSpeed + "X");
    }
}

const volumeUpHandler = () => {
    const videoElement = document.querySelector("video");
    if(videoElement == null){
        return;
    }

    if(videoElement.volume >= 0.99){
        return;
    }

    const increasedVolume = videoElement.volume + 0.1;
    videoElement.volume = increasedVolume;

    const percentage = (increasedVolume * 100) + "%";
    showToast(percentage);
}

const volumeDownHandler = () => {
    const videoElement = document.querySelector("video");
    if(videoElement == null){
        return;
    }

    if(videoElement.volume <= 0.1){
        videoElement.volume = 0;
        return;
    }

    const decreasedVolume = videoElement.volume - 0.1;
    videoElement.volume = decreasedVolume;

    const percentage = (decreasedVolume * 100) + "%";
    showToast(percentage);
}

/*********Toast**********/ 
function showToast(message){

    toast.textContent = message;
    toast.style.display = "block";
    setTimeout(() => {
        toast.style.display = "none"
    }, 1000);
}

speedUp.addEventListener("click", speedUpHandler);
speedDown.addEventListener("click", speedDownHandler);
volumeUp.addEventListener("click", volumeUpHandler);
volumeDown.addEventListener("click", volumeDownHandler);

/****************Controls******************/
const handleFullScreen = () => {
    videoPlayer.requestFullscreen();
}

const fullScreenElem = document.querySelector("#fullscreen");
fullScreenElem.addEventListener("click", handleFullScreen);

// adding seek seek behaviour in slider
slider.addEventListener("change", function(e){
    let value = e.target.value;
    video.currentTime = value;
})

/***************forward and backward button***************/
function forward(){
    currentPlayTime = Math.round(video.currentTime) + 5;
    video.currentTime = currentPlayTime;
    slider.setAttribute("value", currentPlayTime);
    showToast("Forward by 5 sec");
    let time = timeFormat(currentPlayTime);
    currentTimeElem.innerText = time;
}

function backward(){
    currentPlayTime = Math.round(video.currentTime) - 5;
    video.currentTime = currentPlayTime;
    slider.setAttribute("value", currentPlayTime);
    showToast("Backward by 5 sec");
    let time = timeFormat(currentPlayTime);
    currentTimeElem.innerText = time;
}

const forwardBtn = document.querySelector("#forwardBtn");
const backwardBtn = document.querySelector("#backwardBtn");
forwardBtn.addEventListener("click", forward);
backwardBtn.addEventListener("click", backward);

/**************play and pause*************************/
const playPauseContainer = document.querySelector("#playPause");
function setPlayPause(){
    if(isPlaying === true){
        playPauseContainer.innerHTML = `<i class="fas fa-pause state"></i>`;
        video.play();
    } else{
        playPauseContainer.innerHTML = `<i class="fas fa-play state"></i>`;
        video.pause();
    }
}

playPauseContainer.addEventListener("click", function () {
    if (video) {
        isPlaying = !isPlaying;
        setPlayPause();
    }
})

/********stop btn**********/
const stopBtn  = document.querySelector("#stopBtn");
const stopHandler = () => {
    if(video){
        //remove video from ui
        video.remove();

        //reset all variables
        isPlaying = false;
        currentPlayTime = 0;
        slider.value = 0;
        video = "";
        duration = "";
        totalTimeElem.innerText = '--/--';
        currentTimeElem.innerText = '00:00';
        slider.setAttribute("value", 0);
        stopTimer();
        setPlayPause();
    }
}

stopBtn.addEventListener("click", stopHandler);

/*************utility function to convert secs into hrs:mins:secs*****************/
function timeFormat(timeCount){
    let time = "";
    const sec = parseInt(timeCount, 10);
    let hours = Math.floor(sec/3600);
    let minutes = Math.floor((sec - (hours * 3600)) / 60);
    let seconds = sec - (hours * 3600) - (minutes * 60);
    if (hours < 10)
        hours = "0" + hours;
    if (minutes < 10)
        minutes = "0" + minutes;
    if (seconds < 10)
        seconds = "0" + seconds
    time = `${hours}:${minutes}:${seconds}`;
    return time;
}

//function that runs the slider and timer
function startTimer(){
    timerObj = setInterval(function(){
        currentPlayTime = Math.round(video.currentTime);
        slider.value = currentPlayTime;
        const time = timeFormat(currentPlayTime);
        currentTimeElem.innerText = time;
        if(currentPlayTime == duration){
            stopTimer();
            setPlayPause();
            video.remove();
            slider.value = 0;
            currentTimeElem.innerText = "00:00:00";
            totalTimeElem.innerText = "--/--/--";
        }
    }, 1000);
}

function stopTimer(){
    clearInterval(timerObj);
}

/******************enable drag and drop******************/
//prevent default behaviour for dragenter and dragleave events
videoPlayer.addEventListener("dragenter", (e) => {
    e.preventDefault();
})

videoPlayer.addEventListener("dragover", (e) => {
    e.preventDefault();
})

videoPlayer.addEventListener("dragleave", (e) => {
    e.preventDefault();
})

videoPlayer.addEventListener("drop", (e) => {
    e.preventDefault();
    acceptInputHandler(e);
})

/*************keyboard support*****************/
const body = document.querySelector("body");
body.addEventListener("keyup", (e) =>{

    console.log(e.key);
    if(!video){
        return;
    }
    if(e.code == "Space"){
        isPlaying = !isPlaying;
        setPlayPause();
    }
    else if(e.key == "ArrowUp"){
        speedUpHandler();
    }
    else if(e.key == "ArrowDown"){
        speedDownHandler();
    }
    else if(e.key == "ArrowRight"){
        forward();
    }
    else if(e.key == "ArrowLeft"){
        backward();
    }
    else if(e.key == "AudioVolumeUp"){
        volumeUpHandler();
    }
    else if(e.key == "AudioVolumeDown"){
        volumeDownHandler();
    }
    else if(e.key == "f"){
        handleFullScreen();
    }
})