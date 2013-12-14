var CanvasInterface;


CanvasInterface = Class.extend({
    _canvas: null,
    _context: null,

    init: function init(canvas_id) {
        'use strict';
        this._canvas = document.getElementById(canvas_id);
        console.assert(this._canvas);

        this._context = this._canvas.getContext('2d');
    },

    displayImage: function displayImage(url) {
        this._context.drawImage(url, 0, 0, this._canvas.width, this._canvas.height);
        //
    },

    loadImage: function(filename) {
        var img = new Image();
        img.src = filename;
        return img;
    }
});
