class Player {
    constructor(name, mark){
        this.name = name;
        this.mark = mark;
    }
}

class Cell {
    value;

    constructor() {
        this.value = "";
    }

    addMark(player) {
      this.value = player;
    }
  
    get value() {
        return value;
    }
  }

function GameController(playerOneName = "Player One", playerTwoName = "Player Two") {
    playerOneName = playerOneName === "" ? "Player One" : playerOneName;
    playerTwoName = playerTwoName === "" ? "Player Two" : playerTwoName;

    const players = [new Player(playerOneName, "X"), new Player(playerTwoName, "O")];
    let activePlayerIdx = 0;
    let winningPlayerIdx = -1;
    let isGameOver = false;

    const gameBoard = (function () {
        const BOARD_SIZE = 3;
        let board = [];

        for (let i = 0; i < BOARD_SIZE; i++) {
            board[i] = [];
            for (let j = 0; j < BOARD_SIZE; j++) {
                board[i].push(new Cell());
            }
        }

        const addMark = (i, j, mark) => {
            // no mark added
            if (board[i][j].value !== "") return false;

            // add mark to board in position
            board[i][j].addMark(mark);
            return true;
        }
        
        const getBoard = () => { 
            return board; 
        };

        const printBoard = () => {
            const boardWithCellValues = board.map((row) => row.map((cell) => cell.value));
            console.log(boardWithCellValues);
        }

        const hasCompleteLine = (mark) => {
            // check rows
            for (let i = 0; i < BOARD_SIZE; i++) {
                let isPerfectRow = true;
                for (let j=0; j < BOARD_SIZE; j++) isPerfectRow &= (board[i][j].value === mark);
                if (isPerfectRow) return true;
            }
    
            // check columns 
            for (let j = 0; j < BOARD_SIZE; j++) {
                let isPerfectCol = true;
                for (let i=0; i < BOARD_SIZE; i++) isPerfectCol &= (board[i][j].value === mark);
                if (isPerfectCol) return true;
            }

            // check diagonals
            let isPerfectDiagonal = true;
            for (let i = 0; i < BOARD_SIZE; i++) isPerfectDiagonal &= (board[i][i].value === mark);
            if (isPerfectDiagonal) return true;

            isPerfectDiagonal = true;
            for (let i = 0; i < BOARD_SIZE; i++) isPerfectDiagonal &= (board[i][BOARD_SIZE-i-1].value === mark);
            return isPerfectDiagonal;
        }

        const isFull = () => {
            for (let i = 0; i < BOARD_SIZE; i++) {
                for (let j=0; j < BOARD_SIZE; j++) {
                    if (board[i][j].value === "")  return false;
                }
            }
            return true;
        }

        return {
            addMark,
            getBoard,
            printBoard,
            hasCompleteLine,
            isFull,
        };
    })();

    const switchActivePlayer = () => {
        activePlayerIdx = (activePlayerIdx + 1) % 2;
    }

    const endGame = (playerIdx = -1) => {
        winningPlayerIdx = playerIdx;
        isGameOver = true;
    }

    const playRound = (i, j) => {
        // game over
        if(isGameOver) return;

        // add mark
        markAdded = gameBoard.addMark(i, j, getActivePlayer().mark);
        if (!markAdded) return;

        // check for win or full board
        if (gameBoard.hasCompleteLine(getActivePlayer().mark)) {
            endGame(activePlayerIdx);
        } else if (gameBoard.isFull()) {
            endGame();
        } else {
            switchActivePlayer();
        }
    }

    const getActivePlayer = () => {
        // return active player
        return players[activePlayerIdx];
    }

    const getWinner = () => {
        // return winner
        return winningPlayerIdx === -1 ? null : players[winningPlayerIdx];
    }

    gameBoard.printBoard();
    console.log(`${getActivePlayer().name}'s turn`);

    return {
        playRound,
        getActivePlayer,
        getBoard : () => gameBoard.getBoard(),
        isGameOver : () => isGameOver,
        getWinner,
    };
}

const screenController = (function() {
    let gameController
    let inProgress = false;

    const gameContainer = document.querySelector(".gameContainer");
    const startForm = document.querySelector(".startForm");
    const playerTurnDiv = document.querySelector('.turn');
    const boardDiv = document.querySelector('.board');
    const restartButton = document.querySelector('.restartButton');

    const getStatusMessage = () => {
        if (gameController.isGameOver()) {
            let winner = gameController.getWinner();
            return winner ? `${winner.name} wins!` : "It's a tie!";
        }

        return `${gameController.getActivePlayer().name}'s turn`;
    }

    const toggleState = () => {
        gameContainer.classList.toggle('hideChildren');
        startForm.classList.toggle('hideChildren');

        inProgress = !inProgress;
    }

    startForm.addEventListener("submit", (e) => {
        e.preventDefault();

        if (!inProgress) {
            const playerNames = Array.from(document.querySelectorAll("form input"));
            gameController = GameController(playerNames[0].value, playerNames[1].value);
            toggleState();
            renderBoard();
        }
        
    });

    restartButton.addEventListener("click", (e) => {
        if (inProgress) {
            toggleState();
        }
    })

    const renderBoard = () => {
        // clear board
        boardDiv.textContent = "";
        
        const gameBoard = gameController.getBoard();
        gameBoard.forEach((row, i) => {
            row.forEach((cell, j) => {
                cellButton = document.createElement("button");
                cellButton.textContent = cell.value;
                cellButton.dataset.rowID = i;
                cellButton.dataset.columnID = j;
                boardDiv.appendChild(cellButton);
            });
        });

        playerTurnDiv.textContent = getStatusMessage();
    }

    boardDiv.addEventListener("click", (e) => {
        if (!inProgress) return;

        const i = e.target.dataset.rowID;
        const j = e.target.dataset.columnID;
        
        if (!i || !j) return;

        gameController.playRound(i, j);
        renderBoard();
    })
})();