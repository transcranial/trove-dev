'use strict';

var app = angular.module('troveApp');

app.directive('modalityGoal', function ($window, $http, $interval) {

    return {
        restrict: 'E',
        link: function (scope, elem, attrs) {

            var modality, year, rotation, goal, numGoals, numStudies, numStudiesWeeklyTotal, percentGoalMet, percentGoalExceeded, donutChart, donutArc, donutPie, donutGroup;

            var marginTop, marginBottom, marginLeft, marginRight, widthDonut, height, outerRadius, innerRadius;

            var createDonut = function () {

                modality = attrs.modality;

                year = scope.data.rotations[scope.visibleRotationIndex].year;
                rotation = scope.data.rotations[scope.visibleRotationIndex].rotationName;
                if (scope.data.goals[rotation]) {

                    goal = scope.data.goals[rotation][year - 1][modality];
                    scope.isRotationWithoutGoals = false;

                    numGoals = _.without(_.values(scope.data.goals[rotation][year - 1]), 0).length;

                    marginTop = 20;
                    marginBottom = 20;
                    marginLeft = $window.innerWidth / (10*numGoals);
                    marginRight = $window.innerWidth / (10*numGoals);
                    widthDonut = Math.min($window.innerHeight / 4, $window.innerWidth / numGoals - marginLeft - marginRight - 20);
                    height = $window.innerHeight / 4;
                    outerRadius = widthDonut / 2;
                    innerRadius = 3 * outerRadius / 4;

                } else {

                    goal = 0;
                    scope.isRotationWithoutGoals = true;

                }

                if (goal === 0) {

                    if (donutChart) {
                        d3.select(elem[0]).select('svg').remove();
                        donutChart = null;
                        donutGroup = null;
                    }
                    
                } else {

                    percentGoalMet = numStudiesWeeklyTotal / goal;
                    percentGoalExceeded = 0;
                    if (percentGoalMet > 1) {
                        percentGoalExceeded = percentGoalMet - 1;
                        percentGoalMet = 1;
                    }

                    donutArc = d3.svg.arc()
                        .outerRadius(outerRadius)
                        .innerRadius(innerRadius);

                    var arcTween = function (a) {
                        var i = d3.interpolate(this._current, a);
                        this._current = i(0);
                        return function (t) {
                            return donutArc(i(t));
                        };
                    };

                    donutPie = d3.layout.pie()
                        .sort(null)
                        .value(function (d) { return d; });

                    if (donutChart) {

                        d3.select(elem[0]).select('svg').remove();
                        donutChart = null;
                        donutGroup = null;

                    }

                    donutChart = d3.select(elem[0])
                        .append('svg')
                        .attr('id', 'donutChart' + modality)
                        .attr('width', widthDonut + marginLeft + marginRight)
                        .attr('height', height + marginTop + marginBottom)
                        .append('g')
                        .attr('transform', 'translate(' + (outerRadius + marginLeft) + ',' + (outerRadius + marginTop) + ')');

                    donutGroup = donutChart.selectAll('path')
                        .data(donutPie([0, 1]))
                        .enter().append('path')
                        .attr('d', donutArc)
                        .style('fill', function (d, i) {
                            if (i===0) {
                                return scope.colors[modality];
                            } else {
                                return '#F2F1EF';
                            }
                        });
                    donutGroup = donutGroup.each(function (d) { this._current = d; }).data(donutPie([percentGoalMet, 1 - percentGoalMet]));
                    donutGroup.transition()
                        .duration(1200)
                        .delay(500)
                        .ease('cubic-in-out')
                        .attrTween('d', arcTween);

                    donutChart.append('text')
                        .attr('dy', '0.0em')
                        .attr('class', 'donut-chart-label')
                        .attr('text-anchor', 'middle')
                        .text(modality);
                    donutChart.append('text')
                        .attr('dy', '1.3em')
                        .attr('dx', '0.15em')
                        .attr('class', 'donut-chart-number')
                        .attr('text-anchor', 'middle')
                        .text(Math.round((percentGoalMet + percentGoalExceeded) * 100) + '% (' + numStudiesWeeklyTotal + '/' + goal + ')');


                }

                scope.modalityGoalLoaded = true;

            };

            scope.$watch('visibleRotationIndex', function () {
                var checkDataLoaded = $interval(function () {
                    if (scope.data.rotations && scope.data.goals) {
                        var dateRange = scope.data.rotations[scope.visibleRotationIndex].rotationDates;
                        $http.get('/api/studies/' + scope.currentUser.userId + '/' + attrs.modality + '/' + dateRange.split('-')[0].replace(/\//g,'-') + '/' + dateRange.split('-')[1].replace(/\//g,'-') + '/count').success(function (count) {
                                numStudiesWeeklyTotal = count;
                                createDonut();
                        });
                        $interval.cancel(checkDataLoaded);
                    }
                    return;
                }, 50);
            });

        }
    };
});
