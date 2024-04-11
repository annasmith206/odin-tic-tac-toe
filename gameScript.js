function Player(name, mark) {
    return {name, mark};
}

function Cell() {
    let value = "";
  
    const addMark = (player) => {
      value = player;
    };
  
    const getValue = () => value;
  
    return {
      addMark,
      getValue
    };
  }

function GameController(playerOneName = "Player One", playerTwoName = "Player Two") {
    const players = [Player(playerOneName, "X"), Player(playerTwoName, "O")];
    const activePlayerIdx = 0;
    const winningPlayerIdx = -1;

    const switchActivePlayer = () => {
        activePlayerIdx = (activePlayerIdx + 1) % 2;
    }

    const gameBoard = (function () {
        const BOARD_SIZE = 3;
        board = [];

        for (let i = 0; i < BOARD_SIZE; i++) {
            let row = [];
            for (let j = 0; j < BOARD_SIZE; j++) {
                row.push(Cell());
            }
            board.push(row);
        }

        const addMark = (i, j, mark) => {
            // add mark to board in position
            board[i][j].addMark(mark);
        }
        
        const getBoard = () => {
            return board;
        }

        return {
            addMark,
            getBoard,
        };
    })();

    const playRound = (i, j) => {
        // add mark
        gameBoard.addMark(i, j, getActivePlayer.mark);

        // check if win
        // switch player turn
        switchActivePlayer();
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
        getBoard : gameBoard.getBoard(),
        getWinner,
    };
}


