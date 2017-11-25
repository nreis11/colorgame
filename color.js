var colors = ['Red','Blue','Green','Pink','Black','Yellow','Orange','Gray','Purple','Brown'];
var ctext = document.getElementById("ctext");
var colorInput = document.querySelector('[name="color"]');
var scoreElem = document.querySelector("#score");
var p = document.createElement('p');
p.innerHTML = 'Say "START" to replay';
var correctSound = document.querySelector("#correctSound");
var timerDisplay = document.querySelector("#timer");
var countdown;
var current;
var guessValue;
var answerValue;
var score;
var idx;

window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

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
  timer(seconds);
}

function timer(seconds) {
  // clear any existing timers
  clearInterval(countdown);

  const now = Date.now();
  const then = now + seconds * 1000;
  displayTimeLeft(seconds);

  countdown = setInterval(() => {
    const secondsLeft = Math.round((then - Date.now()) / 1000);
    // check if we should stop it!
    if(secondsLeft < 0) {
      clearInterval(countdown);
      gameOver();
      return;
    }
    // display it
    displayTimeLeft(secondsLeft);
  }, 1000);
}

function displayTimeLeft(seconds) {
  timerDisplay.innerHTML = `0:${seconds}`;
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
  // console.log(e.results);
  const transcript = Array.from(e.results)
    .map(result => result[0])
    .map(result => result.transcript).join('')
    .toLowerCase()

    console.log(transcript);

    if (transcript.includes("start")) {
      reset();
    }

    // Only compare if game hasn't started
    if (ctext.innerHTML != 'Say "START" to begin.') {
      compare(transcript)
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
  // Iterate to second to last index
  if (idx < colors.length - 1) {
    current = colors[idx];
    ctext.innerHTML = current;
    ctext.style.color = colors[idx + 1];
    idx++
  } else {
    gameOver();
  }
}

function gameOver() {
  ctext.style.color = 'black';
  ctext.innerHTML = "Game Over";
  ctext.appendChild(p);
}

function reset() {
  idx = 0;
  score = 0;
  scoreElem.innerHTML = `Score: ${score}`;
  shuffle(colors);
  startTimer();
  nextColor();
}

recognition.start();

recognition.addEventListener("result", parseResponse);
recognition.addEventListener("end", recognition.start);
ctext.addEventListener("click", reset);