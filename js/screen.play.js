peggy.screens["play-screen"] = (function() {
    var board = peggy.board,
        boardSetup = peggy.boardSetup,
        display = peggy.display,
        input = peggy.input,
        $ = peggy.dom.$,
        firstRun = true,
        restartFlag = true,
        loadSolutionFlag = false,
        marker,
        jumpStack,
        jumpInsertIdx,
        undoJumpVal,
        redoJumpVal;

    function updateControls()
    {
        $("#play-screen #undo")[0].disabled = 
                (!jumpStack.length || jumpInsertIdx === 0);
        $("#play-screen #redo")[0].disabled = 
                (!jumpStack.length || jumpInsertIdx >= jumpStack.length);
        
        var remaining = board.remaining(redoJumpVal);
        var status = (boardSetup.getReversePlay() ? "Holes" : "Pegs") +
                " left: " + remaining;
        if (remaining === 1) {
            status = "SOLVED!";
        }
        else if (!board.hasJumps(redoJumpVal)) {
            status = "No More Moves";
        }
        $("#play-screen #status")[0].value = status;
    }
    
    function getDirection(x1,y1,x2,y2){
        var rez = 0;
        if (x2 > x1) {
            rez += peggy.boardMoveEnum.RIGHT;
        }
        if (x2 < x1) {
            rez += peggy.boardMoveEnum.LEFT;
        }
        if (y2 > y1) {
            rez += peggy.boardMoveEnum.DOWN;
        }
        if (y2 < y1) {
            rez += peggy.boardMoveEnum.UP;
        }
        return rez;
    }
    
    function run() {
        
        if (firstRun) {
            setup();
            peggy.dom.bind("#play-screen #undo", "click", function(e) {
                if (jumpInsertIdx > 0){
                    jumpInsertIdx--;
                    var step = jumpStack[jumpInsertIdx];
                    peggy.board.jump(
                        step[3],step[2],
                        step[1],step[0],
                        undoJumpVal,
                        function(){});
                    var moveMask = getDirection(step[1],step[0],step[3],step[2]);
                    display.redraw(board.getBoard(), function () {
                        placeMarker(step[1], step[0], moveMask, false);
                     });
                    updateControls();  
                }
            });
            peggy.dom.bind("#play-screen #redo", "click", function(e) {
                if (jumpInsertIdx < jumpStack.length){
                    var step = jumpStack[jumpInsertIdx];
                    peggy.board.jump(
                        step[1],step[0],
                        step[3],step[2],
                        redoJumpVal,
                        function(){});
                    var moveMask = getDirection(step[3],step[2],step[1],step[0]);
                    display.redraw(board.getBoard(), function () {
                        placeMarker(step[3], step[2], moveMask, false);
                    });
                    jumpInsertIdx++;    
                    updateControls(); 
                }
            });
            peggy.dom.bind("#play-screen #setup", "click", function(e) {
                peggy.game.showScreen("setup-screen");
            });
            peggy.dom.bind("#play-screen #help", "click", function(e) {
                peggy.game.showScreen("help-screen");
            });
            peggy.dom.bind("#play-screen #solve", "click", function(e) {
                peggy.game.showScreen("solve-screen");
            });
            firstRun = false;
        }
        
        if (boardSetup.getReversePlay() === 1) {
            undoJumpVal = peggy.boardSetup.fullVal();
            redoJumpVal = peggy.boardSetup.emptyVal();
        }
        else {
            undoJumpVal = peggy.boardSetup.emptyVal();
            redoJumpVal = peggy.boardSetup.fullVal();
        } 
        
        marker = {
            x: 0,
            y: 0,
            moveMask: 0,
            arrowOut: true
        };

        if (restartFlag) {
            peggy.settings.rows = peggy.boardSetup.rows();
            peggy.settings.cols = peggy.boardSetup.cols();
            jumpStack = (
                loadSolutionFlag === false ? [] : 
                boardSetup.getSolution());
            jumpInsertIdx = 0;

            // Size once displayed
            window.setTimeout(function() {
                peggy.board.initialize(boardSetup, function(){});
                display.initialize(function () {
                    display.redraw(board.getBoard(), function () {
                    // do nothing for now
                    });
                });
                updateControls();
                placeMarker();
		}, 100);
        }
        restartFlag = false;
        loadSolutionFlag = false;
    }
    
    function placeMarker(x, y, moveMask, arrowOut) {
        if (arguments.length) {
            marker.x = x;
            marker.y = y;
            marker.moveMask = moveMask;
            marker.arrowOut = arrowOut;
            display.placeMarker(x, y, moveMask, arrowOut);
        }
        else {
            display.placeMarker();
        }
    }

    function selectPeg(x, y) {
        if (arguments.length === 0) {
            selectPeg(marker.x, marker.y);
            return;
        }
        if (peggy.board.getBoard()[y][x] !== boardSetup.invalidVal()) {
            placeMarker(x, y, peggy.board.canJumpFromMask(x,y,redoJumpVal), true);
        }
    }
    
    function selectTarget(x, y) {
        if (arguments.length === 0 || !marker.moveMask) {
             return;
        }

        // Clamp moves to valid jumps
        if (x === marker.x && y !== marker.y) {
            if (y > marker.y && 
                (marker.moveMask & peggy.boardMoveEnum.DOWN) > 0) {
	        y = marker.y + 2;
	    }
            else if (y < marker.y && 
                (marker.moveMask & peggy.boardMoveEnum.UP) > 0) {
	        y = marker.y - 2;
	    }
	    else {
	        y = marker.y;
            }
        }
        else if (x !== marker.x && y === marker.y) {
            if (x > marker.x && 
                (marker.moveMask & peggy.boardMoveEnum.RIGHT) > 0) {
	        x = marker.x + 2;
	    }
            else if (x < marker.x && 
                (marker.moveMask & peggy.boardMoveEnum.LEFT) > 0) {
	        x = marker.x - 2;
	    }
	    else {
	        x = marker.x;
            }
        }
        else {
            x = marker.x;
            y = marker.y;
        }
        
        peggy.board.jump(
            marker.x, marker.y,
            x, y,
            redoJumpVal,
            playBoardEvents);
    }
    
    function playBoardEvents(events) {
        if (events.length > 0) {
            var boardEvent = events.shift(),
                next = function() {
                    playBoardEvents(events);
                };
            switch (boardEvent.type) {
                case "jump" :
                    //display.moveJewels(boardEvent.data, next);
                    if (jumpInsertIdx !== jumpStack.length) {
                        jumpStack.splice(jumpInsertIdx, jumpStack.length-jumpInsertIdx);
                    }
                    jumpStack.push([
                        boardEvent.data[0].fromY,
                        boardEvent.data[0].fromX,
                        boardEvent.data[0].toY,
                        boardEvent.data[0].toX
                    ]);
                    jumpInsertIdx++;
                    updateControls();  
                    placeMarker(boardEvent.data[0].toX, boardEvent.data[0].toY, 0, false);
                    next();
                    break;
                case "change" :
                    //display.removeJewels(boardEvent.data, next);
                    next();
                    break;
                case "fail" :
                    placeMarker(boardEvent.data[0].toX, boardEvent.data[0].toY, 0, false);
                    next();
                    break;
                default :
                    next();
                    break;
            }
        } else {
            display.redraw(board.getBoard(), function() {
                // good to go again
            });
        }
    }

    function setup() {
        input.initialize();
        input.bind("selectPeg", selectPeg);
        input.bind("selectTarget", selectTarget);
    }
    
    function setRestartFlag() {
        restartFlag = true;
    }
    
    function setLoadSolutionFlag() {
        loadSolutionFlag = true;
    }

    return {
        run : run,
        setRestartFlag : setRestartFlag,
        setLoadSolutionFlag : setLoadSolutionFlag
    };
})();

