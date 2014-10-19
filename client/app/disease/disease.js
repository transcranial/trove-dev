'use strict';

var app = angular.module('troveApp');

app.config(function($routeProvider) {
	$routeProvider
	.when('/dashboard/disease', {
		templateUrl:'app/disease/disease.html',
		controller:'DiseaseCtrl'
	});
});