var Keyboard,
    LEFT = 37,
    RIGHT = 39,
    UP = 38,
    DOWN = 40;

Keyboard = Class.extend({
    kb_states: {},

    connect: function(){
        window.addEventListener('keydown', $.proxy(this.onKeydown, this), false);
        window.addEventListener('keyup', $.proxy(this.onKeyup, this), false);
    },

    disconnect: function(){
        window.onkeydown = null;
        window.onkeyup = null;
    },

    isDown: function(keyCode) {
        return this.kb_states[keyCode];
    },

    onKeydown: function(e){
        this.kb_states[e.keyCode ? e.keyCode : e.which] = true;
    },

    onKeyup: function(e){
        delete this.kb_states[e.keyCode ? e.keyCode : e.which];
    }
});
