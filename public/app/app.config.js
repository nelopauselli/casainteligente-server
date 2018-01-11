angular.module("app")
	.config(function ($routeProvider, $locationProvider) {
		$routeProvider
			.when('/', {
				templateUrl: 'app/components/home/home.html',
				controller: 'HomeCtrl'
			})
			.when('/settings', {
				templateUrl: 'app/components/settings/settings.html',
				controller: 'SettingsCtrl'
			})
			.when('/room', {
				templateUrl: 'app/components/room/room.html',
				controller: 'RoomCtrl'
			})
			.otherwise({
				redirectTo: '/'
			});

		// configure html5 to get links working on jsfiddle
		$locationProvider.html5Mode({
			enabled: true,
			requireBase: false
		});
	});
