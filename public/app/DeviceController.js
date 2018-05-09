angular.module("app")
    .controller('DeviceController', DeviceController);

DeviceController.$inject = ['$scope', '$mdSidenav', 'deviceService'];

function DeviceController($scope, $mdSidenav, deviceService) {
    $scope.devices = deviceService.query(function () {
            $scope.current = $scope.devices[0];
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