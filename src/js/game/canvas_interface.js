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

    loadImage: function(filename, name) {
        var img = new Image();
        img.src = filename;
        return this._images[name] = img;
    }
});
