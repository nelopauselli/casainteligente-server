angular.module("app")
	.component('roomAdd', {
		templateUrl: 'app/components/room/room-add.html',
		controller: ['$scope', 'roomService', roomAddController]
	});

function roomAddController($scope, roomService) {
	$scope.room = {title: '', image: '', text: ''};
	$scope.save = function() {
		console.log("Guardando..");

		var room = $scope.room;
		console.log(room);
		roomService.save(room, function(){
			location.reload();
		});
	}
}