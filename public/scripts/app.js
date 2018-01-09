var app = angular.module('smartHome', ['ngRoute']);
app.factory('socket', function ($rootScope) {
	var socket = io.connect();
	return {
		on: function (eventName, callback) {
			socket.on(eventName, function () {
				var args = arguments;
				$rootScope.$apply(function () {
					callback.apply(socket, args);
				});
			});
		},
		emit: function (eventName, data, callback) {
			socket.emit(eventName, data, function () {
				var args = arguments;
				$rootScope.$apply(function () {
					if (callback) {
						callback.apply(socket, args);
					}
				});
			})
		}
	};
});

app.controller('HomeCtrl', function ($scope) {
	$scope.rooms = [
		{ id: 1, image: 'images/banio.png', title: 'Baño', text: 'Bla bla bla' },
		{ id: 2, image: 'images/patio.png', title: 'Patio', text: 'Bla bla bla' }
	];
});
app.controller('RoomCtrl', function ($scope, socket) {
	socket.emit('status', '192.168.1.104');

	socket.on('status', function (msg) {
		var json = JSON.parse(msg);
		for (var i = 0; i < json.relays.length; i++) {
			var relay = json.relays[i];
			var device = {
				id: 1,
				image: 'images/extractor.png',
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
			id: 1, image: 'images/extractor.png', name: 'Extractor', status: 'Encendido',
			offAt: Date(),
			actions: [
				{ title: 'Encender', enabled: false, ip: '192.168.1.104', led: 1 },
				{ title: 'Apagar', enabled: true, ip: '192.168.1.104', led: 1 }
			]
		},
		{
			id: 2, image: 'images/toallero.jpg', name: 'Toallero', status: 'Apagado',
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

app.config(function ($routeProvider, $locationProvider) {
	$routeProvider
		.when('/', {
			templateUrl: 'pages/home.html',
			controller: 'HomeCtrl'
		})
		.when('/settings', {
			templateUrl: 'pages/settings.html',
			controller: 'SettingsCtrl'
		})
		.when('/room', {
			templateUrl: 'pages/room.html',
			controller: 'RoomCtrl'
		})
		.otherwise({
			redirectTo: '/'
		});

	// configure html5 to get links working on jsfiddle
	$locationProvider.html5Mode({
		enabled: true,
		requireBase: false
	});
});
