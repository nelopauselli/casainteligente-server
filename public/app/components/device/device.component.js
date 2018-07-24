angular.module("app")
	.component('device', {
		templateUrl: 'app/components/device/device.html',
		controller: DeviceController,
		bindings: {
			device: '<'
		}
	});

DeviceController.$inject = ['$scope', 'socket'];

function DeviceController($scope, socket) {
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
			$scope.name = changes.device.currentValue.name;
			$scope.ip = changes.device.currentValue.ip;
			$scope.status = changes.device.currentValue.status;
			$scope.topic = changes.device.currentValue.topic;
			$scope.components = changes.device.currentValue.components;
			$scope.metrics = changes.device.currentValue.metrics;
		}
	};

	$scope.invoke = function (topic, action) {
		socket.emit('action', JSON.stringify({ topic: topic, body: action }));
	}
}