'use strict';

angular.module('troveApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/dashboard/rotation', {
        templateUrl: 'app/rotation/rotation.html',
        controller: 'RotationCtrl'
      });
  });