document.addEventListener("DOMContentLoaded", () => {
    let teamScores = { team1: 0, team2: 0 };
    let currentQuestion = null;
    const categories = ["Math", "Science", "History", "Literature", "Geography"];
    const pointValues = [100, 200, 300, 400, 500];

    // Initialize elements
    const teamSetup = document.getElementById("team-setup");
    const scoreboard = document.getElementById("scoreboard");
    const gameBoard = document.getElementById("game-board");
    const questionDisplay = document.getElementById("question-display");

    // Start game
    document.getElementById("start-game").onclick = () => {
        // Set team names
        document.getElementById("team1-name").textContent = document.getElementById("team1-name-input").value || "Team 1";
        document.getElementById("team2-name").textContent = document.getElementById("team2-name-input").value || "Team 2";

        // Hide team setup and show scoreboard and game board
        teamSetup.classList.add("hidden");
        scoreboard.classList.remove("hidden");

        // Load CSV and render board
        fetch('questions.csv')
            .then(response => response.text())
            .then(data => loadQuestions(data))
            .catch(error => console.error('Error loading CSV:', error));
    };

    function loadQuestions(csvData) {
        const questions = parseCSV(csvData);
        renderBoard(categories, pointValues, questions);
    }

    function parseCSV(data) {
        const rows = data.split('\n').slice(1);
        const questions = {};
        rows.forEach(row => {
            const [category, points, question, answer] = row.split(',');
            if (!questions[category]) questions[category] = {};
            if (!questions[category][points]) questions[category][points] = [];
            questions[category][points].push({ question, answer });
        });
        return questions;
    }

    function renderBoard(categories, pointValues, questions) {
        gameBoard.innerHTML = '';
        gameBoard.classList.remove("hidden");

        categories.forEach(category => {
            const categoryDiv = document.createElement('div');
            categoryDiv.className = "category";
            categoryDiv.textContent = category;
            gameBoard.appendChild(categoryDiv);

            pointValues.forEach(points => {
                const button = document.createElement('button');
                button.className = "question-button";
                button.textContent = `$${points}`;
                button.onclick = () => displayQuestion(category, points, questions);
                gameBoard.appendChild(button);
            });
        });
    }

    function displayQuestion(category, points, questions) {
        const questionPool = questions[category][points];
        currentQuestion = questionPool[Math.floor(Math.random() * questionPool.length)];
        
        document.getElementById("question-text").textContent = currentQuestion.question;
        document.getElementById("answer-text").textContent = currentQuestion.answer;
        questionDisplay.classList.remove("hidden");

        gameBoard.classList.add("hidden");
    }

    document.getElementById("show-answer").onclick = () => {
        document.getElementById("answer-text").classList.toggle("hidden");
    };

    document.getElementById("correct").onclick = () => {
        teamScores.team1 += parseInt(currentQuestion.points);
        updateScores();
        resetBoard();
    };

    document.getElementById("incorrect").onclick = () => {
        resetBoard();
    };

    function updateScores() {
        document.getElementById("team1-score").textContent = teamScores.team1;
        document.getElementById("team2-score").textContent = teamScores.team2;
    }

    function resetBoard() {
        questionDisplay.classList.add("hidden");
        gameBoard.classList.remove("hidden");
    }
});
