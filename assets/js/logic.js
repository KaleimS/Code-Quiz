var questionsEl = document.querySelector("#questions");
var timerEl = document.querySelector("#time");
var choicesEl = document.querySelector("#choices");
var startBt = document.querySelector("#start");
var submitBt = document.querySelector("#submit");
var initialsEl = document.querySelector("#initials");
var feedbackEl = document.querySelector("#feedback");

var currentQuestionIndex = 0;
var time = questions.length * 15;
var timerId;

function startQuiz() {
  // This finds the id = start-screen from the index.html
  var startScreenEl = document.getElementById("start-screen");

  // This hides the start screen
  startScreenEl.setAttribute("class", "hide");
  // This will remove the class="hide" from the questions div
  questionsEl.removeAttribute("class");
  // This is the timer and will start when this function starts
  timerId = setInterval(clockTick, 1000);
  // This will show the starting time amount
  timerEl.textContent = time;

  getQuestion();
}

function getQuestion() {
  // This gets the current question object from questions.js
  var currentQuestion = questions[currentQuestionIndex];
  //This will update title with current question
  var titleEl = document.getElementById("question-title");
  titleEl.textContent = currentQuestion.title;
  //This will remove any questions that have already been asked
  choicesEl.innerHTML = "";

  // This will loop through all the choices
  currentQuestion.choices.forEach(function (choice, i) {
    //This creates a new button for each choice in the questions.js
    var choiceNode = document.createElement("button");
    choiceNode.setAttribute("class", "choice");
    choiceNode.setAttribute("value", choice);

    choiceNode.textContent = i + 1 + ". " + choice;

    choiceNode.onclick = questionClick;
    //This displays on the page
    choicesEl.appendChild(choiceNode);
  });
}

function questionClick() {
  //This will check if the user got the question incorrect
  if (this.value !== questions[currentQuestionIndex].answer) {
    // Takes awake 15 seconds
    time -= 15;

    if (time < 0) {
      time = 0;
    }
    // This diplays new time after time deduction
    timerEl.textContent = time;
    feedbackEl.textContent = "Wrong!";
    feedbackEl.style.fontSize = "200%";
  } else {
    feedbackEl.textContent = "Correct!";
    feedbackEl.style.fontSize = "200%";
  }

  feedbackEl.setAttribute("class", "feedback");
  setTimeout(function () {
    feedbackEl.setAttribute("class", "feedback hide");
  }, 1000);

  // This moves to the next question
  currentQuestionIndex++;
  // This will check the time left in the game and stop the quiz if requirements not met
  if (currentQuestionIndex === questions.length) {
    quizEnd();
  } else {
    getQuestion();
  }
}

function quizEnd() {
  // This stops the timer
  clearInterval(timerId);
  // This removes the hide class from the end screen so it can be shown on quizEnd
  var endScreenEl = document.getElementById("end-screen");
  endScreenEl.removeAttribute("class");
  // This will show your final score
  var finalScoreEl = document.getElementById("final-score");
  finalScoreEl.textContent = time;

  // This will rehide the questions after the quiz ends
  questionsEl.setAttribute("class", "hide");
}

function clockTick() {
  time--;
  timerEl.textContent = time;

  // This checks if user has ran out of time
  if (time <= 0) {
    quizEnd();
  }
}

function saveHighscore() {
  var initials = initialsEl.value.trim();

  if (initials !== "") {
    // This finds the scores from the local storage
    var highscores =
      JSON.parse(window.localStorage.getItem("highscores")) || [];

    // This shows the newest score
    var newScore = {
      score: time,
      initials: initials,
    };

    // This saves the highscores to local storage
    highscores.push(newScore);
    window.localStorage.setItem("highscores", JSON.stringify(highscores));

    // This will take you to the highscores page
    window.location.href = "highscores.html";
  }
}

function checkForEnter(event) {
  if (event.key === "Enter") {
    saveHighscore();
  }
}

submitBt.onclick = saveHighscore;

startBt.onclick = startQuiz;

initialsEl.onkeyup = checkForEnter;
