var colors = [
  "Red",
  "Blue",
  "Green",
  "Pink",
  "Black",
  "Yellow",
  "Orange",
  "Gray",
  "Purple",
  "Brown"
];
var ctext = document.getElementById("ctext");
var ctextContainer = document.getElementById("ctext");
var scoreElem = document.querySelector("#score");
var correctSound = document.querySelector("#correctSound");
var buzzer = document.querySelector("#buzzer");
var timer = document.querySelector("#timer");
var startButton = document.getElementById("start-btn");
var isRunning = false;
var countdown;
var guessValue;
var answerValue;
var current;
var score;
var idx;

window.SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();
// Live visual feedback to show what you are speaking
// recognition.interimResults = true;

// Shuffle colors
// Pop color and choose text color
// Wait for input
// If input == text color, add to score
// Move to next color
// When color array is empty, game over

function startTimer() {
  const seconds = 25;
  setTimer(seconds);
}

function setTimer(seconds) {
  // clear any existing timers
  clearInterval(countdown);

  const now = Date.now();
  const then = now + seconds * 1000;
  displayTimeLeft(seconds);

  countdown = setInterval(() => {
    const secondsLeft = Math.round((then - Date.now()) / 1000);
    displayTimeLeft(secondsLeft);
    if (secondsLeft <= 0) {
      gameOver();
    }
  }, 1000);
}

function displayTimeLeft(seconds) {
  timer.innerHTML = seconds.toString();
}

function shuffle(a) {
  var j, x, i;
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
}

function parseResponse(e) {
  const transcript = Array.from(e.results)
    .map(result => result[0])
    .map(result => result.transcript)
    .join("")
    .toLowerCase();

  console.log(transcript);

  if (transcript.includes("start")) {
    reset();
  } else if (isRunning) {
    compare(transcript);
  }
}

function compare(guessValue) {
  answerValue = ctext.style.color;
  if (guessValue.toLowerCase() === answerValue.toLowerCase()) {
    correctSound.play();
    score++;
    scoreElem.innerHTML = `Score: ${score}`;
  }
  nextColor();
}

function nextColor() {
  // Iterate until second to last index
  if (idx < colors.length - 1) {
    current = colors[idx];
    ctext.innerHTML = current;
    ctext.style.color = colors[idx + 1];
    idx++;
  } else {
    gameOver();
  }
}

function gameOver() {
  clearInterval(countdown);
  buzzer.play();
  timer.innerHTML = "Game Over";
  ctext.style.color = "black";
  ctext.innerHTML = "";
  ctextContainer.appendChild(startButton);
  isRunning = false;
}

function reset() {
  idx = 0;
  score = 0;
  scoreElem.innerHTML = `Score: ${score}`;
  isRunning = true;
  shuffle(colors);
  startTimer();
  nextColor();
}

function handleKeydown(e) {
  if (e.keyCode === 32) {
    startButton.click();
  }
}

recognition.start();

recognition.addEventListener("result", parseResponse);
recognition.addEventListener("end", recognition.start);
window.addEventListener("keydown", handleKeydown);
startButton.addEventListener("click", reset);
