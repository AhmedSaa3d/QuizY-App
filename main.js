//set Global variables
let mainTimeExam = 90;
let currentQuesitionIndex = 0;
let rightAnswers = 0;
let countdownInterval;
let htmlBulletSelf;
let htmlSubmitButton = document.querySelector(".quiz-app .submit-button");
let htmlQuizApp = document.querySelector(".quiz-app");
let htmlAgainBtn = document.querySelector(".quiz-app .btn-again");

let testAgain = document.querySelector(".quiz-app .btn-again");
testAgain.addEventListener("click", () => {
  window.location.reload();
});

let exams = document.getElementsByClassName("exam");
for (let i = 0; i < exams.length; i++) {
  exams[i].addEventListener("click", function () {
    startInt();
    console.log(this.dataset.path);
    // if(this.dataset)
    runQuizApp(this.dataset.path);
  });
}

function startInt() {
  let htmlHiddenItems = document.querySelectorAll(".quiz-app .dis-none");
  for (let i = 0; i < htmlHiddenItems.length; i++) {
    htmlHiddenItems[i].classList.remove("dis-none");
  }
  let htmlExamDiv = document.getElementsByClassName("exams")[0];
  let htmlSelectExam = document.querySelector(".quiz-app .select");
  htmlSelectExam.classList.add("dis-none");
  htmlExamDiv.classList.add("dis-none");
}

/*later
    make this function take file name to open if he want to choose from other exams
    you make many buttons for the exams and when choose one exam load this exam
*/
function runQuizApp(fileName) {
  let myRequset = new XMLHttpRequest();
  myRequset.open("GET", `./questionsFiles/${fileName}.json`, true);
  myRequset.send();
  myRequset.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let questionObj = JSON.parse(this.responseText);
      let shuffeledObj = shuffle(questionObj);
      let questionCount = 7; // futur work can be get from user easy,medium,hard
      editQuestionCategory(fileName);
      editQuestionCount(questionCount);
      createBulletsSpan(questionCount);

      addQuestionData(shuffeledObj[currentQuesitionIndex]);
      countdown(mainTimeExam);

      // click on submit Button
      htmlSubmitButton.onclick = () => {
        if (currentQuesitionIndex < questionCount - 1) {
          checkAnswer(shuffeledObj[currentQuesitionIndex].right_answer);
          addQuestionData(shuffeledObj[++currentQuesitionIndex]);
          clearInterval(countdownInterval);
          countdown(mainTimeExam);
        } else {
          clearInterval(countdownInterval);
          checkAnswer(shuffeledObj[currentQuesitionIndex].right_answer);
          showResults(questionCount);
        }
      };
    }
  };
}

function editQuestionCategory(fileName) {
  let htmlQuestionsCategory = document.querySelector(
    ".quiz-info .category span"
  );
  htmlQuestionsCategory.innerHTML = fileName.split("-")[0];
}

function editQuestionCount(num) {
  let htmlQuestionsCount = document.querySelector(".quiz-info .count span");
  htmlQuestionsCount.innerHTML = num;
}

function createBulletsSpan(num) {
  let htmlBulletsSpans = document.querySelector(".bullets .spans");
  htmlBulletsSpans.style.display = "flex";
  for (let i = 0; i < num; i++) {
    let theBullet = document.createElement("span");
    htmlBulletsSpans.appendChild(theBullet);
  }
  htmlBulletSelf = document.querySelectorAll(".bullets .spans span");
}

function addQuestionData(obj) {
  let htmlTitleArea = document.querySelector(".quiz-app .title-area");
  let htmlAnswersArea = document.querySelector(".quiz-app .answers-area");
  htmlTitleArea.innerHTML = "";
  htmlAnswersArea.innerHTML = "";

  //create h2 question title and append it to the title area;
  let questionTitle = document.createElement("h2");
  let questionText = document.createTextNode(obj["title"]);
  questionTitle.appendChild(questionText);
  htmlTitleArea.appendChild(questionTitle);

  //shuffle the choses
  let chosesAns = shuffle(obj["choses"]);

  //create the # answers radio button and label for every radio
  for (let i = 0; i < chosesAns.length; i++) {
    let chosesDiv = document.createElement("div");
    chosesDiv.className = "answer";
    let radioInput = document.createElement("input");
    radioInput.type = "radio";
    radioInput.name = "question";
    radioInput.id = `ch-${i + 1}`;
    radioInput.dataset.answer = chosesAns[i];
    if (i === 0) radioInput.checked = true;
    let theLabel = document.createElement("label");
    theLabel.htmlFor = `ch-${i + 1}`;
    let theLabelText = document.createTextNode(chosesAns[i]);
    theLabel.appendChild(theLabelText);
    chosesDiv.appendChild(radioInput);
    chosesDiv.appendChild(theLabel);

    //append all divs to answers area
    htmlAnswersArea.appendChild(chosesDiv);
    //the bullets pending
    htmlBulletSelf[currentQuesitionIndex].className = "pending";
  }
}

function checkAnswer(aAnswer) {
  let answers = document.getElementsByName("question"); //the radio bullets
  let theChoosenAnswer;
  for (let i = 0; i < answers.length; i++)
    if (answers[i].checked) theChoosenAnswer = answers[i].dataset.answer;
  if (theChoosenAnswer === aAnswer) {
    rightAnswers++;
    htmlBulletSelf[currentQuesitionIndex].className = "correct";
  } else htmlBulletSelf[currentQuesitionIndex].className = "wrong";
}

function showResults(count) {
  let htmlAnswersArea = document.querySelector(".quiz-app .answers-area");
  let htmlTitleArea = document.querySelector(".quiz-app .title-area");
  let htmlBulletsContainer = document.querySelector(".quiz-app .bullets");
  htmlTitleArea.remove();
  htmlAnswersArea.remove();
  htmlSubmitButton.remove();
  htmlBulletsContainer.remove();
  //////////////
  let theResults;
  let htmlEndArea = document.querySelector(".quiz-app .results-area");
  htmlEndArea.className = "results";
  let htmlResult = document.querySelector(".quiz-app .result");

  if (rightAnswers === count) {
    theResults = `<div class="perfect">Perfect</div><div class="perfect">All Answers Is Good</div>`;
  } else if (rightAnswers > count / 2 && rightAnswers < count) {
    theResults = `<div class="good">Good</div><div><span class="good">${rightAnswers}</span> From ${count}</div>`;
  } else {
    theResults = `<div class="bad">Bad</div><div><span class="bad">${rightAnswers}</span> From ${count}</div>`;
  }
  htmlResult.innerHTML = theResults;

  let htmlAgainBtn = document.querySelector(".quiz-app .btn-again");
  htmlAgainBtn.classList.add("btn");
  htmlAgainBtn.innerText = "Again Test";
}

function countdown(duration) {
  ti(duration--);
  countdownInterval = setInterval(() => {
    ti(duration--);
    if (duration < -1) {
      clearInterval(countdownInterval);
      htmlSubmitButton.click();
    }
  }, 1000);
}
function ti(duration) {
  let htmlCountDown = document.querySelector(".quiz-app .countdown");
  let minutes, seconds;
  minutes = parseInt(duration / 60);
  seconds = parseInt(duration % 60);
  minutes = minutes < 10 ? `0${minutes}` : minutes;
  seconds = seconds < 10 ? `0${seconds}` : seconds;
  htmlCountDown.innerHTML = `${minutes}:${seconds}`;
  if (duration < 20) htmlCountDown.classList.add("bad");
}

function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex > 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    // And swap it with the current element using destruction
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
  return array;
}
