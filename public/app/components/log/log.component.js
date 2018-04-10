angular.module("app")
	.component('log', {
		templateUrl: 'app/components/log/log.html',
		controller: LogController,
		bindings: {
			max: '<'
		}
	});

LogController.$inject = ['$scope', 'socket'];

function LogController($scope, socket) {
	var ctrl = this;

	ctrl.$onInit = function () {
		if (ctrl.max == undefined) ctrl.max = 50;

		$scope.logs = [];
		$scope.index = 0;
		socket.on('logs', function (message) {
			console.log(message);
			$scope.logs.push({ id: $scope.index++, message: message });

			if ($scope.logs.length > ctrl.max) {
				$scope.logs.shift();
			}
		});
	}
}