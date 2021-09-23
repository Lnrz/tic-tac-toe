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

    function _addPlayer() {
        
        
        let name = DOMController.getUsernameInputValue();
        let symbol = (_players.length == 0) ? "X" : "O";

        if (!name) {
            alert("Insert a valid name");
            DOMController.addEventToSmth("button", _addPlayer);
        } else {
            _players.push(Player(name, symbol));

            DOMController.clearUsernameInput();
            DOMController.labelCycle();

            if (_players.length == 1) {
                DOMController.addEventToSmth("button", _addPlayer);
            } else {
                DOMController.usernameOptionsCycle();
                DOMController.addEventToSmth("cells", _addSymbol)
            }
        }
    }

    function _endGame() {
        
        let result = gameBoard.whoWin();
        let tie = gameBoard.isTie();

        if (tie || result) {
            if (result) {
                alert(`${result} vince`);    
            } else {
                alert("Tie");
            }

        }
    }

    function _addSymbol(obj) {

        let gameboardIndex = obj.target.getAttribute("id");
        gameboardIndex = gameboardIndex.split("_");
        gameboardIndex.splice(0, 1);

        gameBoard.setGameboard(_players[_playersIndex].getSymbol(),
            gameboardIndex[0], gameboardIndex[1])
        ;

        document.querySelector("#_" + gameboardIndex[0] + "_" + gameboardIndex[1])
            .textContent = _players[_playersIndex].getSymbol();
        ;

        _playersIndex = (_playersIndex + 1 ) % 2;

        _endGame();
    }

    function startPage() {
        DOMController.addEventToSmth("button", _addPlayer);
    }

    return {
        startPage,

    }
})();

const DOMController = (() => {
    const _USERNAMELABEL = document.querySelector("#usernameLabel");
    const _USERNAMEINPUT = document.querySelector("#usernameInput");
    const _USERNAMEBUTTON = document.querySelector("#usernameButton");
    const _LISTOFCELLS = document.querySelector(".flexbox.center .flexbox").childNodes;

    function labelCycle() {
        if (_USERNAMELABEL.textContent == "Player 1's name") {
            _USERNAMELABEL.textContent = "Player 2's name"
        } else {
            _USERNAMELABEL.textContent = "Player 1's name"
        }
    }

    function clearUsernameInput() {
        _USERNAMEINPUT.value = "";
    }

    function addEventToSmth(smth, func) {
        if (smth == "button") {
            _USERNAMEBUTTON.addEventListener("click", func, {once: true});
        } else if (smth == "cells") {
            _LISTOFCELLS.forEach(div => div.addEventListener("click", func, {once: true}))
        }
    
    }

    function getUsernameInputValue() {
        return _USERNAMEINPUT.value;
    }

    function usernameOptionsCycle() {
        if (_USERNAMELABEL.style.display == "none") {
            _USERNAMELABEL.style.display = "initial";
            _USERNAMEINPUT.style.display = "initial";
            _USERNAMEBUTTON.style.display = "initial";
        } else {
            _USERNAMELABEL.style.display = "none";
            _USERNAMEINPUT.style.display = "none";
            _USERNAMEBUTTON.style.display = "none";
        }
    }

    return {
        labelCycle,
        clearUsernameInput,
        addEventToSmth,
        getUsernameInputValue,
        usernameOptionsCycle,

    }
})();
////////////////////////////////////////////////////////
displayController.startPage();