var Keyboard;

Keyboard = Class.extend({
    left: false,
    right: false,
    jump: false,

    init: function(){},

    connect: function(){
        window.onkeydown = $.proxy(this.onkeydown, this);
        window.onkeyup = $.proxy(this.onkeyup, this);
    },

    disconnect: function(){
        window.onkeydown = null;
        window.onkeyup = null;
    },

    onkeydown: function(e) {
        var key = e.keyCode ? e.keyCode : e.which;
        switch (key)
        {
            case 37: // left
                this.left = true;
                break;
            case 39: // right
                this.right = true;
                break;
            case 32: // space
                this.jump = true;
                break;
        }
    },

    onkeyup: function(e) {
        var key = e.keyCode ? e.keyCode : e.which;
        switch (key)
        {
            case 37: // left
                this.left = false;
                break;
            case 39: // right
                this.right = false;
                break;
            case 32: // space
                this.jump = false;
                break;
        }
    }
});
