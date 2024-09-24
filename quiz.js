const easyTimeSeconds = 8;
const mediumTimeSeconds = 6;
const hardTimeSeconds = 4;

let data = [];
for (let i = 1; i <= 12; i++) {
    for (let j = 1; j <= 12; j++) {
        data.push([`${i}x${j}`, `${i * j}`]);
    }
}


let quizPanel = document.getElementById("quiz-panel");
let startMessage = document.getElementById("start-message");
let questionPanel = document.getElementById("question-panel");
let buttonContainer = document.getElementById("button-container");
let answerContainer = document.getElementById("answer-container");
let scoreContainer = document.getElementById("score");
let highScoreContainer = document.getElementById("high-score");
let timerContainer = document.getElementById("timer");
let answerInput = document.getElementById("answer");
let submitButton = document.getElementById("submit");


let difficultySeconds;
let timerSeconds;
let timerInterval;
let currentQuestion;
let continueGame = true;

let score = 0;
let highScore = 0;

document.addEventListener('DOMContentLoaded', (event) => {
    const startEasyButton = document.getElementById('start-easy');
    startEasyButton.addEventListener('click', () => {
        difficultySeconds = easyTimeSeconds;
        runGame();
    });

    const startMediumButton = document.getElementById('start-medium');
    startMediumButton.addEventListener('click', () => {
        difficultySeconds = mediumTimeSeconds;
        runGame();
    });

    const startHardButton = document.getElementById('start-hard');
    startHardButton.addEventListener('click', () => {
        difficultySeconds = hardTimeSeconds;
        runGame();
    });

    const configureButton = document.getElementById('configure');
    configureButton.addEventListener('click', openConfigModal);

    const saveConfigButton = document.getElementById('save-config');
    saveConfigButton.addEventListener('click', saveConfig);

    const cancelConfigButton = document.getElementById('cancel-config');
    cancelConfigButton.addEventListener('click', closeConfigModal);

    document.getElementById("question-count").innerHTML = data.length;

    // Add event listener for Enter key on the answer input
    answerInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            checkAnswer();
        }
    });
});

function runGame()
{
    // Hide button container and start message
    buttonContainer.style.display = "none";
    startMessage.style.display = "none";
    answerContainer.style.display = "block";
    questionPanel.style.display = "block";

    timerSeconds = difficultySeconds;

    displayNextQuestion();

    submitButton.addEventListener('click', checkAnswer);
}

function displayNextQuestion() {
    currentQuestion = selectQuestion();
    questionPanel.innerHTML = currentQuestion[0];
    answerInput.value = '';
    answerInput.focus();

    resetTimer();
    startTimer();
}

function selectQuestion()
{
    let index = Math.floor(Math.random() * data.length);
    let question = data[index];
    return question;
}

function checkAnswer() {
    let userAnswer = answerInput.value.trim();
    if (userAnswer === currentQuestion[1]) {
        score++;
        updateScores();
        displayNextQuestion();
    } else {
        endGame();
    }
}

function resetTimer() {
    clearInterval(timerInterval);
    timerSeconds = difficultySeconds;
    timerContainer.innerHTML = timerSeconds;
}

function startTimer() {
    timerInterval = setInterval(() => {
        timerSeconds--;
        timerContainer.innerHTML = timerSeconds;
        if (timerSeconds <= 0) {
            endGame();
        }
    }, 1000);
}

function endGame() {
    clearInterval(timerInterval);
    let gameScore = score;
    updateScores(true);
    buttonContainer.style.display = "block";
    startMessage.style.display = "block";
    answerContainer.style.display = "none";
    questionPanel.style.display = "none";
    answerInput.value = "";
    timerContainer.innerHTML = "";

    alert(`Game Over! The correct answer was ${currentQuestion[1]}. You scored ${gameScore} points.`);
}

function updateScores(resetScore = false)
{
    if (score > highScore) {
        highScore = score;
    }

    if (resetScore) {
        score = 0;
    }

    scoreContainer.innerHTML = score;
    highScoreContainer.innerHTML = highScore;
}

function openConfigModal() {
    document.getElementById('config-overlay').style.display = 'block';
    document.getElementById('config-modal').style.display = 'block';
}

function closeConfigModal() {
    document.getElementById('config-overlay').style.display = 'none';
    document.getElementById('config-modal').style.display = 'none';
}

function saveConfig() {
    const csvInput = document.getElementById('csv-input').value;
    const newData = parseCSV(csvInput);
    if (newData) {
        data = newData;
        document.getElementById("question-count").innerHTML = data.length;
        closeConfigModal();
    } else {
        alert('Invalid CSV data. Please enter valid CSV data.');
    }
}

function parseCSV(csv) {
    const lines = csv.split('\n');
    const result = [];
    for (let line of lines) {
        const [question, answer] = line.split(',');
        if (question && answer) {
            result.push([question.trim(), answer.trim()]);
        } else {
            return null; // Invalid CSV format
        }
    }
    return result;
}