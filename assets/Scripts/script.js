// Declarations
const startingCard = document.querySelector("#startingCard");
const questionCard = document.querySelector("#questionCard");

const timeDisplay = document.querySelector("#timeDisplay");

const startBtn = document.querySelector("#startBtn");
const questionDisplay = document.querySelector("#questionDisplay");

const buttonArr = [
  document.querySelector("#answerBtn1"),
  document.querySelector("#answerBtn2"),
  document.querySelector("#answerBtn3"),
  document.querySelector("#answerBtn4")
];

let index = 0;
let questionList = [];
let timer = {second: 600, intervalId: null};

// Functions
// Function to fetch questions array in questions.json
async function startQuiz() {
  const response = await fetch("./assets/Scripts/questions.json");
  questionList = await response.json();
    
  renderQuestion();
}
startQuiz();

function starTimer() {
  timeDisplay.innerHTML = `Time: ${timer.second}`;
  
  timer.intervalId = setInterval(() => {
    timer.second--;
    timeDisplay.innerHTML = `Time: ${timer.second}`;
  }, 1000);
}

function renderQuestion() {
  if (index < questionList.length) {
    questionDisplay.innerHTML = questionList[index].question;
    answerBtn1.innerHTML = questionList[index].ans1;
    answerBtn2.innerHTML = questionList[index].ans2;
    answerBtn3.innerHTML = questionList[index].ans3;
    answerBtn4.innerHTML = questionList[index].ans4;
  } else {
    
  }
}

function checkAnswer(answerStr) {
  if (answerStr !== questionList[index].correct) {
    timer.second -= 120;    
  }
  // show footer
  index++;
  renderQuestion();
}



startBtn.addEventListener("click",() =>{
  startingCard.classList.add("isNotDisplay");
  questionCard.classList.remove("isNotDisplay");
  starTimer();
} );

buttonArr.forEach((element,i) => {
  element.addEventListener("click", () => {
    checkAnswer(`ans${i+1}`);
  });
});
