document.addEventListener("DOMContentLoaded", () => {
    let teamScores = { team1: 0, team2: 0 };
    let currentQuestion = null;
    let categories = {};

    const teamSetup = document.getElementById("team-setup");
    const scoreboard = document.getElementById("scoreboard");
    const gameBoard = document.getElementById("game-board");
    const questionDisplay = document.getElementById("question-display");

    document.getElementById("start-game").onclick = () => {
        const team1Name = document.getElementById("team1-name-input").value || "Team 1";
        const team2Name = document.getElementById("team2-name-input").value || "Team 2";

        document.getElementById("team1-name").textContent = team1Name;
        document.getElementById("team2-name").textContent = team2Name;

        teamSetup.classList.add("hidden");
        scoreboard.classList.remove("hidden");

        fetch('questions.csv')
            .then(response => response.ok ? response.text() : Promise.reject("Failed to load CSV"))
            .then(data => loadQuestions(data))
            .catch(error => console.error('Error loading CSV:', error));
    };

    function loadQuestions(csvData) {
        const questions = parseCSV(csvData);
        categories = organizeQuestionsByCategory(questions);
        renderBoard(categories);
    }

    function parseCSV(data) {
        const rows = data.trim().split('\n');
        return rows.slice(1).map(row => {
            const [category, points, question, answer] = row.split(',');
            return { category, points: parseInt(points), question, answer };
        });
    }

    function organizeQuestionsByCategory(questions) {
        const organized = {};
        questions.forEach(q => {
            if (!organized[q.category]) organized[q.category] = {};
            if (!organized[q.category][q.points]) organized[q.category][q.points] = [];
            organized[q.category][q.points].push(q);
        });
        return organized;
    }

    function renderBoard(categories) {
        gameBoard.innerHTML = '';
        gameBoard.classList.remove("hidden");

        const table = document.createElement('table');
        const headerRow = document.createElement('tr');

        // Create category headers
        Object.keys(categories).forEach(category => {
            const th = document.createElement('th');
            th.textContent = category;
            headerRow.appendChild(th);
        });
        table.appendChild(headerRow);

        // Create point value buttons for each category
        [100, 200, 300, 400, 500].forEach(points => {
            const row = document.createElement('tr');
            Object.keys(categories).forEach(category => {
                const cell = document.createElement('td');
                const button = document.createElement('button');
                button.textContent = points;
                button.onclick = () => selectQuestion(category, points);
                cell.appendChild(button);
                row.appendChild(cell);
            });
            table.appendChild(row);
        });

        gameBoard.appendChild(table);
    }

    function selectQuestion(category, points) {
        const questionPool = categories[category][points];
        currentQuestion = questionPool[Math.floor(Math.random() * questionPool.length)];

        document.getElementById("question-text").textContent = currentQuestion.question;
        document.getElementById("answer-text").textContent = currentQuestion.answer;
        gameBoard.classList.add("hidden");
        questionDisplay.classList.remove("hidden");

        document.getElementById("show-answer").onclick = () => {
            document.getElementById("answer-text").classList.remove("hidden");
        };

        document.getElementById("correct").onclick = () => handleScore(true);
        document.getElementById("incorrect").onclick = () => handleScore(false);
    }

    function handleScore(isCorrect) {
        if (isCorrect) {
            teamScores.team1 += currentQuestion.points; // adjust for team selection logic
        }
        updateScoreboard();
        resetBoard();
    }

    function updateScoreboard() {
        document.getElementById("team1-score").textContent = teamScores.team1;
        document.getElementById("team2-score").textContent = teamScores.team2;
    }

    function resetBoard() {
        questionDisplay.classList.add("hidden");
        document.getElementById("answer-text").classList.add("hidden");
        gameBoard.classList.remove("hidden");
    }
});
