/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
peggy.screens["help-screen"] = (function() {
    var dom = peggy.dom,
        firstRun = true;

    function run() {
        if (firstRun) {
            
            dom.bind("#help-screen #ok", "click", function(e) {
                peggy.game.showScreen("play-screen");
            });
            
            firstRun = false;
        }
    }

    return {
        run : run
    };
})();


