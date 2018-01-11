angular.module("app")
	.component('roomList', {
		templateUrl: 'app/components/room/room-list.html',
		controller: ['$scope', 'roomService', roomListController]
	});

function roomListController($scope, roomService) {
	$scope.rooms = roomService.query();
}