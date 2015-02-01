peggy.input = (function() {
    var dom = peggy.dom,
        $ = dom.$,
        settings = peggy.settings,
        inputHandlers;

    function handleClick(event, control, click) {
        // is any action bound to this input control?
        var action = settings.controls[control];
        if (!action) {
            return;
        }
        
        var board = $("#play-screen #game-board")[0],
            rect = board.getBoundingClientRect(),
            relX, relY,
            pegX, pegY;

        // click position relative to board
        relX = click.clientX - rect.left;
        relY = click.clientY - rect.top;
        // jewel coordinates
        pegX = Math.floor(relX / rect.width * settings.cols);
        pegY = Math.floor(relY / rect.height * settings.rows);
        // trigger functions bound to action
        trigger(action, pegX, pegY);
        // prevent default click behavior
        event.preventDefault();
    }

    function initialize() {
        inputHandlers = {};
        var board = $("#play-screen #game-board")[0];

        dom.bind(board, "mousedown", function(event) {
            handleClick(event, "CLICK", event);
        });
        
        dom.bind(board, "mouseup", function(event) {
            handleClick(event, "RELEASE", event);
        });
       
        dom.bind(board, "touchstart", function(event) {
            handleClick(event, "TOUCH", event.changedTouches[0]);
        });

        dom.bind(board, "touchend", function(event) {
            handleClick(event, "TOUCH_END", event.changedTouches[0]);
        });
    }

    function bind(action, handler) {
        if (!inputHandlers[action]) {
            inputHandlers[action] = [];
        }
        inputHandlers[action].push(handler);
    }

    function trigger(action) {
        var handlers = inputHandlers[action],
            args = Array.prototype.slice.call(arguments, 1);

        if (handlers) {
            for (var i=0;i<handlers.length;i++) {
                handlers[i].apply(null, args);
            }
        }
    }

    return {
        initialize : initialize,
        bind : bind
    };
})();

