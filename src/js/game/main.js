var Game, audio_files, image_files;


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
        this.jukebox = new JukeBox();

        // this.canvas.displayImage('/img/loading.jpg');
        this.loadAssets();

        this.jukebox.playTrack('loading');
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

    loadAssets: function(){
        var name;

        if (audio_files) {
            for (name in audio_files) {
                this.jukebox.loadAudio(audio_files[name], name);
            }
        }

        if (image_files) {
            for (name in image_files) {
                this.canvas.loadImage(audio_assets[name], name);
            }
        }
    },

    tick: function tick(){}
});

window.onload = function(){
    window.game = new Game();
    game.startLoop();
};
