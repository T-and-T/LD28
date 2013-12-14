var JukeBox;


JukeBox = Class.extend({
    _tracks: {},
    _playing: false,

    init: function() {},

    playTrack: function(name, loop) {
        loop = loop || false; // default to not looping

        if (!this._tracks[name]) {
            console.warning("No such track as " + name + " has been loaded");
            return;
        }

        this._tracks[name].play();
    },

    stopAll: function(){
        if (_playing) {
            for (var cur_name in this._tracks) {
                this._tracks[cur_name].stop();
            }
        }
    },

    loadAudio: function(url) {
        var name,
            audio = new Audio();
        audio.src = url;
        audio.preload = 'yes';

        // i want to stay away from regex... - Dom
        name = url.split('/');
        name = name[name.length].split('.');
        name = name[0];

        // audio's are stored within the JukeBox
        this._tracks[name] = audio;
    }
});
