angular.module("app")
	.component('metricDetail', {
		templateUrl: 'app/components/metric-detail/metric-detail.html',
		controller: MetricDetailController,
		bindings: {
			metric: '<'
		}
	});

MetricDetailController.$inject = ['$scope', 'socket'];

function MetricDetailController($scope, socket) {
	ctrl = this;

	ctrl.$onInit = function () {
		console.log(ctrl.metric);
		$scope.metric = ctrl.metric;

		socket.on('events', function (args) {
			var data = JSON.parse(args);

			if ($scope.metric.topic == data.topic) {
				console.log(data);

				var m = JSON.parse(data.message);
				console.log(m);
				$scope.metric.value = m[$scope.metric.property];
			}
		});
	};
}