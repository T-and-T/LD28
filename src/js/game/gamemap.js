var GameMap, GameMapGenerator, GameRoom;

GameMap = Class.extend({
    _entities: [],

    toString: function(){ return "<GameMap>"; },

    init: function(map_array){
        this._map_array = map_array;
        this.on('tick', $.proxy(this.tick, this));
    },

    tick: function(){},

    registerEntity: function(entity) {
        if (!!entity.tick) {
            this.on('tick',
                $.proxy(entity.tick, entity)
            );
        }

        this._entities.push(entity);
    }
});


GameRoom = Class.extend({
    type: 0,
    init: function(type) { this.type = type; },
    toString: function() { return "<GameRoom type=\"" + this.type + "\">"; }
});

GameMapGenerator = Class.extend({
    _seed: null,
    _current_map: [],
    width: 0,
    height: 0,

    init: function(width, height){
        this.width = width || 4;
        this.height = height || 4;
    },

    random: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    generateEmpty: function(width, height){
        for (var y=0; y<height; y++) {
            this._current_map.push([]);

            for (var x=0; x<width; x++) {
                this._current_map[this._current_map.length - 1].push(null);
            }
        }
    },

    generate: function(){
        this.generateEmpty(this.width, this.height);

        for (var y=0; y<this.height; y++) {
            for (var x=0; x<this.width; x++) {
                this._current_map[y][x] = new GameRoom(0);
            }
        }

        return new GameMap(this._current_map);
    }
});
