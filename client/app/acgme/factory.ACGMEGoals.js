'use strict';

var app = angular.module('troveApp');

app.factory('ACGMEGoals', function($http, $q) {

    return {
        getACGMEGoals: function(userId) {

            // Loads the json file for ACGME goals
            return $http.get('/assets/data/ACGME_Goals.json').then(function(acgme_goals) {

                var acgme_goals_array = acgme_goals.data;

                var study_indices = [];
                for (var i = 0; i < acgme_goals_array.length; i++) {
                    study_indices.push(acgme_goals_array[i].study_index);
                }

                return $q.all(study_indices.map(function (study_index) {
                    return $http.get('/api/users/' + userId + '/ACGME/' + study_index);
                })).then(function (results) {
                    for (var i=0; i<results.length; i++) {
                        acgme_goals_array[i].user_number = results[i].data;
                    }

                    return acgme_goals_array;
                });

            });
        }
   }

});