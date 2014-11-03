'use strict';

var app = angular.module('troveApp');

app.config(function($routeProvider) {
    $routeProvider
    .when('/dashboard/ACGME', {
        templateUrl:'app/acgme/acgme.html',
        controller:'ACGMECtrl'
    });
});