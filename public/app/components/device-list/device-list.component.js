angular.module("app")
	.component('deviceList', {
		templateUrl: 'app/components/device-list/device-list.html',
		controller: DeviceListController
	});

DeviceListController.$inject = ['$scope', '$http', 'deviceService'];

function DeviceListController($scope, $http, deviceService) {
	$scope.devices = deviceService.query();

	$scope.do = function (component, action) {
		console.log(action.url);
		$http.post(action.url)
			.then(function (response) {
				console.log("POST to " + action.url + " success");
				console.log(response.data);
				component.status = response.data.status;
			}, function (error) {
				console.error("error on POST to " + action.url + ": "+error);
			});
	}
}