// Declarations
const startingCard = document.querySelector("#startingCard");
const questionCard = document.querySelector("#questionCard");
const resultCard = document.querySelector("#resultCard");
const highScoresCard = document.querySelector("#highScoresCard");

const buttonArr = [
  document.querySelector("#answerBtn1"),
  document.querySelector("#answerBtn2"),
  document.querySelector("#answerBtn3"),
  document.querySelector("#answerBtn4")
];

const totalTime = 600;
let index = 0;
let questionList = [];
let timer = {second: totalTime, intervalId: null};

let scoresArr = JSON.parse(localStorage.getItem("scoresArr")) || [];

// Functions
// Function to fetch questions array in questions.json
async function startQuiz() {
  const response = await fetch("./assets/Scripts/questions.json");
  questionList = await response.json();
    
  renderQuestion();
}
startQuiz();

// Function to start the timer when start button was clicked
function starTimer() {
  // Display total time to the user
  timeDisplay.textContent = `Time: ${timer.second}`;
  
  // Count down every second (1000ms)
  timer.intervalId = setInterval(() => {
    timer.second--;
    timeDisplay.textContent = `Time: ${timer.second}`;
    
    // If time runs out, stop the quiz
    if (timer.second <= 0) {
      checkAnswer(null, true);
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(timer.intervalId);
  timeDisplay.style.color = "red";
}

// Render the current question on screen
function renderQuestion() {
  document.querySelector("#questionDisplay")
    .textContent = questionList[index].question;
  answerBtn1.textContent = questionList[index].ans1;
  answerBtn2.textContent = questionList[index].ans2;
  answerBtn3.textContent = questionList[index].ans3;
  answerBtn4.textContent = questionList[index].ans4;
}

function renderFooter(isBool) {
  document.querySelector("footer").classList.remove("isNotDisplay");
  document.querySelector("footer").textContent = isBool ? `Correct!` : `Wrong!`;
  
  setTimeout(() => {
    document.querySelector("footer").classList.add("isNotDisplay")
  }, 2000);
}

// Check user answer and render the next question or show result
function checkAnswer(answerStr, isTime = false) {
  // Subtract time if answer wrong and time didn't runs out
  if ((answerStr !== questionList[index].correct) && !isTime) {
    timer.second -= (1 / questionList.length) * totalTime;
    document.querySelector("#timeDisplay")
      .textContent = `Time: ${timer.second}`;
    renderFooter(false);
  } else {
    renderFooter(true);
  }

  // show footer
  if (++index < questionList.length && !isTime) {
    renderQuestion();
  } else {
    // Stop the timer
    stopTimer();
    // Go to the result card
    questionCard.classList.add("isNotDisplay");
    resultCard.classList.remove("isNotDisplay");
    // Show the current score
    document.querySelector("#finalScore")
      .textContent = `Your final score is ${timer.second}.`;
  }
}

// Display the score on the highscore card
function renderScores() {
  // clear old scores
  document.querySelector("#highScoreDisplay").innerHTML = "";
  // render new scores
  if (scoresArr.length != 0) {
    scoresArr.forEach((element, i)=> {
      document.querySelector("#highScoreDisplay").innerHTML += 
        `<li>${i + 1}. ${element.initial}   score: ${element.score}</li>`;
    });
  }  
}

// Event listeners
// Start button
document.querySelector("#startBtn").addEventListener("click",() =>{
  startingCard.classList.add("isNotDisplay");
  questionCard.classList.remove("isNotDisplay");
  starTimer();
});

// 4 answer buttons
buttonArr.forEach((element,i) => {
  element.addEventListener("click", () => {
    checkAnswer(`ans${i+1}`);
  });
});

// Submit button
document.querySelector("#submitBtn").addEventListener("click", () => {
  // Get the initial and score for current user
  let scoreObj = {
    initial: document.querySelector("#initialTxt").value.toUpperCase(),
    score: timer.second
  }

  // add current score to the array of scores and sort
  scoresArr.push(scoreObj);     
  scoresArr.sort((a, b) => b.score - a.score);

  // Save the score array to local storage
  localStorage.setItem("scoresArr", JSON.stringify(scoresArr));

  // show the highscore card
  resultCard.classList.add("isNotDisplay");
  highScoresCard.classList.remove("isNotDisplay");

  renderScores();
});

// high score button
document.querySelector("#highScoreBtn").addEventListener("click", () => {
  // Hide other card and show only the highscore card
  startingCard.classList.contains("isNotDisplay") || startingCard.classList.add("isNotDisplay")
  resultCard.classList.contains("isNotDisplay") || resultCard.classList.add("isNotDisplay")
  questionCard.classList.contains("isNotDisplay") || questionCard.classList.add("isNotDisplay")
  highScoresCard.classList.remove("isNotDisplay");
  // 
  stopTimer();
  renderScores();
});

// Clear score button
document.querySelector("#clearBtn").addEventListener("click", () => {
  localStorage.clear();
  scoresArr = [];
  renderScores();
});

// restart(go back) button
document.querySelector("#restartBtn").addEventListener("click", () => {
  // Hide other card and show only the starting card
  resultCard.classList.contains("isNotDisplay") || resultCard.classList.add("isNotDisplay");
  questionCard.classList.contains("isNotDisplay") || questionCard.classList.add("isNotDisplay");
  highScoresCard.classList.contains("isNotDisplay") || highScoresCard.classList.add("isNotDisplay");
  !startingCard.classList.contains("isNotDisplay") || startingCard.classList.remove("isNotDisplay");

  // reset variables to default and stop timer
  index = 0;
  stopTimer();
  timeDisplay.style.color = "";
  timer.second = totalTime;
  timeDisplay.textContent = `Time: 0`;
});