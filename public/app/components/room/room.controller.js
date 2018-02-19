angular.module("app")
.controller('RoomCtrl', roomController);

function roomController($scope, socket) {
	socket.emit('status', '192.168.1.112');

	socket.on('status', function (msg) {
		var json = JSON.parse(msg);
		console.log(json);

		for (var i = 0; i < json.relays.length; i++) {
			var relay = json.relays[i];
			var device = {
				id: 1,
				image: 'extractor.png',
				name: relay.label,
				status: relay.status == "on" ? "encendido" : "apagado",
				offAt: relay.offAt,
				actions: [
					{ title: 'Encender', enabled: relay.status == "off", ip: '192.168.1.112', led: 1 },
					{ title: 'Apagar', enabled: relay.status == "on", ip: '192.168.1.112', led: 1 }
				]
			};
			$scope.devices.push(device);
		}
	});

	$scope.devices = [];

	$scope.invoke = function (action) {
		console.log(action);
		socket.emit('toggle', JSON.stringify(action));
	}
}