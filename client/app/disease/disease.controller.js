'use strict';

var app = angular.module('troveApp');

app.controller('DiseaseCtrl', function ($rootScope, $scope, $http, $location, $timeout, diseaseValues) {

    if (!$rootScope.currentUser) {
        $location.path('/');
    }
    $scope.currentUser = $rootScope.currentUser;

    $scope.data = {};

    // set user name
    $scope.data.name = $rootScope.currentUser.alt_name;

    // get # minnies
    $scope.minnies = 0;
    if ($rootScope.minnies > 0) {
        $scope.minnies = $rootScope.minnies;
    } else {
        $scope.minnies = 0;
        $http.get('/api/users/' + $scope.currentUser.username + '/minnies').success(
            function (minnies) {
                $scope.minnies = minnies;
                $rootScope.minnies = minnies;
            }
        );
    }

    // feedback box control
    $scope.feedbackBoxShow = false;

    // initializes popup/modal window for badges
    $scope.badgesListShowBoolean = false;
    $scope.badgesListShow = function() {
        $http.get('/api/users/' + $scope.currentUser.username + '/badges/get').success(function (badges) {
            $scope.badges = badges;
        });
        $scope.badgesListShowBoolean = true;
        $scope.$apply();
    };
    $scope.badgesListClose = function() {
        $scope.badgesListFadeOutBoolean = true;
        $timeout(function() {
            $scope.badgesListShowBoolean = false;
            $scope.badgesListFadeOutBoolean = false;
            $scope.$apply();
        }, 1000);
    };

    // send feedback message to slack using webhooks
    $scope.sendFeedback = function() {
        var text = "";
        if ($scope.fmsg) {
            text = $scope.fmsg;
            if ($scope.fname) {
                text = text + "\n-- " + $scope.fname;
            }
            $http({
                method: 'POST',
                url: 'https://trovedashboard.slack.com/services/hooks/incoming-webhook?token=gxdkEcqtMaHg9jP9ZV87uuV8',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                transformRequest: function(obj) {
                    var str = [];
                    for(var p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                },
                data: {payload: JSON.stringify({text: text, username: "feedback", channel: "#feedback"})}
            }).success(function() {})
            .error(function() {
                console.log("error sending feedback message.");
            });
        }
    };

    $scope.rotationView = function() {
        $location.path('/dashboard/rotation');
    };


    
    $scope.rotation_id = null;  

    $scope.getSelected = function(rotation_id) {
        return (rotation_id == $scope.rotation_id) ? 'selectedRotation': '';
    }

    $scope.updateChart = function(rotation_id) {
        console.log('did i get called');
        $scope.rotation_id = rotation_id;
        $scope.diseaseData = diseaseValues[rotation_id];
    };

    $scope.updateChart('BODY CT');
});