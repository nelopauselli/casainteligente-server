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

    $scope.openAddDevice = function (ev) {
        $scope.newDevice = {
            connected: false,
            ssid: 'Positano', password: '',
            mqttConnectionString: 'mqtt://@192.168.1.10:1883', 
            mqttTopicBase: '/casa',
            deviceName: '',
            serverAddress: '192.168.1.10',
            serverPort: '80'
        };

        $mdDialog.show({
            contentElement: '#newDevicePopup',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true
        });

        var loop = setInterval(function () {
            $http.get('http://192.168.4.1/')
                .then(function (response) {
                    if (response.data === "I'm a IoT Device") {
                        $scope.newDevice.connected = true;
                        clearInterval(loop);
                    }
                }, function (error) {
                    console.log(error);
                });
        }, 1000);
    }

    $scope.setNewDevice = function (device) {
        var url = 'http://192.168.4.1/';

        $http({
            method: 'POST',
            url: url,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            transformRequest: function (obj) {
                var str = [];
                for (var p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            },
            data: device
        }).then(function (response) {
            $scope.newDevice.connected = false;
            $scope.newDevice.message = "dispositivo agregado";
        }, function (error) {
            $scope.newDevice.message = error.toString();
        });
    }

    function select(device) {
        $scope.current = device;
    }

    function toggleMenu() {
        $mdSidenav("left").toggle();
    };


}