angular.module("app")
	.component('roomDetail', {
		templateUrl: 'app/components/room-detail/room-detail.html',
		controller: RoomDetailController,
		bindings: {
			room: '<'
		}
	});

RoomDetailController.$inject = ['$scope', 'socket'];

function RoomDetailController($scope, socket) {
	ctrl = this;

	ctrl.$onInit = function () {
		console.log(ctrl.room);
		$scope.room = ctrl.room;
	};
}