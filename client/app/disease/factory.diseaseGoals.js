'use strict';

var app = angular.module('troveApp');

app.factory('diseaseGoals', function ($http, $q) {

    return {
        getDiseaseNumbers: function(userId, rotation, update_user_numbers) {
            // Loads the json file for disease number goals
            return $http.get('/assets/data/rotationGoalsDisease.json').then(function(results) {

                var diseaseNumbers = [];

                if (rotation === 'ALL') {
                    var keys = Object.keys(results.data);
                    var items;
                    for (var i = 0; i < keys.length; i++) {
                        items = results.data[keys[i]];
                        for (var j = 0; j < items.length; j++) {
                            diseaseNumbers.push(items[j]);
                        }
                    }
                } else {
                    diseaseNumbers = results.data[rotation];
                }

                if (update_user_numbers) {
                    /*for (var i = 0; i < diseaseNumbers.length; i++) {
                        diseaseNumbers[i].user_number = Math.floor(Math.random() * 20);
                    }*/
                    var deferred = $q.defer();
                    $q.all(diseaseNumbers.map(function (diseaseObj) {
                            return $http.get('/api/studies/' + userId + '/disease/' + encodeURIComponent(diseaseObj.disease).replace('\'', '%27') + '/count');
                        })).then(function (results) {
                            var updatedDiseaseNumbers = diseaseNumbers;
                            for (var i = 0; i < results.length; i++) {
                                updatedDiseaseNumbers[i].user_number = results[i].data;
                            }
                            deferred.resolve(updatedDiseaseNumbers);
                        });
                    return deferred.promise;
                } else {
                    return diseaseNumbers;
                }
            });
        }
   }

});