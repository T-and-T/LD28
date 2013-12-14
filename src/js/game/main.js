var Game;


Game = Class.extend({
    canvas: null,
    stateEnum: {
        LOADING: 0,
        STARTSCREEN: 1,
        // whatever
    },
    _intervalId: null,

    init: function init(){
        'use strict';
        this.canvas = new CanvasInterface('primary_canvas');
        // this.canvas.displayImage('/img/loading.jpg');
    },

    startLoop: function start(){
        if (this._intervalId !== null) {
            console.warning('Runloop already running');
            return;
        }
        this._intervalId = setInterval(this.tick, 10);
    },

    stopLoop: function(){
        if (this._intervalId === null) {
            console.warning('No runloop running');
            return;
        }
        clearInterval(this._intervalId);
        this._intervalId = null;
    },

    tick: function tick(){

    }
});

window.onload = function(){
    window.game = new Game();
    game.startLoop();
};
