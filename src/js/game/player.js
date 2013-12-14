var Player;

Player = Entity.extend({
    max_x: null,
    max_y: null,

    init: function(max_x, max_y){
        this.max_x = max_x;
        this.max_y = max_y;

        this.on('key_info',
            $.proxy(this.key_info, this)
        );
    },

    toString: function(){
        return "<Player x=" + this.x + ", y=" + this.y + ">";
    },

    key_info: _.debounce(function(kb_states){
        var x = 0, y = 0;

        if(kb_states[LEFT]) { x = 1; }
        else if (kb_states[RIGHT]) { x = -1; }

        if(kb_states[UP]) { y = 1; }
        else if (kb_states[DOWN]) { y = -1; }

        if ((this.x - x) < 0 || (this.x - x) >= this.max_x) return;
        if ((this.y - y) < 0 || (this.y - y) >= this.max_y) return;

        this.x -= x;
        this.y -= y;
    }, 500)
});
