angular.module("app")
    .controller('DeviceController', DeviceController);

DeviceController.$inject = ['$scope', '$mdSidenav', '$mdDialog', '$http', 'deviceService', 'socket'];

function DeviceController($scope, $mdSidenav, $mdDialog, $http, deviceService, socket) {
    $scope.devices = deviceService.query(function () {
        $scope.current = $scope.devices[0];
    });

    socket.on('status', function (args) {
        console.log(args);
        var data = JSON.parse(args);
        var device = $scope.devices.find(d => d.ip == data.ip);
        if (device) {
            device.status = data.status;
        }
    });

    $scope.select = select;
    $scope.toggleMenu = toggleMenu;

    function select(device) {
        $scope.current = device;
    }

    function toggleMenu() {
        $mdSidenav("left").toggle();
    };


}