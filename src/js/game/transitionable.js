Transitionable = Class.Mixin.create({
    inverseStateEnum: _.once(function(){

        var obj = {};
        for(var name in this.stateEnum) {
            obj[this.stateEnum[name]] = name;
        }
        return obj;
    }),

    transitionTo: function(name) {
        var transitions = this.transitions,
            inverse = this.inverseStateEnum(),
            currentStateName = inverse[this._current_state];

        if (!transitions[currentStateName]) {
            console.warn('Cannot transition away from '+name);
            return;
        }

        var possible_transitions = transitions[currentStateName];
        if (possible_transitions.indexOf(name) >= 0) {
            console.debug('' + currentStateName + ' -> ' + name);
            document.getElementById('game_state').textContent = name;
            this._current_state = this.stateEnum[name];
        } else {
            console.warn('Invalid transition from ' + currentStateName + ' to ' + name);
        }
    },

    inState: function(name){
        return this.inverseStateEnum()[this._current_state] == name;
    }
});
