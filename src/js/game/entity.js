var Entity;

Entity = Class.extend({
    name: null,
    max_x: null,
    max_y: null,
    x: 0,
    y: 0,

    init: function(name, max_x, max_y) {
        this.name = name;
        this.max_x = max_x;
        this.max_y = max_y;

        return this._super();
    }
});
