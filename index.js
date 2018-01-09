var express = require('express');
var app = express();
var http = require('http');
var server = http.Server(app);
var io = require('socket.io')(server);
var path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

app.get("/data/main", function(req, res){
	var data = [];
	data.push({id: 1, image: 'banio.png', title: 'Baño', text: 'Bla bla bla'});
	data.push({id: 2, image: 'patio.png', title: 'Patio', text: 'Bla bla bla'});
	res.json(data);
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
});

var port = process.env.PORT || 3000;
server.listen(port, function () {
	console.log('listening on *:' + port);
});