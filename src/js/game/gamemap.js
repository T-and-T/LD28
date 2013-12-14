var GameMap, GameMapGenerator, GameRoom;

GameMap = Class.extend({
    _entities: [],

    init: function(){},

    tick: function(){},

    registerEntity: function(entity) {
        debugger;
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
    init: function(type) { this.type = type; }
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
                this._current_map[this._current_map.length - 1].push([]);
            }
        }
    },

    generate: function(){
        this.generateEmpty(width, height);

        this._current_map[0][0] = new GameMap(0);

        return new GameMap(this._current_map);
    }
});
