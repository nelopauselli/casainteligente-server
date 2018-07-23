var express = require('express');
var app = express();
var http = require('http');
var server = http.Server(app);
var io = require('socket.io')(server);
var path = require('path');
var bodyParser = require('body-parser');
var mqtt = require('mqtt');
var client = mqtt.connect('mqtt://192.168.1.10:1883');
//var client = mqtt.connect('mqtt://hvzaieuu:ka6xSDCDNxJe@m13.cloudmqtt.com:10600')

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
	console.log(`[${req.method}] ${req.url}`);
	next();
});

app.use("/esp/update", require("./ota"));
app.use("/api", require("./controllers")(io, client));

app.get("*", function (req, res) {
	console.error(req.path + " not found.");
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

	client.subscribe('/#', function (err, granted) {
		if (err) console.error(err);
	});

	client.publish("/devices/search", "definanse!", function (err, result) {
		if (err) console.error(err);
		else
			console.log("Buscando dispositivos");
	});
});
//MQTT END

var port = process.env.PORT || 3000;
server.listen(port, function () {
	require('dns').lookup(require('os').hostname(), function (err, addr, fam) {
		console.log(`listening on ${addr}: ${port}`);
	});
});