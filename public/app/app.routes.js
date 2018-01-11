var app = angular.module("app");

app.factory('Room', ['$resource', function ($resource) {
	return $resource('api/rooms/:roomId', {}, {
		query: {
			method: 'GET',
			params: { roomId: '' },
			isArray: true
		}
	});
}]);

app.controller('HomeCtrl', ['$scope', function ($scope) {
	
}]);

app.controller('RoomCtrl', function ($scope, socket) {
	socket.emit('status', '192.168.1.104');

	socket.on('status', function (msg) {
		var json = JSON.parse(msg);
		for (var i = 0; i < json.relays.length; i++) {
			var relay = json.relays[i];
			var device = {
				id: 1,
				image: 'extractor.png',
				name: relay.label,
				status: relay.status == "on" ? "encendido" : "apagado",
				offAt: relay.offAt,
				actions: [
					{ title: 'Encender', enabled: relay.status == "off", ip: '192.168.1.104', led: 1 },
					{ title: 'Apagar', enabled: relay.status == "on", ip: '192.168.1.104', led: 1 }
				]
			};
			$scope.devices.push(device);
		}
	});

	$scope.devices = [
		{
			id: 1, image: 'extractor.png', name: 'Extractor', status: 'Encendido',
			offAt: Date(),
			actions: [
				{ title: 'Encender', enabled: false, ip: '192.168.1.104', led: 1 },
				{ title: 'Apagar', enabled: true, ip: '192.168.1.104', led: 1 }
			]
		},
		{
			id: 2, image: 'toallero.jpg', name: 'Toallero', status: 'Apagado',
			actions: [
				{ title: 'Encender', enabled: true, ip: '192.168.1.104', led: 2 },
				{ title: 'Apagar', enabled: false, ip: '192.168.1.104', led: 2 }
			]
		},
	];
	$scope.invoke = function (action) {
		console.log(action);
		socket.emit('toggle', JSON.stringify(action));
	}
});
app.controller('SettingsCtrl', function ($scope) {
});