angular.module("app")
	.component('roomList', {
		templateUrl: 'app/components/room/room-list.html',
		controller: ['$scope', 'Room', function RoomListController($scope, Room) {
			$scope.rooms = Room.query();
		}]
	});
