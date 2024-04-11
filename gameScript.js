function Player(name, mark) {
    return {name, mark};
}

function Cell() {
    let value = "";
  
    const addMark = (player) => {
      value = player;
    };
  
    const getValue = () => {
        return value;
    };
  
    return {
      addMark,
      getValue,
    };
  }

function GameController(playerOneName = "Player One", playerTwoName = "Player Two") {
    const players = [Player(playerOneName, "X"), Player(playerTwoName, "O")];
    let activePlayerIdx = 0;
    let winningPlayerIdx = -1;

    const switchActivePlayer = () => {
        activePlayerIdx = (activePlayerIdx + 1) % 2;
    }

    const gameBoard = (function () {
        const BOARD_SIZE = 3;
        let board = [];

        for (let i = 0; i < BOARD_SIZE; i++) {
            board[i] = [];
            for (let j = 0; j < BOARD_SIZE; j++) {
                board[i].push(Cell());
            }
        }

        const addMark = (i, j, mark) => {
            // add mark to board in position
            board[i][j].addMark(mark);
        }
        
        const getBoard = () => { 
            return board; 
        };

        const printBoard = () => {
            const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()));
            console.log(boardWithCellValues);
        }

        return {
            addMark,
            getBoard,
            printBoard
        };
    })();

    const playRound = (i, j) => {
        // add mark
        gameBoard.addMark(i, j, getActivePlayer().mark);

        // check if win
        // switch player turn
        switchActivePlayer();

        gameBoard.printBoard();
    }

    const getActivePlayer = () => {
        // return active player
        return players[activePlayerIdx];
    }

    const getWinner = () => {
        // return winner
        return winningPlayerIdx = -1 ? null : players[winnerIdx];
    }

    return {
        playRound,
        getActivePlayer,
        getBoard : () => gameBoard.getBoard(),
        getWinner,
    };
}


