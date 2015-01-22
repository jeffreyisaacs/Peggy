/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var peggy = {
    settings : {
        rows : 7,
        cols : 7,
        controls : {
            CLICK : "selectPeg",
            RELEASE : "selectTarget",
            TOUCH : "selectPeg",
            TOUCH_END : "selectTarget"
        }
    },
    boardMoveEnum : {
        UP : 1,
        DOWN: 2,
        LEFT: 4,
        RIGHT: 8
    },
    screens : {}
};

window.addEventListener("load", function() {    
    peggy.boardSetup.initialize("English", 0);
    peggy.settings.rows = peggy.boardSetup.rows();
    peggy.settings.cols = peggy.boardSetup.cols();
    peggy.game.setup();
    peggy.game.showScreen("play-screen");
});

