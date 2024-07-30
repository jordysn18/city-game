const gameBoard = document.getElementById('game-board');
const currentInstruction = document.getElementById('current-instruction');
const commandInput = document.getElementById('command-input');
const submitCommand = document.getElementById('submit-command');
const messageDiv = document.getElementById('message');
const chancesSpan = document.getElementById('chances');
// const timerSpan = document.getElementById('timer');
const difficultySelect = document.getElementById('difficulty-select');
const startGameButton = document.getElementById('start-game');

let gridSize;
let gameObstacles;
let obstacleMap;
let playerPosition;
let playerDirection = 'up';
let destinationPosition;
let chances;
let timeLeft;
let timerInterval;

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

// function initializeGame() {
//     const difficulty = difficultySelect.value;
//     const settings = difficultySettings[difficulty];
    
//     gridSize = settings.gridSize;
//     chances = settings.chances;
//     timeLeft = settings.time;
    
//     playerPosition = { x: 0, y: gridSize - 1 };
//     destinationPosition = { x: gridSize - 1, y: 0 };
    
//     chancesSpan.textContent = chances;
//     // timerSpan.textContent = timeLeft;
    
//     createGameBoard();
//     // startTimer();
    
//     commandInput.disabled = false;
//     submitCommand.disabled = false;
//     currentInstruction.textContent = 'Navigate to the flag!';
//     messageDiv.textContent = '';
// }

// function initializeGame() {
//     const difficulty = difficultySelect.value;
//     const settings = difficultySettings[difficulty];
    
//     gridSize = settings.gridSize;
//     chances = settings.chances;
//     timeLeft = settings.time;
    
//     const { playerPos, flagPos, obstacles } = generateRandomPositions();
//     playerPosition = playerPos;
//     destinationPosition = flagPos;
//     gameObstacles = obstacles;
    
//     playerDirection = 'up';
    
//     chancesSpan.textContent = chances;
//     // timerSpan.textContent = timeLeft;
    
//     createGameBoard();
//     // startTimer();
    
//     commandInput.disabled = false;
//     submitCommand.disabled = false;
//     currentInstruction.textContent = 'Navigate to the flag!';
//     messageDiv.textContent = '';
// }

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
    
    // Crear el mapa de obstáculos
    // obstacleMap = new Map();
    // gameObstacles.forEach(obstacle => {
    //     const obstacleType = obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];
    //     obstacleMap.set(obstacle, obstacleType);
    // });

    obstacleMap = new Map();
    gameObstacles.forEach(obstacle => {
        const [x, y] = obstacle.split(',');
        if (!obstacleMap.has(`${x},${y}`)) {
            const obstacleType = obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];
            obstacleMap.set(`${x},${y}`, obstacleType);
        }
    });

    updateDirectionIndicator();
    document.getElementById('play-again').style.display = 'none';
    
    playerDirection = 'up';
    
    chancesSpan.textContent = chances;
    // timerSpan.textContent = timeLeft;
    
    createGameBoard();
    // startTimer();
    
    commandInput.disabled = false;
    submitCommand.disabled = false;
    currentInstruction.textContent = 'Navigate to the flag!';
    messageDiv.textContent = '';
}

// function createGameBoard() {
//     gameBoard.innerHTML = '';
//     gameBoard.style.gridTemplateColumns = `repeat(${gridSize}, 60px)`;
    
//     for (let y = 0; y < gridSize; y++) {
//         for (let x = 0; x < gridSize; x++) {
//             const cell = document.createElement('div');
//             cell.classList.add('cell');
//             if (x === playerPosition.x && y === playerPosition.y) {
//                 cell.textContent = '🚶';
//             } else if (x === destinationPosition.x && y === destinationPosition.y) {
//                 cell.textContent = '🏁';
//             }
//             gameBoard.appendChild(cell);
//         }
//     }
// }


// function createGameBoard() {
//     gameBoard.innerHTML = '';
//     gameBoard.style.gridTemplateColumns = `repeat(${gridSize}, 60px)`;
    
//     for (let y = 0; y < gridSize; y++) {
//         for (let x = 0; x < gridSize; x++) {
//             const cell = document.createElement('div');
//             cell.classList.add('cell');
//             cell.textContent = obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];

//             if (x === playerPosition.x && y === playerPosition.y) {
//                 cell.textContent = '🚶';
//             } else if (x === destinationPosition.x && y === destinationPosition.y) {
//                 cell.textContent = '🏁';
//             } else if (gameObstacles.has(`${x},${y}`)) {
//                 cell.textContent = '🏢'; // Puedes usar diferentes emojis para variar los obstáculos
//             }
//             gameBoard.appendChild(cell);
//         }
//     }
// }


// function createGameBoard() {
//     gameBoard.innerHTML = '';
//     gameBoard.style.gridTemplateColumns = `repeat(${gridSize}, 60px)`;
    
//     for (let y = 0; y < gridSize; y++) {
//         for (let x = 0; x < gridSize; x++) {
//             const cell = document.createElement('div');
//             cell.classList.add('cell');
//             if (x === playerPosition.x && y === playerPosition.y) {
//                 cell.textContent = '🚶';
//             } else if (x === destinationPosition.x && y === destinationPosition.y) {
//                 cell.textContent = '🏁';
//             } else if (gameObstacles.has(`${x},${y}`)) {
//                 const obstacleIndex = Math.floor(Math.random() * obstacleTypes.length);
//                 cell.textContent = obstacleTypes[obstacleIndex];
//             } else {
//                 cell.textContent = ''; // Celda vacía si no hay jugador, bandera u obstáculo
//             }
//             gameBoard.appendChild(cell);
//         }
//     }
// }


// function createGameBoard() {
//     gameBoard.innerHTML = '';
//     gameBoard.style.gridTemplateColumns = `repeat(${gridSize}, 60px)`;
    
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
//             } else {
//                 cell.textContent = ''; // Celda vacía si no hay jugador, bandera u obstáculo
//             }
//             gameBoard.appendChild(cell);
//         }
//     }
// }

// function createGameBoard() {
//     gameBoard.innerHTML = '';
//     gameBoard.style.gridTemplateColumns = `repeat(${gridSize}, 60px)`;
    
//     for (let y = 0; y < gridSize; y++) {
//         for (let x = 0; x < gridSize; x++) {
//             const cell = document.createElement('div');
//             cell.classList.add('cell');
//             if (x === playerPosition.x && y === playerPosition.y) {
//                 // Crear un contenedor para el jugador y la flecha
//                 const playerContainer = document.createElement('div');
//                 playerContainer.style.position = 'relative';
//                 playerContainer.style.width = '100%';
//                 playerContainer.style.height = '100%';

//                 // Añadir el jugador
//                 const playerEmoji = document.createElement('span');
//                 playerEmoji.textContent = '🚶';
//                 playerContainer.appendChild(playerEmoji);

//                 // Añadir la flecha de dirección
//                 const directionArrow = document.createElement('span');
//                 directionArrow.textContent = directionArrows[playerDirection];
//                 directionArrow.style.position = 'absolute';
//                 directionArrow.style.top = '0';
//                 directionArrow.style.right = '0';
//                 directionArrow.style.fontSize = '0.7em'; // Hacer la flecha un poco más pequeña
//                 playerContainer.appendChild(directionArrow);

//                 cell.appendChild(playerContainer);
//             } else if (x === destinationPosition.x && y === destinationPosition.y) {
//                 cell.textContent = '🏁';
//             } else if (gameObstacles.has(`${x},${y}`)) {
//                 cell.textContent = obstacleMap.get(`${x},${y}`);
//             } else {
//                 cell.textContent = ''; // Celda vacía si no hay jugador, bandera u obstáculo
//             }
//             gameBoard.appendChild(cell);
//         }
//     }
// }

function createGameBoard() {
    gameBoard.innerHTML = '';
    gameBoard.style.gridTemplateColumns = `repeat(${gridSize}, 60px)`;
    
    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            // if (x === playerPosition.x && y === playerPosition.y) {
            //     const playerContainer = document.createElement('div');
            //     playerContainer.style.position = 'relative';
            //     playerContainer.style.width = '100%';
            //     playerContainer.style.height = '100%';

            //     const playerEmoji = document.createElement('span');
            //     playerEmoji.textContent = '🚶';
            //     playerContainer.appendChild(playerEmoji);

            //     const directionArrow = document.createElement('span');
            //     directionArrow.textContent = directionArrows[playerDirection];
            //     directionArrow.style.position = 'absolute';
            //     directionArrow.style.top = '0';
            //     directionArrow.style.right = '0';
            //     directionArrow.style.fontSize = '0.7em';
            //     playerContainer.appendChild(directionArrow);

            //     cell.appendChild(playerContainer);
            // } 
            if (x === playerPosition.x && y === playerPosition.y) {
                cell.textContent = '🚶';
            }
            else if (x === destinationPosition.x && y === destinationPosition.y) {
                cell.textContent = '🏁';
            } else if (gameObstacles.has(`${x},${y}`)) {
                cell.textContent = obstacleMap.get(`${x},${y}`);
            }
            gameBoard.appendChild(cell);
        }
    }
}


function updatePlayerPosition() {
    createGameBoard();
    checkWinCondition();
}

function updateDirectionIndicator() {
    const arrowContainer = document.getElementById('arrow-container');
    arrowContainer.textContent = directionArrows[playerDirection];
}

function isValidMove(position) {
    return isValidPosition(position) && !gameObstacles.has(`${position.x},${position.y}`);
}

// function moveForward(steps = 1) {
//     for (let i = 0; i < steps; i++) {
//         switch (playerDirection) {
//             case 'up': playerPosition.y = Math.max(0, playerPosition.y - 1); break;
//             case 'right': playerPosition.x = Math.min(gridSize - 1, playerPosition.x + 1); break;
//             case 'down': playerPosition.y = Math.min(gridSize - 1, playerPosition.y + 1); break;
//             case 'left': playerPosition.x = Math.max(0, playerPosition.x - 1); break;
//         }
//     }
//     updatePlayerPosition();
// }

// function moveForward(steps = 1) {
//     for (let i = 0; i < steps; i++) {
//         let newPosition = { ...playerPosition };
//         switch (playerDirection) {
//             case 'up': newPosition.y--; break;
//             case 'right': newPosition.x++; break;
//             case 'down': newPosition.y++; break;
//             case 'left': newPosition.x--; break;
//         }
//         if (isValidPosition(newPosition)) {
//             playerPosition = newPosition;
//         } else {
//             decreaseChances();
//             updatePlayerPosition();
//             return `Can't move outside the board. You lost a chance!`;
//         }
//     }
//     updatePlayerPosition();
//     return `Moved forward ${steps} step(s)`;
// }


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

// function turnLeft() {
//     const currentIndex = directions.indexOf(playerDirection);
//     playerDirection = directions[(currentIndex - 1 + directions.length) % directions.length];
//     updatePlayerPosition();
// }

// function turnLeft() {
//     const currentIndex = directions.indexOf(playerDirection);
//     playerDirection = directions[(currentIndex - 1 + directions.length) % directions.length];
//     updatePlayerPosition();
// }


function turnLeft() {
    const currentIndex = directions.indexOf(playerDirection);
    playerDirection = directions[(currentIndex - 1 + directions.length) % directions.length];
    updateDirectionIndicator();
    updatePlayerPosition();
}


// function turnRight() {
//     const currentIndex = directions.indexOf(playerDirection);
//     playerDirection = directions[(currentIndex + 1) % directions.length];
//     updatePlayerPosition();
// }

// function turnRight() {
//     const currentIndex = directions.indexOf(playerDirection);
//     playerDirection = directions[(currentIndex + 1) % directions.length];
//     updatePlayerPosition();
// }


function turnRight() {
    const currentIndex = directions.indexOf(playerDirection);
    playerDirection = directions[(currentIndex + 1) % directions.length];
    updateDirectionIndicator();
    updatePlayerPosition();
}


// function moveBack(steps = 1) {
//     for (let i = 0; i < steps; i++) {
//         switch (playerDirection) {
//             case 'up': playerPosition.y = Math.min(gridSize - 1, playerPosition.y + 1); break;
//             case 'right': playerPosition.x = Math.max(0, playerPosition.x - 1); break;
//             case 'down': playerPosition.y = Math.max(0, playerPosition.y - 1); break;
//             case 'left': playerPosition.x = Math.min(gridSize - 1, playerPosition.x + 1); break;
//         }
//     }
//     updatePlayerPosition();
// }

// function moveBack(steps = 1) {
//     for (let i = 0; i < steps; i++) {
//         let newPosition = { ...playerPosition };
//         switch (playerDirection) {
//             case 'up': newPosition.y++; break;
//             case 'right': newPosition.x--; break;
//             case 'down': newPosition.y--; break;
//             case 'left': newPosition.x++; break;
//         }
//         if (isValidPosition(newPosition)) {
//             playerPosition = newPosition;
//         } else {
//             decreaseChances();
//             updatePlayerPosition();
//             return `Can't move outside the board. You lost a chance!`;
//         }
//     }
//     updatePlayerPosition();
//     return `Moved back ${steps} step(s)`;
// }


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


// function generateRandomPositions() {
//     const positions = new Set();
//     const obstacles = new Set();

//     // Generar posición del jugador
//     const playerPos = {
//         x: Math.floor(Math.random() * gridSize),
//         y: Math.floor(Math.random() * gridSize)
//     };
//     positions.add(`${playerPos.x},${playerPos.y}`);

//     // Generar posición de la bandera
//     let flagPos;
//     do {
//         flagPos = {
//             x: Math.floor(Math.random() * gridSize),
//             y: Math.floor(Math.random() * gridSize)
//         };
//     } while (positions.has(`${flagPos.x},${flagPos.y}`));
//     positions.add(`${flagPos.x},${flagPos.y}`);

//     // Generar obstáculos
//     const obstacleCount = Math.floor(gridSize * gridSize * 0.2); // 20% del tablero
//     for (let i = 0; i < obstacleCount; i++) {
//         let obstaclePos;
//         do {
//             obstaclePos = {
//                 x: Math.floor(Math.random() * gridSize),
//                 y: Math.floor(Math.random() * gridSize)
//             };
//         } while (positions.has(`${obstaclePos.x},${obstaclePos.y}`));
//         positions.add(`${obstaclePos.x},${obstaclePos.y}`);
//         obstacles.add(`${obstaclePos.x},${obstaclePos.y}`);
//     }

//     return { playerPos, flagPos, obstacles };
// }


// function generateRandomPositions() {
//     const positions = new Set();
//     const obstacles = new Set();

//     // Generar posición del jugador
//     const playerPos = {
//         x: Math.floor(Math.random() * gridSize),
//         y: Math.floor(Math.random() * gridSize)
//     };
//     positions.add(`${playerPos.x},${playerPos.y}`);

//     // Generar posición de la bandera
//     let flagPos;
//     do {
//         flagPos = {
//             x: Math.floor(Math.random() * gridSize),
//             y: Math.floor(Math.random() * gridSize)
//         };
//     } while (positions.has(`${flagPos.x},${flagPos.y}`));
//     positions.add(`${flagPos.x},${flagPos.y}`);

//     // Asegurar que haya al menos una celda libre adyacente a la bandera
//     const adjacentCells = [
//         {x: flagPos.x - 1, y: flagPos.y},
//         {x: flagPos.x + 1, y: flagPos.y},
//         {x: flagPos.x, y: flagPos.y - 1},
//         {x: flagPos.x, y: flagPos.y + 1}
//     ];
//     const validAdjacentCells = adjacentCells.filter(cell => 
//         cell.x >= 0 && cell.x < gridSize && cell.y >= 0 && cell.y < gridSize
//     );
//     const freeCellPos = validAdjacentCells[Math.floor(Math.random() * validAdjacentCells.length)];
//     positions.add(`${freeCellPos.x},${freeCellPos.y}`);

//     // Generar obstáculos
//     const obstacleCount = Math.floor(gridSize * gridSize * 0.2); // 20% del tablero
//     for (let i = 0; i < obstacleCount; i++) {
//         let obstaclePos;
//         do {
//             obstaclePos = {
//                 x: Math.floor(Math.random() * gridSize),
//                 y: Math.floor(Math.random() * gridSize)
//             };
//         } while (positions.has(`${obstaclePos.x},${obstaclePos.y}`));
//         positions.add(`${obstaclePos.x},${obstaclePos.y}`);
//         obstacles.add(`${obstaclePos.x},${obstaclePos.y}`);
//     }

//     return { playerPos, flagPos, obstacles };
// }

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



function checkWinCondition() {
    if (playerPosition.x === destinationPosition.x && playerPosition.y === destinationPosition.y) {
        currentInstruction.textContent = 'Congratulations! You reached the destination!';
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
        turnLeft();
        return 'Turned left';
    } else if (lowerCommand === 'turn right') {
        turnRight();
        return 'Turned right';
    }
    
    // Comando inválido
    decreaseChances();
    return 'Invalid command. Try "go forward", "go back", "turn left", or "turn right". You lost a chance!';
}

// function processCommand(command) {
//     const lowerCommand = command.toLowerCase().trim();
//     const parts = lowerCommand.split(' ');
    
//     if (parts[0] === 'go' || parts[0] === 'move') {
//         const steps = parts.length > 2 ? parseInt(parts[1]) : 1;
//         if (parts[parts.length - 1] === 'forward' || parts[parts.length - 1] === 'straight') {
//             moveForward(steps);
//             return `Moved forward ${steps} step(s)`;
//         } else if (parts[parts.length - 1] === 'back' || parts[parts.length - 1] === 'backward') {
//             moveBack(steps);
//             return `Moved back ${steps} step(s)`;
//         }
//     } else if (lowerCommand === 'turn left') {
//         turnLeft();
//         return 'Turned left';
//     } else if (lowerCommand === 'turn right') {
//         turnRight();
//         return 'Turned right';
//     }
    
//     decreaseChances();

//     return 'Invalid command. Try "go forward", "go back", "turn left", or "turn right".';
// }

// function decreaseChances() {
//     chances--;
//     chancesSpan.textContent = chances;
//     if (chances <= 0) {
//         endGame(false);
//     }
// }

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
//         messageDiv.textContent = 'You win! Congratulations!';
//     } else {
//         messageDiv.textContent = 'Game over! You ran out of chances or time.';
//     }
// }

// function endGame(win) {
//     clearInterval(timerInterval);
//     commandInput.disabled = true;
//     submitCommand.disabled = true;
//     if (win) {
//         messageDiv.textContent = 'Congratulations! You reached the destination!';
//     } else {
//         if (chances <= 0) {
//             messageDiv.textContent = 'Game over! You ran out of chances. Try again!';
//         } 
//         // else if (timeLeft <= 0) {
//         //     messageDiv.textContent = 'Game over! You ran out of time. Try again!';
//         // }
//     }
// }


function endGame(win) {
    clearInterval(timerInterval);
    commandInput.disabled = true;
    submitCommand.disabled = true;
    if (win) {
        messageDiv.textContent = 'Congratulations! You reached the destination!';
    } else {
        if (chances <= 0) {
            messageDiv.textContent = 'Game over! You ran out of chances. Try again!';
        } else if (timeLeft <= 0) {
            messageDiv.textContent = 'Game over! You ran out of time. Try again!';
        }
    }
    document.getElementById('play-again').style.display = 'block';
}

// submitCommand.addEventListener('click', () => {
//     const command = commandInput.value;
//     const result = processCommand(command);
//     messageDiv.textContent = result;
//     commandInput.value = '';
//     decreaseChances();

//      // Actualizar el display de chances y verificar si el juego ha terminado
//      chancesSpan.textContent = chances;
//      if (chances <= 0) {
//          endGame(false);
//      }
// });

submitCommand.addEventListener('click', () => {
    const command = commandInput.value;
    const result = processCommand(command);
    messageDiv.textContent = result;
    commandInput.value = '';
    
    // Verificar si el juego ha terminado
    if (chances <= 0) {
        endGame(false);
    }
});

commandInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        submitCommand.click();
    }
});

startGameButton.addEventListener('click', initializeGame);

// Inicialmente, deshabilita los controles del juego
commandInput.disabled = true;
submitCommand.disabled = true;



document.getElementById('play-again').addEventListener('click', initializeGame);