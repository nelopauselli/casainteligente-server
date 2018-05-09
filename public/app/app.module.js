angular.module("app", ['ngMaterial', 'ngResource', 'chart.js'])
    .config(function ($mdIconProvider, $mdThemingProvider) {
        // $mdThemingProvider.theme('default')
        //     .primaryPalette('indigo')
        //     .accentPalette('pink', {
        //         'default': '500'
        //     });

        $mdThemingProvider.enableBrowserColor({
            hue: '300' // Default is '800'
        });
    });