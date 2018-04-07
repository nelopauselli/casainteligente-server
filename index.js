var express = require('express');
var app = express();
var http = require('http');
var server = http.Server(app);
var io = require('socket.io')(server);
var path = require('path');
var bodyParser = require('body-parser');
var mqtt = require('mqtt')
var client = mqtt.connect('mqtt://192.168.1.10:1883')

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

app.use("/api", require("./controllers"));

app.get("*", function (req, res) {
	res.sendFile(path.join(__dirname, 'public/index.html'))
});

//SOCKET
io.on('connection', function (socket) {
	socket.on('action', function (msg) {
		var args = JSON.parse(msg);
		console.log(args);
		client.publish(args.topic, args.body, function (err, packet) {
			if (err) console.error(err);
		});
	});
});
//SOCKET END

//MQTT
client.on('connect', function () {
	console.log("connected");

	client.subscribe('/cullen/#', function (err, granted) {
		if (err) console.error(err);
	});
});

client.on('message', function (topic, message) {
	console.log(topic, ": ", message.toString());
	io.sockets.emit("events", JSON.stringify({ topic: topic, message: message.toString() }));
});
//MQTT END

require('dns').lookup(require('os').hostname(), function (err, add, fam) {
	console.log('addr: ' + add);
});

var port = process.env.PORT || 3000;
server.listen(port, function () {
	console.log('listening on *:' + port);
});