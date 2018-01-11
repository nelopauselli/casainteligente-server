angular.module("app").factory('roomService', ['$resource', roomService]);

function roomService($resource) {
	return $resource('api/room/:roomId', {roomId: '@id'});
}