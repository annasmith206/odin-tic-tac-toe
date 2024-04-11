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

const gameController = (function(playerOneName = "Player One", playerTwoName = "Player Two") {
    const players = [Player(playerOneName, "X"), Player(playerTwoName, "O")];
    let activePlayerIdx = 0;
    let winningPlayerIdx = -1;

    const switchActivePlayer = () => {
        activePlayerIdx = (activePlayerIdx + 1) % 2;
    }

    const setWinningPlayer = () => {
        winningPlayerIdx = activePlayerIdx;
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

        const hasCompleteLine = (mark) => {
            // check rows
            for (let i = 0; i < BOARD_SIZE; i++) {
                let isPerfectRow = true;
                for (let j=0; j < BOARD_SIZE; j++) isPerfectRow &= (board[i][j].getValue() === mark);
                if (isPerfectRow) return true;
            }
    
            // check columns 
            for (let j = 0; j < BOARD_SIZE; j++) {
                let isPerfectCol = true;
                for (let i=0; i < BOARD_SIZE; i++) isPerfectCol &= (board[i][j].getValue() === mark);
                if (isPerfectCol) return true;
            }

            // check diagonals
            let isPerfectDiagonal = true;
            for (let i = 0; i < BOARD_SIZE; i++) isPerfectDiagonal &= (board[i][i].getValue() === mark);
            if (isPerfectDiagonal) return true;

            isPerfectDiagonal = true;
            for (let i = 0; i < BOARD_SIZE; i++) isPerfectDiagonal &= (board[i][BOARD_SIZE-i-1].getValue() === mark);
            return isPerfectDiagonal;
        }

        return {
            addMark,
            getBoard,
            printBoard,
            hasCompleteLine,
        };
    })();

    const playRound = (i, j) => {
        // add mark
        gameBoard.addMark(i, j, getActivePlayer().mark);

        // check if win
        gameBoard.hasCompleteLine(getActivePlayer().mark) ? setWinningPlayer() : switchActivePlayer();

        gameBoard.printBoard();
        
        if (isGameOver()) {
            console.log(`${getWinner().name} wins!`);
        } else {
            console.log(`${getActivePlayer().name}'s turn`);
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

    const isGameOver = () => {
        return winningPlayerIdx !== -1;
    }

    gameBoard.printBoard();
    console.log(`${getActivePlayer().name}'s turn`);

    return {
        playRound,
        getActivePlayer,
        getBoard : () => gameBoard.getBoard(),
        isGameOver,
        getWinner,
    };
})();

// column
/*
gameController.playRound(0,0);
gameController.playRound(2,2);
gameController.playRound(1,0);
gameController.playRound(2,2);
gameController.playRound(2,0);
*/

// diagonal 1
/*
gameController.playRound(0,0);
gameController.playRound(1,0);
gameController.playRound(1,1);
gameController.playRound(1,0);
gameController.playRound(2,2);
*/

// diagonal 2
/*
gameController.playRound(0,2);
gameController.playRound(1,0);
gameController.playRound(1,1);
gameController.playRound(1,0);
gameController.playRound(2,0);
*/


