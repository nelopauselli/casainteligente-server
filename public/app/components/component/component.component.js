angular.module("app")
	.component('component', {
		templateUrl: 'app/components/component/component.html',
		controller: ComponentController,
		bindings: {
			component: '<'
		}
	});

ComponentController.$inject = ['$scope', 'socket'];

function ComponentController($scope, socket) {
	ctrl = this;

	ctrl.$onInit = function () {
		socket.on('events', function (args) {
			var data = JSON.parse(args);

			if ($scope.topic == data.topic) {
				$scope.state = data.message;
			}
		});

		socket.emit('action', JSON.stringify({ topic: $scope.topic, body: 'state' }));
	};

	ctrl.$onChanges = function () {
		$scope.name = ctrl.component.name;
		$scope.topic = ctrl.component.topic;
		$scope.state = ctrl.component.state;
		$scope.status = ctrl.component.status;
		$scope.actions = ctrl.component.actions;
	};

	$scope.invoke = function (topic, action) {
		socket.emit('action', JSON.stringify({ topic: topic, body: action }));
	}
}