/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
peggy.display = (function() {
    var dom = peggy.dom,
        boardSetup = peggy.boardSetup,
        $ = dom.$,
        canvas, ctx,
        cols, rows,
        pegHeight,
        pegWidth,
        boardState,
        marker,
        firstRun = true,
        shaftLen,
        arrowWidth;

    function setup() {
        canvas = document.getElementById("play");
        ctx = canvas.getContext("2d");
        cols  = boardSetup.cols();
        rows  = boardSetup.rows();
        pegWidth = canvas.width/rows;
        pegHeight = canvas.height/cols;
        shaftLen   = pegWidth * 2;
        arrowWidth = pegWidth * 0.3;
    }

    function draw(value, x, y) {
        if (value === boardSetup.invalidVal()){
            ctx.fillStyle = "rgba(200,200,200,1)";
            ctx.fillRect(pegWidth * x, pegHeight * y, pegWidth, pegHeight);
        }
        else {
            if (value === boardSetup.emptyVal()){
                ctx.fillStyle = "rgba(40,40,40,1)";
            }
            else {
                ctx.fillStyle = "rgba(200,0,0,1)";                
            }
            ctx.beginPath();
            ctx.arc(
                pegWidth * (x + 0.5), 
                pegHeight * (y + 0.5),
                pegWidth/3,0,2*Math.PI);
            ctx.fill();
        }
    }

    function redraw(state, callback) {
        ctx.fillStyle = "rgba(200,200,200,1)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        boardState = state;
        for (var x = 0; x < cols; x++) {
            for (var y = 0; y < rows; y++) {
                if (state[y][x] !== boardSetup.invalidVal()){
                    draw(state[y][x], x, y);
                }
            }
        }
        callback();
        renderMarker();
    }
    
    function clearMarker() {
        if (marker) {
            var x = marker.x,
                y = marker.y;
            draw(boardSetup.invalidVal(), x, y);
            draw(boardState[y][x], x, y);
        }
    }

    function renderMarker() {
        if (!marker) {
            return;
        }
        var x = marker.x,
            y = marker.y,
            fromX = (x + 0.5) * pegWidth,
            fromY = (y + 0.5) * pegHeight;

        clearMarker();
        
        ctx.save();
        ctx.lineWidth = 0.1 * pegWidth;
        ctx.strokeStyle = "rgba(250,250,150,1.0)";
        ctx.fillStyle = "rgba(250,250,150,1.0)";
        
        if (marker.moveMask > 0) {
            ctx.beginPath();
            ctx.arc(
                pegWidth * (x + 0.5), 
                pegHeight * (y + 0.5),
                pegWidth/3,0,2*Math.PI);
            ctx.stroke();
            
            if ((marker.moveMask & peggy.boardMoveEnum.UP) > 0)
            {
                ctx.beginPath();
                ctx.moveTo(fromX, fromY);
                ctx.lineTo(fromX, fromY - shaftLen);
                ctx.stroke();
                if (marker.arrowOut) {
                    ctx.beginPath();
                    ctx.moveTo(fromX, fromY - shaftLen - (arrowWidth/2));
                    ctx.lineTo(fromX - (arrowWidth/2), fromY - shaftLen + (arrowWidth/2));
                    ctx.lineTo(fromX + (arrowWidth/2), fromY - shaftLen + (arrowWidth/2));
                    ctx.closePath();
                    ctx.fill();
                }
                else {
                    ctx.beginPath();
                    ctx.moveTo(fromX, fromY + (arrowWidth/2));
                    ctx.lineTo(fromX - (arrowWidth/2), fromY - (arrowWidth/2));
                    ctx.lineTo(fromX + (arrowWidth/2), fromY - (arrowWidth/2));
                    ctx.closePath();
                    ctx.fill();
                }
            }
            if ((marker.moveMask & peggy.boardMoveEnum.DOWN) > 0)
            {
                ctx.beginPath();
                ctx.moveTo(fromX, fromY);
                ctx.lineTo(fromX, fromY + shaftLen);
                ctx.stroke();
                if (marker.arrowOut) {
                    ctx.beginPath();
                    ctx.moveTo(fromX, fromY + shaftLen + (arrowWidth/2));
                    ctx.lineTo(fromX - (arrowWidth/2), fromY + shaftLen - (arrowWidth/2));
                    ctx.lineTo(fromX + (arrowWidth/2), fromY + shaftLen - (arrowWidth/2));
                    ctx.closePath();
                    ctx.fill();
                }
                else {
                    ctx.beginPath();
                    ctx.moveTo(fromX, fromY - (arrowWidth/2));
                    ctx.lineTo(fromX - (arrowWidth/2), fromY + (arrowWidth/2));
                    ctx.lineTo(fromX + (arrowWidth/2), fromY + (arrowWidth/2));
                    ctx.closePath();
                    ctx.fill();
                }
            }
            if ((marker.moveMask & peggy.boardMoveEnum.LEFT) > 0)
            {
                ctx.beginPath();
                ctx.moveTo(fromX, fromY);
                ctx.lineTo(fromX - shaftLen, fromY);
                ctx.stroke();
                if (marker.arrowOut) {
                    ctx.beginPath();
                    ctx.moveTo(fromX - shaftLen - (arrowWidth/2), fromY);
                    ctx.lineTo(fromX - shaftLen + (arrowWidth/2), fromY - (arrowWidth/2));
                    ctx.lineTo(fromX - shaftLen + (arrowWidth/2), fromY + (arrowWidth/2));
                    ctx.closePath();
                    ctx.fill();
                }
                else {
                    ctx.beginPath();
                    ctx.moveTo(fromX + (arrowWidth/2), fromY);
                    ctx.lineTo(fromX - (arrowWidth/2), fromY - (arrowWidth/2));
                    ctx.lineTo(fromX - (arrowWidth/2), fromY + (arrowWidth/2));
                    ctx.closePath();
                    ctx.fill();
                }
            }
            if ((marker.moveMask & peggy.boardMoveEnum.RIGHT) > 0)
            {
                ctx.beginPath();
                ctx.moveTo(fromX, fromY);
                ctx.lineTo(fromX + shaftLen, fromY);
                ctx.stroke();
                if (marker.arrowOut) {
                    ctx.beginPath();
                    ctx.moveTo(fromX + shaftLen + (arrowWidth/2), fromY);
                    ctx.lineTo(fromX + shaftLen - (arrowWidth/2), fromY - (arrowWidth/2));
                    ctx.lineTo(fromX + shaftLen - (arrowWidth/2), fromY + (arrowWidth/2));
                    ctx.closePath();
                    ctx.fill();
                }
                else {
                    ctx.beginPath();
                    ctx.moveTo(fromX - (arrowWidth/2), fromY);
                    ctx.lineTo(fromX + (arrowWidth/2), fromY - (arrowWidth/2));
                    ctx.lineTo(fromX + (arrowWidth/2), fromY + (arrowWidth/2));
                    ctx.closePath();
                    ctx.fill();
                }
            }
        }
        else {
            ctx.beginPath();
            ctx.arc(
                pegWidth * (x + 0.5), 
                pegHeight * (y + 0.5),
                pegWidth/3,0,2*Math.PI);
            ctx.stroke();
        }
        ctx.restore();
    }

    function placeMarker(x, y, moveMask, arrowOut) {
        clearMarker();
        if (arguments.length > 0) {
            marker = {
                x : x,
                y : y,
                moveMask : moveMask,
                arrowOut : arrowOut
            };
        } else {
            marker = null;
        }
        renderMarker();
    }
    function initialize(callback) {
        if (firstRun) {
            setup();
            firstRun = false;
        }
        callback();
    }

    return {
        initialize : initialize,
        redraw : redraw,
        placeMarker : placeMarker
    };
})();


