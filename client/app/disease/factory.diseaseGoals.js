'use strict';

var app = angular.module('troveApp');

app.factory('diseaseGoals', function($http) {

    return {
        getDiseaseNumbers: function(rotation, update_user_numbers) {
            // Loads the json file for disease number goals
            return $http.get('/assets/data/rotationGoalsDisease.json').then(function(results) {
                var diseaseNumbers = results.data[rotation];

                if (update_user_numbers) {
                    for (var i = 0; i < diseaseNumbers.length; i++) {
                        diseaseNumbers[i].user_number = Math.floor(Math.random() * 20);
                    };
                }

                return diseaseNumbers;
            });
        }
   }

});