module.exports = function(RED) {
    function Workouts(config) {
        RED.nodes.createNode(this, config);
        this.user = config.user;
        this.password = config.password;
        var node = this;
        node.on('input', function(msg) {
            msg.payload = node.user + " " + node.password + " " + msg.payload.toLowerCase();
            node.send(msg);
        });
    }

    RED.nodes.registerType("Workouts", Workouts);
}
