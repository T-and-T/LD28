var Game, audio_files, image_files;

Game = Class.extend({
    canvas: null,
    _intervalId: null,
    stateEnum: {
        LOADING: 0,
        STARTSCREEN: 1,
        GAMEMAP: 2
        // whatever
    },
    _current_state: 0,
    ready: [],
    current_map_name: null,
    maps: {},

    init: function(){
        'use strict';
        var self=this;

        this.canvas = new CanvasInterface('primary_canvas');
        this.jukebox = new JukeBox();

        this.loadAssets();
        this.canvas.displayFullCanvasImage('loading');

        this.on('tick', $.proxy(this.tick, this));
        this.on('tick', function(){
            if (self.current_map_name !== null) {
                this.maps[current_map_name].emit('tick');
            }
        });
    },

    loadGameMap: function(name, map, number){
        this.maps[name] = {
            map: map,
            number: number
        };
    },

    switchToMap: function(name) {
        this.current_map_name = name;
        // TODO: transition
    },

    startLoop: function(){
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
    'use strict';
    window.game = new Game();

    var gen = new GameMapGenerator();
    var map = gen.generate();

    game.loadGameMap('house', map, 0);

    $.when(game.ready).then(function() {
        game.startLoop();
    });
});
