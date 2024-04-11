function Player(name, mark) {
    return {name, mark};
}

function GameController(playerOneName = "Player One", playerTwoName = "Player Two") {
    const players = [Player(playerOneName, "X"), Player(playerTwoName, "O")];
    const activePlayerIdx = 0;
    const winningPlayerIdx = -1;

    const switchActivePlayer = () => {
        activePlayerIdx = (activePlayerIdx + 1) % 2;
    }

    const playRound = (i, j) => {
        // add mark to board
        // check if win
        // switch player turn
        switchActivePlayer();
    }

    const getActivePlayer = () => {
        // return active player
        return players[activePlayerIdx];
    }

    const getBoard = () => {
        // return board
    }

    const getWinner = () => {
        // return winner
        return winningPlayerIdx = -1 ? null : players[winnerIdx];
    }

    return {
        playRound,
        getActivePlayer,
        getBoard,
        getWinner,
    };
}


