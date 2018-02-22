var express = require('express');
var app = express();
var http = require('http');
var server = http.Server(app);
var io = require('socket.io')(server);
var path = require('path');
var bodyParser = require('body-parser');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

app.use("/api", require("./controllers"));

app.get("*", function (req, res) {
	res.sendFile(path.join(__dirname, 'public/index.html'))
});

io.on('connection', function (socket) {
	console.log('a user connected');
	socket.on('disconnect', function () {
		console.log('user disconnected');
		io.emit('chat message', 'a user disconnect');
	});
	socket.on('status', function (msg) {
		console.log('message: ' + msg);

		var target = msg;

		var url = "http://" + target + "/status.json";
		http.get(url, function (resp) {
			let data = '';

			// A chunk of data has been recieved.
			resp.on('data', (chunk) => {
				data += chunk;
			});

			// The whole response has been received. Print out the result.
			resp.on('end', () => {
				console.dir(JSON.parse(data));
				socket.emit('status', data);
			});

		}).on("error", (err) => {
			console.log("Error: " + err.message);
		});
	});
	socket.on('toggle', function (msg) {
		console.log('message: ', msg);
		var json = JSON.parse(msg);

		var target = json.ip;
		var led = json.led;

		var options = {
			host: target,
			port: 80,
			path: "/toggle",
			method: 'POST',
			headers: {
				'User-Agent': 'IoT-Hub',
				'Content-Type': 'application/x-www-form-urlencoded',
				'Content-Length': '5'
			}
		};

		var req = http.request(options, function (res) {
			let data = "";

			console.log('Status: ' + res.statusCode);
			console.log('Headers: ' + JSON.stringify(res.headers));
			res.setEncoding('utf8');
			res.on('data', function (chunk) {
				console.dir("data", chunk);
				data += chunk;
			});
			res.on('end', () => {
				console.dir("end", data);
				socket.emit('status', data);
			});
		});
		req.on('error', function (e) {
			console.log('problem with request: ' + e.message);
		});
		// write data to request body
		var body = 'led=' + led;
		console.log(body);
		req.write(body);
		req.end();
	});
	socket.on('join', function (msg) {
		console.log('join: ', msg);
		socket.emit('messages', 'Hello from server');
	})
});

require('dns').lookup(require('os').hostname(), function (err, add, fam) {
	console.log('addr: ' + add);
});

var port = process.env.PORT || 3000;
server.listen(port, function () {
	console.log('listening on *:' + port);
});