var Player;

Player = Entity.extend({
    init: function(){
        this.on('key_info',
            $.proxy(this.key_info, this)
        );
    },

    toString: function(){
        return "<Player x=" + this.x + ", y=" + this.y + ">";
    },

    key_info: function(){
        return _.debounce(this._key_info, 1000).apply(this, arguments);
    },

    _key_info: function(kb_states){
        var x = 0, y = 0;

        if(kb_states[LEFT]) { x = 1; }
        else if (kb_states[RIGHT]) { x = -1; }

        if(kb_states[UP]) { y = 1; }
        else if (kb_states[DOWN]) { y = -1; }

        this.x -= x;
        this.y -= y;
    }
});
