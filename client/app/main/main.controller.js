'use strict';

var app = angular.module('troveApp');

app.controller('MainCtrl', function ($rootScope, $scope, $location) {

    $scope.login = function() {
        $rootScope.currentUser = {
            'fullName': 'Liyang Leon Chen',
            'altName': 'Leon Chen',
            'userId': 355
        };

        $location.path('/dashboard/rotation');
    };
    
});
