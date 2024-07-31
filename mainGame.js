const gameBoard = document.getElementById('game-board');
const currentInstruction = document.getElementById('current-instruction');
const commandInput = document.getElementById('command-input');
const submitCommand = document.getElementById('submit-command');
const messageDiv = document.getElementById('message');
const chancesSpan = document.getElementById('chances');
const timerSpan = document.getElementById('timer');
const difficultySelect = document.getElementById('difficulty-select');
const startGameButton = document.getElementById('start-game');
const playAgainButton = document.getElementById('play-again');

let gridSize;
let playerPosition;
let playerDirection = 'up';
let destinationPosition;
let chances;
let timeLeft;
let timerInterval;
let gameObstacles;
let obstacleMap;

const directions = ['up', 'right', 'down', 'left'];
const obstacleTypes = ['🏢', '🏠', '🚗', '🌳', '🚧'];
const directionArrows = {
    'up': '⬆️',
    'right': '➡️',
    'down': '⬇️',
    'left': '⬅️'
};

const difficultySettings = {
    easy: { gridSize: 5, chances: 10, time: 120 },
    medium: { gridSize: 7, chances: 7, time: 90 },
    hard: { gridSize: 10, chances: 5, time: 60 }
};

function generateRandomPositions() {
    const positions = new Set();
    const obstacles = new Set();

    // Generar posición del jugador
    const playerPos = {
        x: Math.floor(Math.random() * gridSize),
        y: Math.floor(Math.random() * gridSize)
    };
    positions.add(`${playerPos.x},${playerPos.y}`);

    // Asegurar que el jugador tenga al menos una celda libre adyacente
    const playerAdjacentCells = [
        {x: playerPos.x - 1, y: playerPos.y},
        {x: playerPos.x + 1, y: playerPos.y},
        {x: playerPos.x, y: playerPos.y - 1},
        {x: playerPos.x, y: playerPos.y + 1}
    ];
    const validPlayerAdjacentCells = playerAdjacentCells.filter(cell => 
        cell.x >= 0 && cell.x < gridSize && cell.y >= 0 && cell.y < gridSize
    );
    const freePlayerCellPos = validPlayerAdjacentCells[Math.floor(Math.random() * validPlayerAdjacentCells.length)];
    positions.add(`${freePlayerCellPos.x},${freePlayerCellPos.y}`);

    // Generar posición de la bandera
    let flagPos;
    do {
        flagPos = {
            x: Math.floor(Math.random() * gridSize),
            y: Math.floor(Math.random() * gridSize)
        };
    } while (positions.has(`${flagPos.x},${flagPos.y}`));
    positions.add(`${flagPos.x},${flagPos.y}`);

    // Asegurar que la bandera tenga al menos una celda libre adyacente
    const flagAdjacentCells = [
        {x: flagPos.x - 1, y: flagPos.y},
        {x: flagPos.x + 1, y: flagPos.y},
        {x: flagPos.x, y: flagPos.y - 1},
        {x: flagPos.x, y: flagPos.y + 1}
    ];
    const validFlagAdjacentCells = flagAdjacentCells.filter(cell => 
        cell.x >= 0 && cell.x < gridSize && cell.y >= 0 && cell.y < gridSize && !positions.has(`${cell.x},${cell.y}`)
    );
    if (validFlagAdjacentCells.length > 0) {
        const freeFlagCellPos = validFlagAdjacentCells[Math.floor(Math.random() * validFlagAdjacentCells.length)];
        positions.add(`${freeFlagCellPos.x},${freeFlagCellPos.y}`);
    }

    // Generar obstáculos
    const obstacleCount = Math.floor(gridSize * gridSize * 0.2); // 20% del tablero
    for (let i = 0; i < obstacleCount; i++) {
        let obstaclePos;
        do {
            obstaclePos = {
                x: Math.floor(Math.random() * gridSize),
                y: Math.floor(Math.random() * gridSize)
            };
        } while (positions.has(`${obstaclePos.x},${obstaclePos.y}`));
        positions.add(`${obstaclePos.x},${obstaclePos.y}`);
        obstacles.add(`${obstaclePos.x},${obstaclePos.y}`);
    }

    return { playerPos, flagPos, obstacles };
}

function createGameBoard() {
    gameBoard.innerHTML = '';
    gameBoard.style.gridTemplateColumns = `repeat(${gridSize}, 60px)`;
    
    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            if (x === playerPosition.x && y === playerPosition.y) {
                cell.textContent = '😎'; 
            } else if (x === destinationPosition.x && y === destinationPosition.y) {
                cell.textContent = '🏁';
            } else if (gameObstacles.has(`${x},${y}`)) {
                cell.textContent = obstacleMap.get(`${x},${y}`);
            }
            gameBoard.appendChild(cell);
        }
    }
}

// function createGameBoard() {
//     gameBoard.innerHTML = '';
//     gameBoard.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
    
//     for (let y = 0; y < gridSize; y++) {
//         for (let x = 0; x < gridSize; x++) {
//             const cell = document.createElement('div');
//             cell.classList.add('cell');
//             if (x === playerPosition.x && y === playerPosition.y) {
//                 cell.textContent = '🚶';
//             } else if (x === destinationPosition.x && y === destinationPosition.y) {
//                 cell.textContent = '🏁';
//             } else if (gameObstacles.has(`${x},${y}`)) {
//                 cell.textContent = obstacleMap.get(`${x},${y}`);
//             }
//             gameBoard.appendChild(cell);
//         }
//     }
// }

function updateDirectionIndicator() {
    const arrowContainer = document.getElementById('arrow-container');
    arrowContainer.textContent = directionArrows[playerDirection];
}

function updatePlayerPosition() {
    createGameBoard();
    checkWinCondition();
}

function moveForward(steps = 1) {
    for (let i = 0; i < steps; i++) {
        let newPosition = { ...playerPosition };
        switch (playerDirection) {
            case 'up': newPosition.y--; break;
            case 'right': newPosition.x++; break;
            case 'down': newPosition.y++; break;
            case 'left': newPosition.x--; break;
        }
        if (isValidMove(newPosition)) {
            playerPosition = newPosition;
        } else {
            decreaseChances();
            updatePlayerPosition();
            return `Can't move there. You lost a chance!`;
        }
    }
    updatePlayerPosition();
    return `Moved forward ${steps} step(s)`;
}

function turnLeft() {
    const currentIndex = directions.indexOf(playerDirection);
    playerDirection = directions[(currentIndex - 1 + directions.length) % directions.length];
    updateDirectionIndicator();
    updatePlayerPosition();
    return 'Turned left';
}

function turnRight() {
    const currentIndex = directions.indexOf(playerDirection);
    playerDirection = directions[(currentIndex + 1) % directions.length];
    updateDirectionIndicator();
    updatePlayerPosition();
    return 'Turned right';
}

function moveBack(steps = 1) {
    for (let i = 0; i < steps; i++) {
        let newPosition = { ...playerPosition };
        switch (playerDirection) {
            case 'up': newPosition.y++; break;
            case 'right': newPosition.x--; break;
            case 'down': newPosition.y--; break;
            case 'left': newPosition.x++; break;
        }
        if (isValidMove(newPosition)) {
            playerPosition = newPosition;
        } else {
            decreaseChances();
            updatePlayerPosition();
            return `Can't move there. You lost a chance!`;
        }
    }
    updatePlayerPosition();
    return `Moved back ${steps} step(s)`;
}

function isValidPosition(position) {
    return position.x >= 0 && position.x < gridSize && 
           position.y >= 0 && position.y < gridSize;
}

function isValidMove(position) {
    return isValidPosition(position) && !gameObstacles.has(`${position.x},${position.y}`);
}

function checkWinCondition() {
    if (playerPosition.x === destinationPosition.x && playerPosition.y === destinationPosition.y) {
        endGame(true);
    }
}

function processCommand(command) {
    const lowerCommand = command.toLowerCase().trim();
    const parts = lowerCommand.split(' ');
    
    if (parts[0] === 'go' || parts[0] === 'move') {
        const steps = parts.length > 2 ? parseInt(parts[1]) : 1;
        if (parts[parts.length - 1] === 'forward' || parts[parts.length - 1] === 'straight') {
            return moveForward(steps);
        } else if (parts[parts.length - 1] === 'back' || parts[parts.length - 1] === 'backward') {
            return moveBack(steps);
        }
    } else if (lowerCommand === 'turn left') {
        return turnLeft();
    } else if (lowerCommand === 'turn right') {
        return turnRight();
    }
    
    decreaseChances();
    return 'Invalid command. Try "go forward", "go back", "turn left", or "turn right". You lost a chance!';
}

function decreaseChances() {
    chances--;
    chancesSpan.textContent = chances;
    if (chances <= 0) {
        endGame(false);
    }
}

function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeLeft--;
        timerSpan.textContent = timeLeft;
        if (timeLeft <= 0) {
            endGame(false);
        }
    }, 1000);
}

// function endGame(win) {
//     clearInterval(timerInterval);
//     commandInput.disabled = true;
//     submitCommand.disabled = true;
//     if (win) {
//         messageDiv.textContent = 'Congratulations! You reached the destination!';
//     } else {
//         if (chances <= 0) {
//             messageDiv.textContent = 'Game over! You ran out of chances. Try again!';
//         } else if (timeLeft <= 0) {
//             messageDiv.textContent = 'Game over! You ran out of time. Try again!';
//         }
//     }
//     playAgainButton.style.display = 'block';
// }

function endGame(win) {
    clearInterval(timerInterval);
    if (win) {
        messageDiv.textContent = 'Congratulations! You reached the destination!';
    } else {
        if (chances <= 0) {
            messageDiv.textContent = 'Game over! You ran out of chances. Try again!';
        } else if (timeLeft <= 0) {
            messageDiv.textContent = 'Game over! You ran out of time. Try again!';
        }
    }
    document.getElementById('controls').style.display = 'none';
    playAgainButton.style.display = 'block';
}

function initializeGame() {
    const difficulty = difficultySelect.value;
    const settings = difficultySettings[difficulty];
    
    gridSize = settings.gridSize;
    chances = settings.chances;
    timeLeft = settings.time;
    
    const { playerPos, flagPos, obstacles } = generateRandomPositions();
    playerPosition = playerPos;
    destinationPosition = flagPos;
    gameObstacles = obstacles;
    
    obstacleMap = new Map();
    gameObstacles.forEach(obstacle => {
        const [x, y] = obstacle.split(',');
        if (!obstacleMap.has(`${x},${y}`)) {
            const obstacleType = obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];
            obstacleMap.set(`${x},${y}`, obstacleType);
        }
    });
    
    playerDirection = 'up';
    
    chancesSpan.textContent = chances;
    // timerSpan.textContent = timeLeft;
    
    createGameBoard();
    updateDirectionIndicator();
    // startTimer();
    
    document.getElementById('controls').style.display = 'block';
    commandInput.disabled = false;
    submitCommand.disabled = false;
    messageDiv.textContent = 'Navigate to the flag!';
    playAgainButton.style.display = 'none';
}

startGameButton.addEventListener('click', initializeGame);
playAgainButton.addEventListener('click', initializeGame);

submitCommand.addEventListener('click', () => {
    const command = commandInput.value;
    const result = processCommand(command);
    messageDiv.textContent = result;
    commandInput.value = '';
});

commandInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        submitCommand.click();
    }
});
