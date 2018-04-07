angular.module("app")
	.component('deviceDetail', {
		templateUrl: 'app/components/device-detail/device-detail.html',
		controller: DeviceDetailController,
		bindings: {
			device: '<'
		}
	});

DeviceDetailController.$inject = ['$scope', 'socket'];

function DeviceDetailController($scope, socket) {
	ctrl = this;

	ctrl.$onInit = function () {
		console.log(ctrl.device);
		$scope.device = ctrl.device;

		socket.on('events', function (args) {
			var data = JSON.parse(args);

			if ($scope.device.status == data.topic) {
				console.log(data);
				$scope.device.state = data.message;
			}
		});

		socket.emit('action', JSON.stringify({ topic: $scope.device.topic, body: 'state' }));
	};

	$scope.invoke = function (topic, action) {
		console.log(topic, action);
		socket.emit('action', JSON.stringify({ topic: topic, body: action }));
	}
}