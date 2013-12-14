var Game, audio_files, image_files;


Transitionable = Class.Mixin.create({
    inverseStateEnum: function(){
        var obj = {};
        for(var name in this.stateEnum) {
            obj[this.stateEnum[name]] = name;
        }
        return obj;
    },

    transitionTo: function(name) {
        var transitions = this.transitions,
            inverse = this.inverseStateEnum(),
            currentStateName = inverse[this._current_state];

        if (!transitions[currentStateName]) {
            console.warning('Cannot transition away from '+name);
            return;
        }

        var possible_transitions = transitions[currentStateName];
        if (possible_transitions.indexOf(name) >= 0) {
            console.debug('' + currentStateName + ' -> ' + name);
            this._current_state = this.stateEnum[name];
        } else {
            console.warning('Invalid transition from ' + currentStateName + ' to ' + name);
            return;
        }
    },

    inState: function(name){
        return this.inverseStateEnum()[this._current_state] == name;
    }
});


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

    init: function(){
        'use strict';
        var self=this;
        Transitionable.apply(this);

        this.map_name = document.getElementById('map_name');

        this.canvas = new CanvasInterface('primary_canvas');
        this.jukebox = new JukeBox();
        this.keyboard = new Keyboard();

        this.loadAssets();
        this.canvas.displayFullCanvasImage('loading');

        this.on('tick', $.proxy(this.tick, this));
        this.on('tick', $.proxy(this.mapTick, this));
    },

    mapTick: function(){
        if (self.current_map_name !== null) {
            this.maps[this.current_map_name].map.emit('tick');
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

    startLoop: function(){
        'use strict';
        if (this.inState('LOADING'))
            this.transitionTo('STARTSCREEN');
        this.keyboard.connect();

        if (this._intervalId !== null) {
            console.warning('Runloop already running');
            return;
        }

        this._intervalId = setInterval(self.emit, 1000, 'tick');
    },

    stopLoop: function(){
        'use strict';
        if (this._intervalId === null) {
            console.warning('No runloop running');
            return;
        }
        this.keyboard.disconnect();

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
