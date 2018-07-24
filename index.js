var express = require('express'),
	dns = require('dns'),
	os = require('os');

var hostname = os.hostname();
var app = express();
var http = require('http');
var server = http.Server(app);
var io = require('socket.io')(server);
var path = require('path');
var bodyParser = require('body-parser');
var mqtt = require('mqtt');
var client = mqtt.connect('mqtt://192.168.1.10:1883');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function (req, res, next) {
	if (req.headers["content-type"] == "text/plain") {
		req.setEncoding('utf8');
		req.body = '';
		req.on('data', function (chunk) {
			req.body += chunk;
		});
		req.on('end', function () {
			next();
		});
	}
	else {
		next();
	}
});

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

var port = process.env.PORT || 3000;
server.listen(port, function () {
	dns.lookup(hostname, function (err, addr, fam) {
		if (err) console.error(err);
		else console.log(`listening on ${addr}:${port}`);
	});
});

//MQTT
client.on('connect', function () {
	console.log("conexión establecida con broker mqtt")
	client.subscribe('/#', function (err, granted) {
		if (err) console.error(err);
		else console.log(`subscripción al topic '/#' ${granted ? 'aceptada' : 'rechazada'}`);
	});

	setTimeout(() => {
		// Le pedimos a los dispositivos que se autoregistren
		dns.lookup(hostname, function (err, addr, fam) {
			if (err) console.error(err);
			else {
				var target = `${addr}:${port}`;
				client.publish("/devices/search", target, function (err) {
					if (err) console.error(err);
					else console.log("buscando dispositivos...");
				});
			}
		});
	}, 1000);
});
//MQTT END