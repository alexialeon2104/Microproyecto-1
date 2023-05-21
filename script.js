const pointsValue = document.getElementById("points")
const timeValue = document.getElementById("time-remainig");
const startButton = document.getElementById("start");
const gameContainer = document.querySelector(".game-sceen");
const result = document.getElementById("result");
const controls = document.querySelector(".results-container");
let cards;
let interval;
let firstCard = false;
let secondCard = false;

// Array con las imagenes
const images = []

//Tiempo inicial
let seconds = 0, 
minutes = 3;

//Temporizador
const timer = () => {
    seconds -= 1;
    //restar minutos
    if (seconds==0){
        minutes -=1;
        seconds = 59;
    }   
}

//Mostrar tiempo al usuario
let secondsValue = seconds < 10 ? `0${seconds}` : seconds;
let minutesValue = minutes < 10 ? `0${minutes}` : minutes;
timeValue.innerHTML = `<span>Tiempo restante:</span>${minutesValue}:${secondsValue}`;

//