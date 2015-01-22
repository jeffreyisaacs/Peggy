/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
peggy.game = (function() {
    var dom = peggy.dom,
        $ = dom.$;

    // hide the active screen (if any) and show the screen
    // with the specified id
    function showScreen(screenId) {
        var activeScreen = $("#game .screen.active")[0],
            screen = $("#" + screenId)[0];
        if (activeScreen) {
            dom.removeClass(activeScreen, "active");
        }
        
        // extract screen parameters from arguments
        var args = Array.prototype.slice.call(arguments, 1);
        // run the screen module
        peggy.screens[screenId].run.apply(
            peggy.screens[screenId], args
        );

        // display the screen html
        dom.addClass(screen, "active");
    }
    
    // create background pattern
    function createBackground() {
    }


    function setup() {
        // disable native touchmove behavior to 
        // prevent overscroll
        dom.bind(document, "touchmove", function(event) {
            event.preventDefault();
        });
        // hide the address bar on Android devices
        if (/Android/.test(navigator.userAgent)) {
            $("html")[0].style.height = "200%";
            setTimeout(function() {
                window.scrollTo(0, 1);
            }, 0);
        }
        
        createBackground();
    }
    
    // expose public methods
    return {
        setup : setup,
        showScreen : showScreen
    };
})();



