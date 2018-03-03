angular.module("app")
    .component('clock', {
        templateUrl: 'app/components/clock/clock.html',
        controller: ClockController
    });

ClockController.$inject = ['$scope', '$interval'];

function ClockController($scope, $interval) {
    var tick = function () {
        $scope.clock = Date.now();
    }
    tick();
    $interval(tick, 1000);
}
