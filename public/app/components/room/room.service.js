angular.module("app").factory('roomService', ['$resource', roomService]);

function roomService($resource) {
	return $resource('api/rooms/:roomId', {}, {
		query: {
			method: 'GET',
			params: { roomId: '' },
			isArray: true
		}
	});
}