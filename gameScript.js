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
        return this.value;
    }
}


class GameBoard {
    #BOARD_SIZE = 3;
    #board = [];

    constructor() {
        for (let i = 0; i < this.#BOARD_SIZE; i++) {
            this.#board[i] = [];
            for (let j = 0; j < this.#BOARD_SIZE; j++) {
                this.#board[i].push(new Cell());
            }
        }
    }

    get board(){ 
        return this.#board; 
    }

    addMark(i, j, mark) {
        // no mark added
        if (this.#board[i][j].value !== "") return false;

        // add mark to board in position
        this.#board[i][j].addMark(mark);
        return true;
    }

    printBoard(){
        const boardWithCellValues = this.#board.map((row) => row.map((cell) => cell.value));
        console.log(boardWithCellValues);
    }

    hasCompleteLine(mark){
        // check rows
        for (let i = 0; i < this.#BOARD_SIZE; i++) {
            let isPerfectRow = true;
            for (let j=0; j < this.#BOARD_SIZE; j++) isPerfectRow &= (this.#board[i][j].value === mark);
            if (isPerfectRow) return true;
        }

        // check columns 
        for (let j = 0; j < this.#BOARD_SIZE; j++) {
            let isPerfectCol = true;
            for (let i=0; i < this.#BOARD_SIZE; i++) isPerfectCol &= (this.#board[i][j].value === mark);
            if (isPerfectCol) return true;
        }

        // check diagonals
        let isPerfectDiagonal = true;
        for (let i = 0; i < this.#BOARD_SIZE; i++) isPerfectDiagonal &= (this.#board[i][i].value === mark);
        if (isPerfectDiagonal) return true;

        isPerfectDiagonal = true;
        for (let i = 0; i < this.#BOARD_SIZE; i++) isPerfectDiagonal &= (this.#board[i][this.#BOARD_SIZE-i-1].value === mark);
        return isPerfectDiagonal;
    }

    isFull(){
        for (let i = 0; i < this.#BOARD_SIZE; i++) {
            for (let j=0; j < this.#BOARD_SIZE; j++) {
                if (this.#board[i][j].value === "")  return false;
            }
        }
        return true;
    }
}

class GameController {
    #activePlayerIdx = 0;
    #winningPlayerIdx = -1;
    #isGameOver = false;
    #gameBoard = new GameBoard();
    #players;

    constructor(playerOneName = "Player One", playerTwoName = "Player Two") {
        playerOneName = playerOneName === "" ? "Player One" : playerOneName;
        playerTwoName = playerTwoName === "" ? "Player Two" : playerTwoName;
        this.#players = [new Player(playerOneName, "X"), new Player(playerTwoName, "O")]; 
    }

    #switchActivePlayer() {
        this.#activePlayerIdx = (this.#activePlayerIdx + 1) % 2;
    }

    #endGame(playerIdx = -1){
        this.#winningPlayerIdx = playerIdx;
        this.#isGameOver = true;
    }

    playRound(i, j) {
        // game over
        if(this.#isGameOver) return;

        // add mark
        let markAdded = this.#gameBoard.addMark(i, j, this.activePlayer.mark);
        if (!markAdded) return;

        // check for win or full board
        if (this.#gameBoard.hasCompleteLine(this.activePlayer.mark)) {
            this.#endGame(this.#activePlayerIdx);
        } else if (this.#gameBoard.isFull()) {
            this.#endGame();
        } else {
            this.#switchActivePlayer();
        }
    }

    get activePlayer() {
        // return active player
        return this.#players[this.#activePlayerIdx];
    }

    get winner(){
        // return winner
        return this.#winningPlayerIdx === -1 ? null : this.#players[this.#winningPlayerIdx];
    }

    get board() {
        return this.#gameBoard.board;
    }

    get gameOver() {
        return this.#isGameOver;
    }

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
        if (gameController.gameOver) {
            let winner = gameController.winner;
            return winner ? `${winner.name} wins!` : "It's a tie!";
        }

        return `${gameController.activePlayer.name}'s turn`;
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
            gameController = new GameController(playerNames[0].value, playerNames[1].value);
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
        
        const gameBoard = gameController.board;
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