const questionText = document.getElementById("questionText");
const team1ScoreDiv = document.getElementById("team1");
const team2ScoreDiv = document.getElementById("team2");
const startGameButton = document.getElementById("startGameButton");
const categoryButtons = document.querySelectorAll(".categoryButton");
const answerButton = document.getElementById("answerButton");
const responseButtons = document.getElementById("responseButtons");
const gameMessage = document.getElementById("gameMessage");

let questions = {};
let teamScores = {};

// Function to load questions from the CSV
function loadQuestions() {
    fetch('questions.csv')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.text();
        })
        .then(data => {
            const rows = data.split('\n');
            rows.forEach((row, index) => {
                if (index === 0 || row.trim() === '') return; // Skip header or empty rows
                const [category, points, question, answer] = row.split(',');
                if (!questions[category]) {
                    questions[category] = {};
                }
                if (!questions[category][points]) {
                    questions[category][points] = [];
                }
                questions[category][points].push({ question, answer });
            });
            console.log("Questions loaded successfully:", questions);
        })
        .catch(error => {
            console.error('Error fetching the CSV file:', error);
            alert("There was an error loading the questions. Please check the questions.csv file.");
        });
}

// Initialize
function initializeGame() {
    const team1Name = document.getElementById("team1Name").value || "Team 1";
    const team2Name = document.getElementById("team2Name").value || "Team 2";

    teamScores[team1Name] = 0;
    teamScores[team2Name] = 0;
    team1ScoreDiv.textContent = `${team1Name}: ${teamScores[team1Name]}`;
    team2ScoreDiv.textContent = `${team2Name}: ${teamScores[team2Name]}`;
    document.querySelector(".team-input").style.display = "none";
    document.querySelector(".categories").style.display = "block";
    loadQuestions();
}

// Function to display question
function displayQuestion(category, points) {
    const randomIndex = Math.floor(Math.random() * questions[category][points].length);
    const selectedQuestion = questions[category][points][randomIndex];
    questionText.textContent = selectedQuestion.question;
    answerButton.style.display = "inline-block";
    answerButton.onclick = function() {
        questionText.textContent = `Question: ${selectedQuestion.question} \n Answer: ${selectedQuestion.answer}`;
    };
    responseButtons.style.display = "inline-block";
    categoryButtons.forEach(button => button.style.display = "none"); // Hide category buttons
}

// Event listeners
startGameButton.addEventListener("click", initializeGame);
categoryButtons.forEach(button => {
    button.addEventListener("click", () => {
        const category = button.dataset.category;
        const points = button.dataset.points;
        displayQuestion(category, points);
    });
});

document.getElementById("correctButton").addEventListener("click", () => {
    const teamName = document.getElementById("team1Name").value || "Team 1";
    const points = document.querySelector(".categoryButton[data-category][data-points]").dataset.points;
    teamScores[teamName] += parseInt(points);
    team1ScoreDiv.textContent = `${teamName}: ${teamScores[teamName]}`;
    resetGame();
});

document.getElementById("incorrectButton").addEventListener("click", resetGame);

// Function to reset game state
function resetGame() {
    questionText.textContent = "Select a category and point value to view a question.";
    answerButton.style.display = "none";
    responseButtons.style.display = "none";
    categoryButtons.forEach(button => button.style.display = "block"); // Show category buttons again
}

// Set up event listeners
startGameButton.addEventListener("click", initializeGame);
