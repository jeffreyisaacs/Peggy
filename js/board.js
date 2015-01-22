/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

peggy.boardSetup = (function() {
    var boardStyle = "English", 
        reversePlay, 
        nRows, 
        nCols, 
        fullValue,
        emptyValue,  
        invalidValue;

    function initialize(style, reverse) {
        boardStyle = style;
        reversePlay = reverse;
        nRows = 7;
        nCols = 7;
        fullValue = 1;
        emptyValue = 0;
        invalidValue = 9;
        restart = true;
    }

    function getStartingBoard() {
        var board = [];
        var solution;
        if (boardStyle === "English") {
            board[0] = [9,9,1,1,1,9,9];
            board[1] = [9,9,1,1,1,9,9];
            board[2] = [1,1,1,1,1,1,1];
            board[3] = [1,1,1,0,1,1,1];
            board[4] = [1,1,1,1,1,1,1];
            board[5] = [9,9,1,1,1,9,9];
            board[6] = [9,9,1,1,1,9,9];
        } else { // European Style
            board[0] = [9,9,1,1,1,9,9];
            board[1] = [9,1,1,1,1,1,9];
            board[2] = [1,1,1,0,1,1,1];
            board[3] = [1,1,1,1,1,1,1];
            board[4] = [1,1,1,1,1,1,1];
            board[5] = [9,1,1,1,1,1,9];
            board[6] = [9,9,1,1,1,9,9];
        }

        if (reversePlay === 1) {
            for (y = 0; y < nRows; y++) {
               for (x = 0; x < nCols; x++) {
                   if (board[y][x] === fullValue)
                   {
                       board[y][x] = emptyValue;
                   }
                }
            }

            //
            // Only full spot is at the start of the solution.
            //
            solution = getSolution();
            board[solution[0][0]][solution[0][1]] = fullValue;
        }
    
        return board;
    }

    function getSolution() {
        // Solutions from Wikipedia - en.wikipedia.org/wiki/Peg_solitaire
        // Each step is a jump [y1,x1,y2,x2]
        var solutionEuro = [
            [2,1,2,3], [0,2,2,2], [4,1,2,1], [4,3,4,1], [2,3,4,3], [1,4,1,2], 
            [2,1,2,3], [0,4,0,2], [4,4,4,2], [3,4,1,4], [6,3,4,3], [1,1,1,3], 
            [4,6,4,4], [5,1,3,1], [2,6,2,4], [1,4,1,2], [0,2,2,2], [3,6,3,4], 
            [4,3,4,1], [6,2,4,2], [2,3,2,1], [4,1,4,3], [5,5,5,3], [2,0,2,2], 
            [2,2,4,2], [3,4,5,4], [4,3,4,1], [3,0,3,2], [6,4,4,4], [4,0,4,2], 
            [3,2,5,2], [5,2,5,4], [5,4,3,4], [3,4,1,4], [1,5,1,3]];

        var solutionEnglish = [
            [1,3,3,3], [2,5,2,3], [0,4,2,4], [3,4,1,4], [5,4,3,4], [4,6,4,4],
            [4,3,4,5], [2,6,4,6], [4,6,4,4], [2,2,2,4], [2,0,2,2], [4,1,4,3],
            [4,3,4,5], [4,5,2,5], [2,5,2,3], [2,3,2,1], [6,2,4,2], [3,2,5,2],
            [6,4,6,2], [6,2,4,2], [4,0,2,0], [2,0,2,2], [0,2,0,4], [0,4,2,4],
            [2,4,4,4], [1,2,3,2], [3,2,5,2], [5,2,5,4], [5,4,3,4], [3,4,3,2],
            [3,1,3,3]];

        var solution = 
            (boardStyle === "English" ? solutionEnglish : solutionEuro);
        var solLength = solution.length;
        var copy = [];
        var temp;
        
        if (reversePlay === 1) {
            for (x = 0; x < solLength; x++) {
                copy[x] = solution[solLength - x - 1].slice(0);
                temp = copy[x][1];
                copy[x][1] = copy[x][3];
                copy[x][3] = temp;
                temp = copy[x][0];
                copy[x][0] = copy[x][2];
                copy[x][2] = temp;
            }
        }
        else {
            for (x = 0; x < solLength; x++) {
                copy[x] = solution[x].slice(0);
            }
        }
        return copy;
    }
       
    function getReversePlay() {
        return reversePlay;
    }
    
    function getBoardStyle() {
        return boardStyle;
    }

    function rows() {
        return nRows;
    }

    function cols() {
        return nRows;
    }

    function fullVal() {
        return fullValue;
    }

    function emptyVal() {
        return emptyValue;
    }

    function invalidVal() {
        return invalidValue;
    }

    return {
        initialize : initialize,
        getStartingBoard : getStartingBoard,
        getSolution : getSolution,
        getReversePlay : getReversePlay,
        getBoardStyle : getBoardStyle,
        rows : rows,
        cols : cols,
        fullVal : fullVal,
        emptyVal : emptyVal,
        invalidVal : invalidVal
    };

})();

peggy.board = (function() {
    var setup,
        board,
        cols,
        rows,
        fullVal,
        emptyVal,
        invalidVal;

    function getVal(x, y) {
        if (x < 0 || x > cols-1 || y < 0 || y > rows-1) {
            return invalidVal;
        } else {
            return board[y][x];
        }
    }
    
    // returns true if peg at (x1,y1) can jump to (x2,y2)
    // jump is valid if the board spot jumped over contains jumpOverVal
    function canJump(x1, y1, x2, y2, jumpOverVal) {
        if (getVal(x1,y1) !== fullVal || getVal(x2,y2) !== emptyVal) {
            return false;
        }
        if ((x1 === x2) && (Math.abs(y1 - y2) === 2)) {
            return (getVal(x1, (y1+y2)/2) === jumpOverVal);
        }
        if ((y1 === y2) && (Math.abs(x1 - x2) === 2)) {
            return (getVal((x1+x2)/2, y1) === jumpOverVal);
        }
        return false;
    }

    // returns true if peg at (x1,y1) can jump in any direction
    // jump is valid if the board spot jumped over contains jumpOverVal
    function canJumpFrom(x1, y1, jumpOverVal) {
        return (
            (x1 < cols-2 && canJump(x1, y1, x1+2, y1, jumpOverVal)) ||
            (x1 > 1 && canJump(x1, y1, x1-2, y1, jumpOverVal)) ||
            (y1 < rows-2 && canJump(x1, y1, x1, y1+2, jumpOverVal)) ||
            (y1 > 1 && canJump(x1, y1, x1, y1-2, jumpOverVal)));
    }
    
    // returns a mask of the directions a peg at (x1,y1) can jump
    // jump is valid if the board spot jumped over contains jumpOverVal
    function canJumpFromMask(x1, y1, jumpOverVal) {
        var rez = 0;
        if (x1 < cols-2 && canJump(x1, y1, x1+2, y1, jumpOverVal)) {
            rez += peggy.boardMoveEnum.RIGHT;
        }
        if (x1 > 1 && canJump(x1, y1, x1-2, y1, jumpOverVal)) {
            rez += peggy.boardMoveEnum.LEFT;            
        }
        if (y1 < rows-2 && canJump(x1, y1, x1, y1+2, jumpOverVal)) {
            rez += peggy.boardMoveEnum.DOWN;
        }
        if (y1 > 1 && canJump(x1, y1, x1, y1-2, jumpOverVal)) {
            rez += peggy.boardMoveEnum.UP;
        }
        return rez;
    }

    // creates a copy of the board
    function getBoard() {
        var copy = [],
            x;
        for (x = 0; x < cols; x++) {
            copy[x] = board[x].slice(0);
        }
        return copy;
    }

    // returns true if at least one jump is available
    function hasJumps(jumpOverVal) {
        for (var x = 0; x < cols; x++) {
            for (var y = 0; y < rows; y++) {
              if (canJumpFrom(x, y, jumpOverVal)) {
                    return true;
                }
            }
        }
        return false;
    }
    
    // returns number of items in the board
    function remaining(jumpOverVal) {
        var num = 0;
        for (var x = 0; x < cols; x++) {
            for (var y = 0; y < rows; y++) {
                if (board[y][x] === jumpOverVal) {
                    num++;
                }
            }
        }
        return num;
    }

    // if possible, jump from (x1,y1) to (x2,y2) and
    // calls the callback function with list of board events
    function jump(x1, y1, x2, y2, jumpOverVal, callback) {
        var x, y, events = [];
        if (canJump(x1, y1, x2, y2, jumpOverVal)) {
            board[y1][x1] = emptyVal;
            board[y2][x2] = fullVal;
            events.push({
                type : "jump",
                data : [{
                fromX : x1, fromY : y1, toX : x2, toY : y2
                    }]});
            x = (x1+x2)/2;
            y = (y1+y2)/2;
            board[y][x] = (jumpOverVal === fullVal ? emptyVal : fullVal);
            events.push({
                type : "change",
                data : [{
                x : x, y : y, val : board[x][y]
                    }]});
        } else {
            events.push({
                type : "fail",
                data : [{
                fromX : x1, fromY : y1, toX : x2, toY : y2
                    }]});
        }
        callback(events);
    }

    function initialize(boardSetup, callback) {
        setup = boardSetup;
        board = setup.getStartingBoard();
        cols  = setup.cols();
        rows  = setup.rows();
        fullVal = setup.fullVal();
        emptyVal = setup.emptyVal();
        invalidVal = setup.invalidVal();
        reversePlay = setup.getReversePlay();

        callback();
    }
   
    function print() {
        var str = "";
        for (var y = 0; y < rows; y++) {
            for (var x = 0; x < cols; x++) {
                str += getVal(x, y) + " ";
            }
            str += "\r\n";
        }
        console.log(str);
    }

    return {
        initialize : initialize,
        jump : jump,
        canJumpFrom : canJumpFrom,
        canJumpFromMask : canJumpFromMask,
        hasJumps : hasJumps,
        getBoard : getBoard,
        remaining : remaining,
        print : print
    };

})();

peggy.boardUnitTest = (function() {

    function test(boardStyle, reverse) {
        var solution, solLength, jumpOverVal;
        console.log("==================");
        console.log(boardStyle);
        console.log(reverse);
        console.log("==================");
        peggy.boardSetup.initialize(boardStyle, reverse);
        solution = peggy.boardSetup.getSolution();
        jumpOverVal = (reverse === 1 ? peggy.boardSetup.emptyVal() : peggy.boardSetup.fullVal());
        solLength = solution.length;
        peggy.board.initialize(peggy.boardSetup, function(){});
        peggy.board.print();
        for (var i = 0; i < solLength; i++) {
            step = solution[i];
            peggy.board.jump(
                step[1],step[0],
                step[3],step[2],
                jumpOverVal,
                function(){});
            console.log(step);
            console.log(i);
            peggy.board.print();
        }
    }

    function testAll() {
        test("English", 0);
        test("English", 1);
        test("European", 0);
        test("European", 1);
    }

    return {
        test : test,
        testAll : testAll
    };
})();




