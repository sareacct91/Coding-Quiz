const startingCard = document.querySelector("#startingCard");
const questionCard = document.querySelector("#questionCard");

const timeDisplay = document.querySelector("#timeDisplay");

const startBtn = document.querySelector("#startBtn");
const questionDisplay = document.querySelector("#questionDisplay");
const answerBtn1 = document.querySelector("#answerBtn1");
const answerBtn2 = document.querySelector("#answerBtn2");
const answerBtn3 = document.querySelector("#answerBtn3");
const answerBtn4 = document.querySelector("#answerBtn4");

let timer = {second: 600, intervalId: null};

function starTimer() {
  timeDisplay.innerHTML = `Time: ${timer.second}`;
  
  timer.intervalId = setInterval(() => {
    timer.second--;
    timeDisplay.innerHTML = `Time: ${timer.second}`;
  }, 1000);
}


function renderQuestion(questionPar) {
  questionDisplay.innerHTML = questionPar.question;
  answerBtn1.innerHTML = questionPar.ans1;
  answerBtn2.innerHTML = questionPar.ans2;
  answerBtn3.innerHTML = questionPar.ans3;
  answerBtn4.innerHTML = questionPar.ans4;
}

async function startQuiz() {
  let currentQ;

  const response = await fetch("questions.json");
  let questionList = await response.json();
  
  starTimer();
  for (let i = 0; i < questionList.length; i++) { 
    currentQ = questionList[i];
    
    renderQuestion(currentQ);
  }
  
  
}

startBtn.addEventListener("click",() =>{
  startQuiz();
  startingCard.classList.add("isNotDisplay");
  questionCard.classList.remove("isNotDisplay");
} );