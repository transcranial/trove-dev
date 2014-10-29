'use strict';

angular.module('troveApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  //'btford.socket-io',
  'ui.bootstrap',
  'ngTouch',
  'bardo.directives',
  'ngTable',
  'diff',
  'ngIdle'
])
  .config(function ($routeProvider, $locationProvider, $keepaliveProvider, $idleProvider) {
    $routeProvider
      .otherwise({
        redirectTo: '/'
      });

    $locationProvider.html5Mode(true);

    $idleProvider.idleDuration(600);
    $idleProvider.warningDuration(0);
    $keepaliveProvider.interval(10);
  });