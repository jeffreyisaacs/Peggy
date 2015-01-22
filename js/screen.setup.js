/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

peggy.screens["setup-screen"] = (function() {
    var boardSetup = peggy.boardSetup,
        dom = peggy.dom,
        $ = dom.$,
        firstRun = true;

    function run() {
        if (firstRun) {
            peggy.dom.bind("#setup-screen #ok", "click", function(e) {
                var boardSel = $('input:radio[name=board]:checked');
                var reverseSel = $('input:radio[name=reverse]:checked');
                if (boardSel.length === 1 && reverseSel.length === 1)
                {
                    boardSetup.initialize(
                        boardSel[0].value,
                        reverseSel[0].value === "1" ? 1 : 0);
                }
                
                peggy.screens["play-screen"].setRestartFlag();
                if ($('#setup-screen #loadSolution')[0].checked === true){
                    peggy.screens["play-screen"].setLoadSolutionFlag();
                }
                peggy.game.showScreen("play-screen");
            });
            
            peggy.dom.bind("#setup-screen #cancel", "click", function(e) {
                peggy.game.showScreen("play-screen");
            });
            
            firstRun = false;
        }
        
        // Load
        var buttons = $('input:radio[name=board]');
        for (var i = 0; i < buttons.length; i++) {
            if (boardSetup.getBoardStyle() === buttons[i].value)
                buttons[i].checked = true;
            else
                buttons[i].checked = false;
        }
        
        buttons = $('input:radio[name=reverse]');
        for (var i = 0; i < buttons.length; i++) {
            if (boardSetup.getReversePlay() === 1)
                buttons[i].checked = (buttons[i].value === "1");
            else
                buttons[i].checked = (buttons[i].value === "0");
        }
        
        $('#setup-screen #loadSolution')[0].checked = false;
    }

    return {
        run : run
    };
})();

