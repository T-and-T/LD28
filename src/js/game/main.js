var Game, audio_files, image_files;


Game = Class.extend({
    canvas: null,
    _intervalId: null,
    stateEnum: {
        LOADING: 0,
        STARTSCREEN: 1,
        // whatever
    },
    ready: [],

    init: function init(){
        'use strict';
        this.canvas = new CanvasInterface('primary_canvas');
        this.jukebox = new JukeBox();

        // this.canvas.displayImage('/img/loading.jpg');
        this.loadAssets();

        this.jukebox.playTrack('loading');
    },

    startLoop: function start(){
        'use strict';
        if (this._intervalId !== null) {
            console.warning('Runloop already running');
            return;
        }
        this._intervalId = setInterval(this.tick, 10);
    },

    stopLoop: function(){
        'use strict';
        if (this._intervalId === null) {
            console.warning('No runloop running');
            return;
        }
        clearInterval(this._intervalId);
        this._intervalId = null;
    },

    loadAssets: function(){
        'use strict';
        console.log('Loading assets...');

        var name, asset_promises = [];

        if (audio_files) {
            for (name in audio_files) {
                asset_promises.push(
                    this.jukebox.loadAudio(audio_files[name], name)
                );
            }
        }

        if (image_files) {
            for (name in image_files) {
                asset_promises.push(
                    this.canvas.loadImage(image_files[name], name)
                );
            }
        }

        this.ready = this.ready.concat(asset_promises);
    },

    tick: function tick(){}
});

$(document).ready(function(){
    window.game = new Game();

    $.when(game.ready).then(function() {
        game.startLoop();
    });
});
