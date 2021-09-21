const gameBoard = (() => {

    const _gameboard = [
        [" ", " ", " "],
        [" ", " ", " "],
        [" ", " ", " "]
    ];

    function setGameboard(symbol, r, c) {
        _gameboard[r][c] = symbol;
    }

    function getGameboard(r, c) {
        return _gameboard[r][c];
    }

    function clearGameboard() {
        _gameboard = [
            [" ", " ", " "],
            [" ", " ", " "],
            [" ", " ", " "]
        ];
    }

    function whoWin() {

        let rowString = "";
        let columnString = "";


        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                rowString += _gameboard[i][j];
                columnString += _gameboard[j][i];
            }
            rowString += ",";
            columnString += ",";
        }

        if (rowString.includes("XXX") || columnString.includes("XXX")) {
            return "X";
        } else if (rowString.includes("OOO") || columnString.includes("OOO")) {
            return "O";
        } else if (_gameboard[0][0] != " "
            && _gameboard[0][0] == _gameboard[1][1]
            && _gameboard[0][0] == _gameboard[2][2]) {
            return _gameboard[0][0];
        } else if (_gameboard[0][2] != " "
            && _gameboard[0][2] == _gameboard[1][1]
            && _gameboard[0][2] == _gameboard[2][0]) {
            return _gameboard[0][2];
        } else {
            return ""
        }
    }

    function isTie() {
        let result = true;

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (_gameboard[i][j] == " ") {
                    result = false;
                }
            }
        }
        
        return result;
    }

    return {
        setGameboard,
        getGameboard,
        clearGameboard,
        isTie,
        whoWin,

    }
})();

const Player = (name, symbol) => {

    let _name = name;
    let _symbol = symbol;

    function getName() {
        return _name;
    }

    function getSymbol() {
        return _symbol;
    }

    return {
        getName,
        getSymbol,

    }
};

const displayController = (() => {

    let _players = [];
    let _playersIndex = 0;

    function addPlayers(player1, player2) {
        _players.push(player1, player2);
    }

    function _updateBoard() {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                document.querySelector("#_" + i + "_" + j).innerText
                    = gameBoard.getGameboard(i, j)
                ;
            }
        }
    }

    function _endGame() {
        
        let result = gameBoard.whoWin();

        if (!result) {
            if (gameBoard.isTie()) {
                console.log("Tie");
            }
        } else {
            console.log(`${result} vince`);
        }
    }

    function _addSymbol(obj) {

        let gameboardIndex = obj.target.getAttribute("id");
        gameboardIndex = gameboardIndex.split("_");
        gameboardIndex.splice(0, 1);

        gameBoard.setGameboard(_players[_playersIndex].getSymbol(),
            gameboardIndex[0], gameboardIndex[1])
        ;

        _playersIndex = (_playersIndex + 1 ) % 2;

        _updateBoard();

        _endGame();
    }

    function _clickable() {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                document.querySelector("#_" + i + "_" + j)
                    .addEventListener("click", _addSymbol, {once: true})
                ;
            }
        }
    }

    _clickable();

    return {
        addPlayers,

    }
})();
////////////////////////////////////////////////////////
const Roberto = Player("Roberto", "X");
const Alice = Player("Alice", "O");
displayController.addPlayers(Roberto, Alice);
