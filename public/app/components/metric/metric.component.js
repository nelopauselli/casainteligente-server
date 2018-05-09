angular.module("app")
	.component('metric', {
		templateUrl: 'app/components/metric/metric.html',
		controller: MetricController,
		bindings: {
			metric: '<'
		}
	});

	MetricController.$inject = ['$scope', 'socket'];

function MetricController($scope, socket) {
	ctrl = this;

	ctrl.$onInit = function () {
		$scope.metric = ctrl.metric;

		$scope.legend = $scope.metric.unit;
		$scope.series = [$scope.metric.property];
		$scope.data = [[]];
		$scope.options = {
			animation: false,
			scales: {
				xAxes: [{
					type: 'time'
				}]
			}
		}

		$scope.onClick = function (points, evt) {
			console.log(points, evt);
		};
		
		socket.on('events', function (args) {
			var data = JSON.parse(args);

			if ($scope.metric.topic == data.topic) {
				if ($scope.metric.property) {
					var m = JSON.parse(data.message);
					$scope.metric.value = m[$scope.metric.property];
				}
				else {
					$scope.metric.value = data.message;
				}

				if ($scope.data[0].length > ($scope.metric.bufferSize || 50))
					$scope.data[0].shift();
				$scope.data[0].push({
					x: new Date(),
					y: $scope.metric.value
				});
			}
		});
	};
}