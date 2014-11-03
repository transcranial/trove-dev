'use strict';

var app = angular.module('troveApp');

app.factory('ACGMEGoals', function($http) {

    return {
        getACGMEGoals: function() {
            // Loads the json file for ACGME goals
            return $http.get('/assets/data/ACGME_Goals.json').then(function(results) {

                return results;
            });
        }
   }

});