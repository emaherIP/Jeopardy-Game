document.getElementById("start-game").addEventListener("click", startGame);

let categories = [];
let questions = {};
let currentQuestion = null;
let teamScores = { team1: 0, team2: 0 };

// Start the game by loading categories and questions from the CSV file
function startGame() {
    const team1Name = document.getElementById("team1-name").value || "Team 1";
    const team2Name = document.getElementById("team2-name").value || "Team 2";
    document.getElementById("team1-score").innerText = `${team1Name}: 0`;
    document.getElementById("team2-score").innerText = `${team2Name}: 0`;
    
    loadQuestionsFromCSV();
    document.getElementById("game-board").style.display = "block";
    document.getElementById("team-setup").style.display = "none";
}

// Load questions from CSV file
async function loadQuestionsFromCSV() {
    try {
        const response = await fetch("questions.csv");
        const data = await response.text();
        parseCSVData(data);
        setupBoard();
    } catch (error) {
        console.error("Error loading CSV:", error);
    }
}

// Parse CSV data
function parseCSVData(data) {
    const rows = data.trim().split("\n");
    categories = rows[0].split(",").slice(1);  // First row, excluding "Point Value"
    
    rows.slice(1).forEach(row => {
        const cells = row.split(",");
        const pointValue = cells[0];
        
        categories.forEach((category, index) => {
            const questionAnswer = cells[index + 1].split("|");
            const question = questionAnswer[0];
            const answer = questionAnswer[1];
            
            if (!questions[category]) questions[category] = {};
            if (!questions[category][pointValue]) questions[category][pointValue] = [];
            
            questions[category][pointValue].push({ question, answer });
        });
    });
}

// Setup the game board UI
function setupBoard() {
    const categoryRow = document.getElementById("category-row");
    categoryRow.innerHTML = categories.map(category => `<th>${category}</th>`).join("");
    
    const pointsGrid = document.getElementById("points-grid");
    pointsGrid.innerHTML = "";
    [100, 200, 300, 400, 500].forEach(pointValue => {
        const row = document.createElement("tr");
        categories.forEach(category => {
            const cell = document.createElement("td");
            const button = document.createElement("button");
            button.textContent = `$${pointValue}`;
            button.onclick = () => showQuestion(category, pointValue);
            cell.appendChild(button);
            row.appendChild(cell);
        });
        pointsGrid.appendChild(row);
    });
}

// Display a question
function showQuestion(category, pointValue) {
    const questionData = questions[category][pointValue];
    const randomIndex = Math.floor(Math.random() * questionData.length);
    currentQuestion = questionData[randomIndex];
    
    document.getElementById("question-text").innerText = currentQuestion.question;
    document.getElementById("answer-text").style.display = "none";
    document.getElementById("answer-button").style.display = "inline";
    document.getElementById("question-display").style.display = "block";
    document.getElementById("game-board").style.display = "none";
}

// Show answer when "Show Answer" button is clicked
document.getElementById("answer-button").addEventListener("click", () => {
    document.getElementById("answer-text").innerText = currentQuestion.answer;
    document.getElementById("answer-text").style.display = "block";
    document.getElementById("answer-button").style.display = "none";
});

// Handle correct and incorrect answer
document.getElementById("correct-button").addEventListener("click", () => {
    updateScore(true);
    endQuestion();
});
document.getElementById("incorrect-button").addEventListener("click", () => {
    updateScore(false);
    endQuestion();
});

// Update score based on correct or incorrect answer
function updateScore(isCorrect) {
    const points = parseInt(currentQuestion.pointValue);
    const teamKey = isCorrect ? "team1" : "team2";
    teamScores[teamKey] += points;
    document.getElementById(`${teamKey}-score`).querySelector("span").innerText = teamScores[teamKey];
}

// End question display and return to game board
function endQuestion() {
    document.getElementById("question-display").style.display = "none";
    document.getElementById("game-board").style.display = "block";
}
