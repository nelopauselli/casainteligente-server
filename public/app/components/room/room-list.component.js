angular.module("app")
	.component('roomList', {
		templateUrl: 'app/components/room/room-list.html',
		controller: RoomListController
	});

RoomListController.$inject = ['$scope', 'roomService'];

function RoomListController($scope, roomService) {
	$scope.rooms = roomService.query();
}