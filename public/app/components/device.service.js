angular.module("app")
	.factory('deviceService', DeviceService);

DeviceService.$inject = ['$resource'];

function DeviceService($resource) {
	return $resource('api/device/:deviceId', { deviceId: '@id' });
}