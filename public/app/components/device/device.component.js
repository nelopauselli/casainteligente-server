angular.module("app")
	.component('device', {
		templateUrl: 'app/components/device/device.html',
		controller: DeviceController,
		bindings: {
			device: '<'
		}
	});

DeviceController.$inject = ['$scope', '$http', 'socket'];

function DeviceController($scope, $http, socket) {
	ctrl = this;

	$scope.events = [];
	ctrl.$onInit = function () {
		socket.on('message', function (args) {
			var data = JSON.parse(args);
			if ($scope.topic == data.topic) {
				$scope.state = data.message;
			}
		});

		socket.on('status', function (args) {
			var data = JSON.parse(args);
			if ($scope.ip == data.ip) {
				$scope.status = data.status;
			}
		});

		socket.on('events', function (args) {
			var data = JSON.parse(args);
			if ($scope.ip == data.ip) {
				$scope.events.push(data);
			}
		});
	};

	ctrl.$onChanges = function (changes) {
		if (changes.device.currentValue) {
			var device = changes.device.currentValue;
			$scope.name = device.name;
			$scope.ip = device.ip;
			$scope.status = device.status;
			$scope.topic = device.topic;
			$scope.components = device.components;
			$scope.metrics = device.metrics;

			$scope.cfg = {
				wifis: [{ ssid: device.wifi0, password: '' }, { ssid: device.wifi1, password: '' }],
				mqttConnectionString: device.mqttConnectionString,
				deviceName: device.name,
				mqttTopicBase: device.mqttTopicBase,
				serverAddress: device.serverAddress,
				serverPort: device.serverPort,
				otaPath: device.otaPath,
				components: device.components
			}
		}
	};

	$scope.invoke = function (topic, action) {
		socket.emit('action', JSON.stringify({ topic: topic, body: action }));
	}

	$scope.saveConectivity = function () {
		var url = 'http://' + $scope.ip + '/';
		var settings = { deviceName: $scope.cfg.deviceName };

		console.log(settings);
		
		$http({
			method: 'POST',
			url: url,
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			transformRequest: function (obj) {
				var str = [];
				for (var p in obj)
					str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
				return str.join("&");
			},
			data: settings
		}).then(function (response) {
			$scope.message = "Dispositivo configurado";
		}, function (error) {
			console.error(error);
			$scope.message = error.toString();
		});
	}
}