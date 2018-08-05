angular.module("app")
	.component('setup', {
		templateUrl: 'app/components/setup/setup.html',
		controller: SetupController
	});

SetupController.$inject = ['$scope', '$mdDialog', '$http'];

function SetupController($scope, $mdDialog, $http) {
	ctrl = this;

	$scope.openAddDevice = function (ev) {
		$scope.settings = {
			ssid: 'Positano', password: '',
			mqttConnectionString: 'mqtt://@192.168.1.10:1883',
			mqttTopicBase: '/casa',
			deviceName: '',
			serverAddress: '192.168.1.10',
			serverPort: 80
		};
		$scope.searching = false;
		$scope.connected = false,

			$mdDialog.show({
				contentElement: '#newDevicePopup',
				parent: angular.element(document.body),
				targetEvent: ev,
				clickOutsideToClose: false
			}).then(function () {
				var url = 'http://192.168.4.1/';

				$http({
					method: 'POST',
					url: url,
					headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
					transformRequest: function (obj) {
						var str = [];
						for (var p in obj)
							str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
						return str.join("&");
					},
					data: $scope.settings
				}).then(function (response) {
					$scope.message = "Dispositivo agregado";
				}, function (error) {
					$scope.settings.message = error.toString();
				});
			}, function () {

			});
	}

	$scope.searchDevice = function () {
		$scope.searching = true;
		var loop = setInterval(function () {
			$http.get('http://192.168.4.1/')
				.then(function (response) {
					if (response.data === "I'm a IoT Device") {
						$scope.searching = false;
						$scope.connected = true;
						clearInterval(loop);
					}
				}, function (error) {
					console.log(error);
				});
		}, 1000);
	}

	$scope.cancel = function () {
		$mdDialog.cancel();
	}

	$scope.configure = function () {
		$mdDialog.hide();
	}
}