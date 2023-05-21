const pointsValue = document.getElementById("points")
const timeValue = document.getElementById("time-remaining");
const startButton = document.getElementById("start");
const tableButton = document.getElementById("table");
const gameContainer = document.querySelector(".game-screen");
const result = document.getElementById("result");
const controls = document.querySelector(".results-container");
const userForm = document.querySelector(".box")
const resultsTable= document.querySelector(".table")
resultsTable.classList.add("hide");
let cards;
let interval;
let firstCard = false;
let secondCard = false;


// Array con las imagenes
const cardValues = [ { name: "biblioteca", image: "bibliotecaCard.jpg" },
{ name: "cuadro2", image: "Cuadro2Card.jpg" },
{ name: "cuadro4", image: "Cuadro4Card.jpg" },
{ name: "cultura", image: "culturaCard.jpg" },
{ name: "eugenioMendoza", image: "EugenioMendozaCard.jpg" },
{ name: "logo", image: "logoCard.jpg" },
{ name: "retrato1", image: "Retrato1Card.jpg" },
{ name: "saman", image: "SamanCard.jpg" }
];


//Formulario de nombre de usuario;
const save = () => {
    const username = (document.getElementById("username")).stringifyS;
    userForm.classList.add("hide");
    localStorage.setItem('user' , username);

}

//Tiempo maximo inicial
let seconds = 0
let spentSeconds = 0
let minutes = 3;
let points = 0;
let maxPoints = 100;
let maxTime = 180;
let usedTime = 180 - seconds
let n = 1;


//Temporizador y puntaje
const timer = () => {
    //restar minutos
    if (seconds == 0){
        minutes = minutes - 1;
        seconds = 60;
    }  
    seconds -= 1; 
    spentSeconds += 1
    pointsTotal = Math.floor(maxPoints*((180-spentSeconds)/180))
    
    //Mostrar tiempo y el puntaje al usuario
    let secondsValue = seconds < 10 ? `0${seconds}` : seconds;
    let minutesValue = minutes < 10 ? `0${minutes}` : minutes;
    timeValue.innerHTML = `<span>Tiempo restante: ${minutesValue}:${secondsValue}</span>`;
    pointsValue.innerHTML = `<span>Puntos: ${pointsTotal}</span>`;

    if (spentSeconds == 180){
        result.innerHTML = "<h2>Perdiste...</h2>";
        
            stopGame();
    }
};




const matrixGenerator = (cardValues, size = 4) => {
    gameContainer.innerHTML = "";
    cardValues = [...cardValues, ...cardValues];
    //mezclar tarjetas
    cardValues.sort(() => Math.random() - 0.5);
    for (let i = 0; i < size * size; i++) {
      /*
          Create Cards
          before => oculta (muestra un signo de interrogacion: ?)
          after => descubierta (revela la imagen);
          data-card-values is a custom attribute which stores the names of the cards to match later
        */
    
      //Se agrega un contenedor al HTML por cada carta:
      gameContainer.innerHTML += `
       <div class="card-container" data-card-value="${cardValues[i].name}">
          <div class="card-before">?</div>
          <div class="card-after">
          <img src="${cardValues[i].image}" class="image"/></div>
       </div>
       `;
    }
    //Grid
    gameContainer.style.gridTemplateColumns = `repeat(${size},auto)`;

    //Dinamica de juego:

    cards = document.querySelectorAll(".card-container");
    cards.forEach((card) => {
      card.addEventListener("click", () => {
        //Si aun no se ha encontrado la pareja de la carta:
        if (!card.classList.contains("matched")) {
          //Entonces se puede voltear, agregando el atributo flipped se mostrara la imagen de la tarjeta:
          card.classList.add("flipped");
          //Previamente a firstcard se le asigno el valor false, entonces el primer  caso (primera carta volteada) es !firstcard:
          if (!firstCard) {
            //la tarjeta elegida es la primera tarjeta en voltearse
            firstCard = card;
            //El valor de la primera tarjeta toma el string su nombre:
            firstCardValue = card.getAttribute("data-card-value");
          } else {
            //La tarjeta elegida es la segunda en voltearse
            secondCard = card;
            //Se le asigna el nombre de la carta como su valor
            let secondCardValue = card.getAttribute("data-card-value");

            //Ahora se compara los valores (nombres) de las cartas para verificar que sean iguales:
            if (firstCardValue == secondCardValue) {
              //Si son iguales se marcan como "matched" para que no se puedan volver a seleccionar
              firstCard.classList.add("matched");
              secondCard.classList.add("matched");
              //Como ya no se estan seleccionando cartas ahora firstcard es falso y se puede jugr el siguiente turno:
              firstCard = false;
               //Se suma +1 al contador se parejas encontradas
            matchedPairs += 1;
            //check if winCount ==half of cardValues
            if (matchedPairs == Math.floor(cardValues.length / 2)) {
              result.innerHTML = `<h2>¡Ganaste!</h2>
              <h3>Puntaje Total: ${pointsTotal}</h3> <br>
              `;
              stopGame();
                
                localStorage.setItem('score', pointsTotal);
                let username = localStorage.getItem('user');
                let points = localStorage.getItem('score');
                let user = {name : username,
                score : points }
                let users = localStorage.getItem('users') ?
                JSON.parse(localStorage.getItem('users')) : [];
                users.push(user);
                localStorage.setItem('users', JSON.stringify(users));
                tablePosition(JSON.parse(localStorage.getItem('users')))



            }
          } else {
            //Si las tarjetas no son iguales:
        
            let [tempFirst, tempSecond] = [firstCard, secondCard];
            firstCard = false;
            secondCard = false;
            let delay = setTimeout(() => {
              tempFirst.classList.remove("flipped");
              tempSecond.classList.remove("flipped");
            }, 900);
          }
        }
      }
    });
  });

};

//Initialize values and func calls
const initializer = () => {
    result.innerText = "";
    matchedPairs = 0;
    console.log(cardValues);
    matrixGenerator(cardValues);
};

//Iniciar juego: 
startButton.addEventListener("click", () => {
    pointsTotal= 0;
    spentSeconds = 0;
    seconds = 0;
    minutes = 3;
    interval = setInterval(timer, 1000);
    initializer();
    //Se ocultan los botones de incio
    controls.classList.add("hide");
    startButton.classList.add("hide");
    resultsTable.classList.add("hide");
    //La funcion del temporizador se ejecuta con setInterval, colocando 1000 ms para que se ejecute cada segundo.
    
    
  });

//Terminar juego:

stopGame = () => {
    controls.classList.remove("hide");
    startButton.classList.remove("hide");
    resultsTable.classList.add("hide");
    clearInterval(interval);
  }

//Generar puesto en tabla:
tablePosition = (dicarray) => {
    for (let i = 0; i < dicarray.length; i++) {
    
    resultsTable.innerHTML = `<tr class="data">
    <td>${dicarray[i]['name']}</td>
    <td>${dicarray[i]['score']}</td>
  </tr>`
  };
}

tableButton.addEventListener("click", () => {
    resultsTable.classList.remove("hide");

})




