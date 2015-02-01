peggy.screens["solve-screen"] = (function() {
    var boardSetup = peggy.boardSetup,
        dom = peggy.dom,
        $ = dom.$,
        firstRun = true;

    function run() {
        if (firstRun) {
            peggy.dom.bind("#solve-screen #ok", "click", function(e) {
                boardSetup.initialize(
	            boardSetup.getBoardStyle(),
                    boardSetup.getReversePlay());
                peggy.screens["play-screen"].setRestartFlag();
                peggy.screens["play-screen"].setLoadSolutionFlag();
                peggy.game.showScreen("play-screen");
            });
            
            peggy.dom.bind("#solve-screen #cancel", "click", function(e) {
                peggy.game.showScreen("play-screen");
            });
            
            firstRun = false;
        }
    }

    return {
        run : run
    };
})();

