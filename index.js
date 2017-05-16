module.exports = function(RED) {
    function Workouts(config) {
        RED.nodes.createNode(this, config);
        this.user = config.user;
        this.password = config.password;
        var node = this;
        node.on('input', function(msg) {
            /* connect to endomondo */
            const auth = await authenticate({email: node.user, password: node.password});
            console.log(auth);
            msg.payload = auth;
            node.send(msg);
        });
    }

    RED.nodes.registerType("Workouts", Workouts);
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
