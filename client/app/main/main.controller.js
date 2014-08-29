'use strict';

var app = angular.module('troveApp');

app.controller('MainCtrl', function ($rootScope, $scope, $location, $http) {

    $scope.errormsg = "";

    $scope.login = function() {
        $http({
            method: 'POST', 
            url: '/auth/login',
            data: {
                username: $scope.username,
                password: $scope.password
            }
        }).success(function (response) {
            $scope.errormsg = "";
            $http.get('/api/users/' + response.username + '/info').success(function (user) {

                $rootScope.currentUser = user;
                $location.path('/dashboard/rotation');
                
            });
        }).error(function (error) {
            $scope.errormsg = "Error loggin in.";
        });
    };
    
});
