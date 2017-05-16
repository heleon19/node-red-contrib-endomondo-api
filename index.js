

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
                msg.payload.starttime = Date.parse(_workout.start_time);  // JavaScript Date object representing the start time of the activity

                node.send(msg);
                return result;
            })
            .catch((cause) => {
                msg.data.err = cause;
                node.send(msg);
            });
        });


    }

    RED.nodes.registerType("Workouts", WorkoutsNode);
}


// const main = async() => {
//
//     /* read tracks from gpx file */
//     let tracks = await new Promise((resolve) => gpx.parseGpxFromFile("Current.gpx", (err, data) => {
//       if(err) {
//         console.log("Could not parse GPX file");
//         reject(err);
//       }
//       resolve(data);
//     }));
//
//     /* connect to endomondo */
//     const auth = await authenticate({email: "<username>", password: "<password>"});
//     console.log(auth);
//
//     /* fix / split tracks if long delay between two points */
//     tracks = fixTracks(tracks, 24 * 60, 0.1);
//     console.log("Numbor of tracks: " + tracks.length);
//     //return;
//
//     for(let i = 0; i < tracks.length; i++) {
//         const track = tracks[i];
//
//         /* create new workout, write first couple of points */
//         const step = 20; // write 20 points in one request
//         const newWork = await workoutSet({
//               authToken: auth.authToken,
//               sport:sport.CYCLING,
//               distance: 0,
//               duration: 0,
//               points: track.slice(0, step)
//         });
//         //console.log(newWork);
//
//         /* write remaining points to existing workout */
//         for(let idx = 0; idx < track.length; idx += step)
//         {
//           const ps = track.slice(idx, idx + step);
//           const updWork = await workoutSet({
//                 authToken: auth.authToken,
//                 userId: auth.userId,
//                 workoutId: newWork.workoutId,
//                 sport: sport.CYCLING,
//                 distance: ps[ps.length - 1].dist.all,
//                 duration: (ps[ps.length - 1].time - track[0].time) / 1000,
//                 points: ps
//           });
//           console.log(idx + "-" + (idx + ps.length) + ": " + JSON.stringify(ps[ps.length - 1]));
//
//           /* wait befor sending next points */
//           await new Promise((resolve) => setTimeout(resolve, 100));
//         }
//     }
//
//     /* get a list of all workouts */
//     const works = await workouts({authToken: auth.authToken});
//     console.log(works);
//
//     /* show latest workout */
//     const work = await workoutGet({authToken: auth.authToken, workoutId: works.data[0].id});
//     console.log(work);
//
// };
