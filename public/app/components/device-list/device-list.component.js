angular.module("app")
	.component('deviceList', {
		templateUrl: 'app/components/device-list/device-list.html',
		controller: DeviceListController
	});

DeviceListController.$inject = ['$scope', '$http', 'deviceService'];

function DeviceListController($scope, $http, deviceService) {
	$scope.devices = deviceService.query();

	$scope.do = function (component, action) {
		var url = component.url + action.path;
		console.log(url);
		$http.post(url)
			.then(function (response) {
				console.log("POST to " + url + " success");
				console.log(response.data);
				component.status = response.data.status;
				component.statusText = response.data.statusText;
				component.actions = response.data.actions;
			}, function (error) {
				console.error("error on POST to " + url + ": " + error);
			});
	}
}