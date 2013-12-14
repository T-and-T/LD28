var JukeBox;


JukeBox = Class.extend({
    _tracks: {},
    _playing: false,

    init: function() {},

    playTrack: function(name, loop) {
        'use strict';
        loop = loop || false; // default to not looping

        if (!this._tracks[name]) {
            console.warning("No such track as " + name + " has been loaded");
            return;
        }

        this._tracks[name].play();
    },

    stopAll: function(){
        'use strict';
        for (var cur_name in this._tracks) {
            this._tracks[cur_name].stop();
        }
    },

    loadAudio: function(url, name) {
        'use strict';
        if (!(name && url)) {
            throw new Error('Both url and name must be provided');
        }

        var audio = new Audio(), def = $.Deferred();

        $(audio).one('loadeddata', function(){
            def.resolve();
            console.debug('"' + name + '" audio loaded');
        }).each(function(){
            debugger;
            if (this.complete) $(this).load();
        });

        audio.src = url;
        audio.preload = 'yes';

        // audio's are stored within the JukeBox
        this._tracks[name] = audio;

        return def;
    }
});
