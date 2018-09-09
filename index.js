var express = require('express'),
	dns = require('dns'),
	os = require('os'),
	mqtt = require('mqtt'),
	http = require('http');

var hostname = os.hostname();
var app = express();

var server = http.Server(app);
var io = require('socket.io')(server);
var path = require('path');
var bodyParser = require('body-parser');

//MQTT
var client = mqtt.connect('mqtt://192.168.0.127:1883');
client.on('connect', function () {
	console.log("conexión establecida con broker mqtt")
	client.subscribe('/#', function (err, granted) {
		if (err) console.error(err);
		else console.log(`subscripción al topic '/#' ${granted ? 'aceptada' : 'rechazada'}`);
	});
});
//MQTT END

function discovery(target) {
	// Le pedimos a los dispositivos que se autoregistren
	client.publish("/devices/search", target, function (err) {
		if (err) console.error(err);
		else console.log("buscando dispositivos...");
	});
}

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

var worker = require("./workers/forwardWorker")(client);

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
		else {
			console.log(`listening on ${addr}:${port}`);

			// Invitamos a los dispositivos a registrarse, los volvemos a invitar en 5 segundo y luego, cada 30 minutos repetimos la invitación.
			var target = `${addr}:${port}`;
			discovery(target);
			setTimeout(function () {
				discovery(target);
				setTimeout(function () {
					discovery(target);
				}, 60 * 1000);
			}, 10 * 1000);
		}
	});
});