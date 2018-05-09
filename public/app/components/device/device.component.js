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

	ctrl.$onInit = function () {
		socket.on('events', function (args) {
			var data = JSON.parse(args);

			if ($scope.status == data.topic) {
				$scope.state = data.message;
			}
		});

		socket.emit('action', JSON.stringify({ topic: $scope.topic, body: 'state' }));
	};

	ctrl.$onChanges = function (changes) {
		if (changes.device.currentValue) {
			$scope.name = changes.device.currentValue.name;
			$scope.topic = changes.device.currentValue.topic;
			$scope.components = changes.device.currentValue.components;
			$scope.metrics = changes.device.currentValue.metrics;
		}
	};

	$scope.invoke = function (topic, action) {
		socket.emit('action', JSON.stringify({ topic: topic, body: action }));
	}
}