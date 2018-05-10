angular.module("app")
	.component('logs', {
		templateUrl: 'app/components/logs/logs.html',
		controller: LogsController,
		bindings: {
			topic: '<',
			max: '<'
		}
	});

LogsController.$inject = ['$scope', 'socket'];

function LogsController($scope, socket) {
	var ctrl = this;

	ctrl.$onInit = function () {
		if (ctrl.max == undefined) ctrl.max = 50;

		$scope.logs = [];
		$scope.index = 0;
		socket.on('events', function (args) {
			console.log(args);
			var data = JSON.parse(args);

			if (data.topic.startsWith(ctrl.topic)) {
				$scope.logs.push({ id: $scope.index++, topic: data.topic, message: data.message });
				if ($scope.logs.length > ctrl.max) {
					$scope.logs.shift();
				}
			}
		});
	}

	$scope.filterBy = function (topic) {
		$scope.search = { topic: topic };
	}
	$scope.unfilter = function (topic) {
		$scope.search = undefined;
	}
}