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
        var self=this;

        this.canvas = new CanvasInterface('primary_canvas');
        this.jukebox = new JukeBox();

        // this.canvas.displayImage('/img/loading.jpg');
        this.loadAssets();

        this.on('tick', $.proxy(this.tick, this));
        this.on('tick', function(){
            if (self.current_map_name !== null) {
                this.maps[current_map_name].emit('tick');
            }
        });
    },


        this.jukebox.playTrack('loading');
    },

    startLoop: function start(){
        'use strict';
        var self = this;

        if (this._intervalId !== null) {
            console.warning('Runloop already running');
            return;
        }

        this._intervalId = setInterval(
            function(){
                self.emit('tick');
            },
            1000
        );
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

    tick: function(){
        console.log('tick');
        switch(this._current_state) {
            case(this.stateEnum.LOADING):
                this.canvas.displayFullCanvasImage('loading');
                break;

            case(this.stateEnum.STARTSCREEN):
                // display start screen
                console.log('Pretend we have a start screen and that a user just clicked start.');
                this.switchToMap('house');
                break;

            case(this.stateEnum.GAMEMAP):
                debugger;
                this.renderMap()
                break;
        }
    }
});

$(document).ready(function(){
    window.game = new Game();

    $.when(game.ready).then(function() {
        game.startLoop();
    });
});
