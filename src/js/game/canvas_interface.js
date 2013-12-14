var CanvasInterface;


CanvasInterface = Class.extend({
    _canvas: null,
    _context: null,
    _images: {},

    init: function init(canvas_id) {
        'use strict';
        this._canvas = document.getElementById(canvas_id);
        console.assert(this._canvas);

        this._context = this._canvas.getContext('2d');
    },

    displayFullCanvasImage: function (name) {
        'use strict';
        this._context.drawImage(
            this._images[name],
            0, 0,
            this.width(),
            this.height()
        );
    },

    width: function() { return this._canvas.width; },
    height: function() { return this._canvas.height; },

    clear: function(){
        this._context.fillStyle = "#8999ff";
        this._context.fillRect(0, 0, this.width(), this.height());
    },

    loadImage: function(url, name) {
        'use strict';
        if (!(name && url)) {
            throw new Error('Both url and name must be provided');
        }

        var img = new Image(), def = $.Deferred();

        $(img).one('load', function(){
            $(img).load();
            def.resolve();
            console.debug('"' + name + '" image loaded');
        }).each(function(){
            if (this.complete) $(this).load();
        });

        img.src = url;
        this._images[name] = img;

        return def;
    }
});
