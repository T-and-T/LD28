var CanvasInterface;


CanvasInterface = Class.extend({
    _canvas: null,
    _context: null,

    init: function init(canvas_id) {
        'use strict';
        this._canvas = document.getElementById(canvas_id);
        console.assert(this._canvas);

        this._context = this._canvas.getContext('2d');
        debugger;
    },

    displayImage: function displayImage(url) {
        this._context.drawImage(url, 0, 0, this._canvas.width, this._canvas.height);
        //
    }
});