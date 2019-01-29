module.exports = function(RED) {
    const authenticate = require('endomondo-unofficial-api').authenticate;
    const workouts = require('endomondo-unofficial-api').workouts;
    const workoutGet = require('endomondo-unofficial-api').workout.get;
    const workoutSet = require('endomondo-unofficial-api').workout.set

    function WorkoutsNode(config) {
        RED.nodes.createNode(this, config);
        this.user = config.user;
        this.password = config.password;
        this.index = config.index;
        var node = this;
        node.on('input', function(msg) {

            var _auth;
            var _workouts;
            var _workout;

            msg.payload = undefined;
            msg.data = {};

            authenticate({email: node.user, password: node.password})
            .then((result) => {
                _auth = result;
                msg.data.auth = _auth;
                return result;
            })
            .then((result) => {
                return workouts({authToken: _auth.authToken});
            })
            .then((result) => {
                _workouts = result;
                msg.data.workouts = _workouts;
                return result;
            })
            .then((result) => {
                return workoutGet({authToken: _auth.authToken, workoutId: _workouts.data[node.index].id});
            })
            .then((result) => {
                _workout = result;
                msg.data.workout = _workout;

                /* use format of official msg convention */
                msg.payload = {};
                msg.payload.id = _workout.id;                             // The ID of the activity in the given fitness system/API
                msg.payload.type = _workout.sport;                        // The type of the activity, example: run/cycle ride
                msg.payload.duration = _workout.duration;                 // Duration of the activity in seconds
                msg.payload.distance = _workout.distance;                 // Distance of activity in metres
                msg.payload.calories = _workout.calories;                 // Calories burned during activity in kilocalories
                msg.payload.starttime = new Date(_workout.start_time);    // JavaScript Date object representing the start time of the activity

                node.send(msg);
                return result;
            })
            .catch((cause) => {
                msg.data.err = cause;
                node.send(msg);
            });
        });

    }

    RED.nodes.registerType("GetWorkout", WorkoutsNode);
}
