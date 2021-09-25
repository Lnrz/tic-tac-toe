const gameBoard = (() => {

    let _gameboard = [
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
            return 1;
        } else if (rowString.includes("OOO") || columnString.includes("OOO")) {
            return 2;
        } else if (_gameboard[0][0] != " "
            && _gameboard[0][0] == _gameboard[1][1]
            && _gameboard[0][0] == _gameboard[2][2]) {
            return (_gameboard[0][0] == "X") ? 1 : 2;
        } else if (_gameboard[0][2] != " "
            && _gameboard[0][2] == _gameboard[1][1]
            && _gameboard[0][2] == _gameboard[2][0]) {
                return (_gameboard[0][2] == "X") ? 1 : 2;
        } else {
            return 0;
        }
    }

    function isTie() {

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (_gameboard[i][j] == " ") {
                    return false;
                }
            }
        }
        
        return true;
    }

    return {
        setGameboard,
        getGameboard,
        clearGameboard,
        isTie,
        whoWin
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
        getSymbol
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
        } else {
            _players.push(Player(name, symbol));

            DOMController.clearUsernameInput();
            DOMController.labelCycle();

            if (_players.length == 2) {
                DOMController.usernameOptionsCycle();
                DOMController.addEventToSmth("cells", _addSymbol)
            }
        }
    }

    function _endGame() {
        
        let result = gameBoard.whoWin();
        let tie = gameBoard.isTie();

        if (tie || result) {

            let text;

            if (result) {
                text = `Congratulations ${
                    _players[result - 1].getName()
                }, you are the winner!`    
            } else {
                text = "It's a tie!";
            }

            DOMController.changeWinnerText(text);
            DOMController.cycleBlackPanel();
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

    function _restartGame() {
        
        _players = [];
        _playersIndex = 0;

        gameBoard.clearGameboard();

        DOMController.resetCells(_addSymbol);
        DOMController.usernameOptionsCycle();
        DOMController.cycleBlackPanel();
    }

    function startPage() {
        DOMController.addEventToSmth("button", _addPlayer);
        DOMController.addEventToSmth("restart", _restartGame);
    }

    return {
        startPage
    }
})();

const DOMController = (() => {
    const _USERNAMELABEL = document.querySelector("#usernameLabel");
    const _USERNAMEINPUT = document.querySelector("#usernameInput");
    const _USERNAMEBUTTON = document.querySelector("#usernameButton");
    const _LISTOFCELLS = document.querySelector(".flexbox.center .flexbox").childNodes;
    const _WINNERTEXT = document.querySelector("#winnerText");
    const _RESTART = document.querySelector("#restart");
    const _BLACKPANEL = document.querySelector("#blackpanel");


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
            _USERNAMEBUTTON.addEventListener("click", func);
        } else if (smth == "cells") {
            _LISTOFCELLS.forEach(div => div.addEventListener("click", func, {once: true}))
        } else if (smth == "restart") {
            _RESTART.addEventListener("click", func);
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

    function changeWinnerText(text) {
        _WINNERTEXT.textContent = text;
    }

    function cycleBlackPanel() {
        if (_BLACKPANEL.style.display == "none" || !_BLACKPANEL.style.display) {
            _BLACKPANEL.style.display = "flex";
        } else {
            _BLACKPANEL.style.display = "none";
        }
    }

    function resetCells(func) {
        _LISTOFCELLS.forEach(cell => {
            cell.textContent = " ";
            cell.removeEventListener("click", func);
        });
    }

    return {
        labelCycle,
        clearUsernameInput,
        addEventToSmth,
        getUsernameInputValue,
        usernameOptionsCycle,
        changeWinnerText,
        cycleBlackPanel,
        resetCells
    }
})();
////////////////////////////////////////////////////////
displayController.startPage();