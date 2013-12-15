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
    map_name: null,
    transitions: {
        'LOADING': ['STARTSCREEN'],
        'STARTSCREEN': ['GAMEMAP'],
        'GAMEMAP': ['STARTSCREEN']
    },
    player: null,

    init: function(max_x, max_y){
        'use strict';
        Transitionable.apply(this);

        this.map_name = document.getElementById('map_name');

        this.canvas = new CanvasInterface('primary_canvas');
        this.jukebox = new JukeBox();
        this.keyboard = new Keyboard();
        this.player = new Player(max_x, max_y);

        // this takes prioriy
        var self=this;
        this.canvas.loadImage('/img/loading.jpg', 'loading').then(function(){
            self.canvas.displayFullCanvasImage('loading');
        });

        this.loadAssets();
        // this.jukebox.playTrack('loading');

        this.on('update', $.proxy(this.update, this));
        this.on('update', $.proxy(this.mapUpdate, this));

        this.on('draw', $.proxy(this.draw, this));
    },

    mapUpdate: function(){
        if (this.current_map_name !== null) {
            this.maps[this.current_map_name].map.emit('update');
        }
    },

    loadGameMap: function(name, map, number){
        this.maps[name] = {
            map: map,
            number: number
        };
    },

    switchToMap: function(name) {
        if (this.inState('STARTSCREEN'))
            this.transitionTo('GAMEMAP');
        this.current_map_name = name;
        // TODO: transition
    },

    renderMap: function(){
        var cur_map = this.maps[this.current_map_name];
        if (!cur_map) return;

        var width = this.canvas.width(),
            height = this.canvas.height(),
            cell_width = width / cur_map.map._map_array[0].length,
            cell_height = height / cur_map.map._map_array.length;

        this.map_name.textContent = this.current_map_name;

        this.canvas.clear();

        for (var y = cur_map.map._map_array.length - 1; y >= 0; y--) {
            var row = cur_map.map._map_array[y];

            for (var x = row.length - 1; x >= 0; x--) {
                this.canvas._context.fillStyle = [
                    '#000000',
                    'black',
                    'green',
                    'red',
                    'grey'
                ][row[x].type - 1];

                this.canvas._context.fillRect(
                    x * cell_width, y * cell_height,
                    cell_width, cell_height
                );
            }
        }
    },

    renderStartScreen: function(){
        var self=this;

        $(this.canvas._canvas).click(function(){
            if (self.inState('STARTSCREEN')) {
                debugger;
                self.switchToMap('house');
            }
        });

        this.canvas._context.fillText(
            "Click to start",
            this.canvas.width() / 2,
            this.canvas.height() / 2
        );
    },

    cell_width: function(){
        var width = this.canvas.width();
        return width / this.maps[this.current_map_name].map._map_array[0].length;
    },

    cell_height: function(){
        var height = this.canvas.height();
        return height / this.maps[this.current_map_name].map._map_array.length;
    },

    renderPlayer: function(){
        var cur_map = this.maps[this.current_map_name],

            width = this.canvas.width(),
            height = this.canvas.height(),

            cell_width = this.cell_width(),
            cell_height = this.cell_height(),

            player = this.player;

        var new_x = player.x * cell_width,
            new_y = player.y * cell_height;

        this.canvas.drawImage('player', new_x, new_y);
    },

    startLoop: function(){
        'use strict';
        if (this.inState('LOADING'))
            this.transitionTo('STARTSCREEN');
        this.keyboard.connect();

        if (this._intervalId !== null) {
            console.warn('Runloop already running');
            return;
        }

        var self = this;
        this._intervalId = setInterval($.proxy(this.run, this), 10);

        console.info('Runloop started');
        document.getElementById('status').style['background-color'] = 'green';
    },

    stopLoop: function(){
        'use strict';
        // if (this.inState('GAMEMAP'))
        //     this.transitionTo('STARTSCREEN');

        if (this._intervalId === null) {
            console.warn('No runloop running');
            return;
        }
        this.keyboard.disconnect();

        clearInterval(this._intervalId);
        this._intervalId = null;

        console.info('Runloop halted');
        document.getElementById('status').style['background-color'] = 'red';
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

    run: (function() {
        this.fps = 60;
        var loops = 0, skipTicks = 1000 / this.fps,
            maxFrameSkip = 10,
            nextGameTick = (new Date()).getTime();

        return function() {
            loops = 0;

            while ((new Date()).getTime() > nextGameTick && loops < maxFrameSkip) {
                this.emit('update');
                nextGameTick += skipTicks;
                loops++;
            }

            this.emit('draw');
        };
    })(),

    update: function(){
        switch(this._current_state) {
            case(this.stateEnum.STARTSCREEN):
                break;

            case(this.stateEnum.GAMEMAP):
                this.player.emit('key_info', this.keyboard.kb_states);
                break;

            default:
                throw Error('Unknown state "' + this.inverseStateEnum()[this._current_state] + '"');
        }
    },

    draw: function(){
        switch(this._current_state) {
            case(this.stateEnum.LOADING):
                this.canvas.displayFullCanvasImage('loading');
                break;

            case(this.stateEnum.STARTSCREEN):
                this.renderStartScreen();
                break;

            case(this.stateEnum.GAMEMAP):
                // display one of the games maps
                this.renderMap();
                this.renderPlayer();
                break;

            default:
                throw Error('Unknown state "' + this.inverseStateEnum()[this._current_state] + '"');
        }
    }
});

$(document).ready(function(){
    'use strict';
    var max_x = 67, max_y = 18;

    window.game = new Game(max_x, max_y);

    var gen = new GameMapGenerator(max_x, max_y);
    var map = gen.generate();

    game.loadGameMap('house', map, 0);

    $.when(game.ready).then(function() {
        console.log('Assets loaded, ready to start mainloop');

        document.getElementById('start_button').disabled = false;
        // game.startLoop();
    });
});
