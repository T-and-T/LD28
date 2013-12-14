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

    displayImage: function displayImage(name) {
        this._context.drawImage(this._images[name], 0, 0);
    },

    loadImage: function(url, name) {
        'use strict';
        if (!(name && url)) {
            throw new Error('Both url and name must be provided');
        }

        var img = new Image(), def = $.Deferred();

        $(img).one('load', function(){
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
