'use strict';

var app = angular.module('troveApp');

app.directive('weeklyNumbersChart', function ($window, $http, $interval, $q, $timeout) {

    return {
        restrict: 'E',
        link: function (scope, elem, attrs) {

            var marginNumbersChart, widthNumbersChart, heightNumbersChart, weeklyNumbers, weeklyNumbersZero, weeklyNumbersTotal, dateRange, startDate, tempDate, x, xAxis, numbersChart; 

            var parseDate = d3.time.format('%a %b %d %Y').parse;
            var MILLISECONDS_IN_DAY = 86400000;

            var numbersChartLoadDelay = $interval(function () {
                if (scope.modalityPieChartLoaded) {
                    $interval.cancel(numbersChartLoadDelay);

                    marginNumbersChart = {top: 60, right: 20, bottom: 60, left: 50};
                    widthNumbersChart = $window.innerWidth - document.getElementById('rotation-summary-pie').clientWidth - marginNumbersChart.left - marginNumbersChart.right - 50
                    heightNumbersChart = $window.innerHeight / 4;

                    weeklyNumbers = [];
                    weeklyNumbersZero = [];
                    dateRange = scope.data.rotations[scope.visibleRotationIndex].rotationDates;
                    startDate, tempDate;
                    for (var i=0; i<7; i++) {
                        startDate = new Date(dateRange.split('-')[0]);
                        tempDate = parseDate(new Date(startDate.getTime() + i * MILLISECONDS_IN_DAY).toDateString());

                        weeklyNumbersZero.push({
                            'date': tempDate,
                            'number': 0
                        });
                    }

                    x = d3.time.scale()
                        .domain(d3.extent(weeklyNumbersZero, function (d) { return d.date; }))
                        .range([0, widthNumbersChart]);

                    xAxis = d3.svg.axis()
                        .scale(x)
                        .orient('bottom')
                        .tickValues(weeklyNumbersZero.map( function (d) { return d.date; }))
                        .tickFormat(d3.time.format('%b %d, %Y'));

                    numbersChart = d3.select(elem[0])
                        .append('svg')
                        .attr('width', widthNumbersChart + marginNumbersChart.left + marginNumbersChart.right)
                        .attr('height', heightNumbersChart + marginNumbersChart.top + marginNumbersChart.bottom)
                        .append('g')
                        .attr('transform', 'translate(' + marginNumbersChart.left + ',' + marginNumbersChart.top + ')');

                    numbersChart.append('g')
                        .attr('class', 'x axis')
                        .attr('transform', 'translate(0,' + heightNumbersChart / 2 + ')')
                        .call(xAxis)
                        .selectAll('text')
                            .style('text-anchor', 'end')
                            .attr('dx', '-0.8em')
                            .attr('dy', '0.15em')
                            .attr('transform', function (d) { return 'rotate(-65)'; });

                    numbersChart.selectAll('circle')
                        .data(weeklyNumbersZero)
                        .enter()
                        .append('circle')
                        .attr('cx', function (d) { return x(d.date); })
                        .attr('cy', heightNumbersChart / 2)
                        .attr('r', 0)
                        .style('fill', scope.colors_transparent[scope.modalitySelected])
                        .attr('stroke', scope.colors[scope.modalitySelected])
                        .attr('stroke-width', '0px')
                        .attr('cursor', 'pointer')
                        .on('mouseover', function (d) {
                            var r = d3.select(this).attr('r');
                            d3.select(this)
                                .transition()
                                .duration(500)
                                .ease('cubic-out')
                                .attr('stroke-width', '2px');
                            numbersChart.append('text')
                                .attr('dx', x(d.date))
                                .attr('dy', heightNumbersChart / 2 - r - 10)
                                .attr('class', 'number-label')
                                .attr('text-anchor', 'middle')
                                .text(d.number);
                        })
                        .on('mouseout', function (d) {
                            d3.select(this)
                                .transition()
                                .duration(500)
                                .ease('cubic-out')
                                .attr('stroke-width', '0px');
                            numbersChart.selectAll('.number-label').remove();
                        })
                        .on('click', function (d) { 
                            scope.studiesListShowBoolean = true;
                            $http.get('/api/studies/' + scope.currentUser.userId + '/' + scope.modalitySelected + '/' + d3.time.format('%m-%d-%Y')(d.date)).success(function (studiesList) {
                                scope.studiesList = studiesList;
                                scope.showReportBoolean = [];
                                scope.showReportWithEditsBoolean = [];
                                for (var i = 0; i < studiesList.length; i++) {
                                    scope.showReportBoolean[i] = false;
                                    scope.showReportWithEditsBoolean[i] = false;
                                } 
                                $timeout(function () {
                                    scope.studiesListMore = document.getElementById('studiesListItems').scrollHeight > $window.innerHeight;
                                }, 100);
                            });
                            scope.$apply();
                        });
                    
                }
            }, 50);

            var updateNumbersChart = function (rotationChanged) {

                if (rotationChanged) {
                    
                    weeklyNumbersZero = [];
                    dateRange = scope.data.rotations[scope.visibleRotationIndex].rotationDates;
                    for (var i=0; i<7; i++) {
                        startDate = new Date(dateRange.split('-')[0]);
                        tempDate = parseDate(new Date(startDate.getTime() + i * MILLISECONDS_IN_DAY).toDateString());
                        weeklyNumbersZero.push({
                            'date': tempDate,
                            'number': 0
                        });
                    }

                    x = d3.time.scale()
                        .domain(d3.extent(weeklyNumbersZero, function (d) { return d.date; }))
                        .range([0, widthNumbersChart]);

                    xAxis = d3.svg.axis()
                        .scale(x)
                        .orient('bottom')
                        .tickValues(weeklyNumbersZero.map( function (d) { return d.date; }))
                        .tickFormat(d3.time.format('%a, %b %d, %Y'));

                    numbersChart.select('.x.axis')
                        .transition()
                        .duration(1600)
                        .delay(400)
                        .ease('exp-in-out')
                        .call(xAxis)
                        .selectAll('text')
                            .style('text-anchor', 'end')
                            .attr('dx', '-0.8em')
                            .attr('dy', '0.15em')
                            .attr('transform', function (d) { return 'rotate(-65)'; });
                }

                numbersChart.selectAll('circle')
                    .data(weeklyNumbers)
                    .style('fill', function() {
                        return scope.colors_transparent[scope.modalitySelected];
                    })
                    .transition()
                    .duration(2000)
                    .ease('cubic-out')
                    .attr('r', function (d) { 
                        var r = scope.modalityPieChartRadius;
                        var t = scope.numStudiesTotal;
                        var n = d.number;
                        if (t === 0) return 0;
                        return r * Math.sqrt(n / t); 
                    });

                scope.weeklyNumbersChartLoaded = true;

            };

            scope.$watch('modalitySelected', function () {

                var modalityPieChartLoadedCheck = $interval(function () {
                    if (scope.modalityPieChartLoaded) {
                        $interval.cancel(modalityPieChartLoadedCheck);
                        weeklyNumbers = [0, 0, 0, 0, 0, 0, 0];
                        dateRange = scope.data.rotations[scope.visibleRotationIndex].rotationDates;
                        var dates = [];
                        for (var i=0; i<7; i++) {
                            startDate = new Date(dateRange.split('-')[0]);
                            tempDate = parseDate(new Date(startDate.getTime() + i * MILLISECONDS_IN_DAY).toDateString());
                            dates.push(d3.time.format('%m-%d-%Y')(tempDate));
                        }

                        $q.all(dates.map(function (date) {
                            return $http.get('/api/studies/' + scope.currentUser.userId + '/' + scope.modalitySelected + '/' + date + '/count');
                        })).then(function (results) {
                            weeklyNumbers = [];
                            for (var i=0; i<results.length; i++) {
                                weeklyNumbers.push({
                                    'date': new Date(dates[i].replace(/-/g, '/')),
                                    'number': parseInt(results[i].data)
                                });
                            }

                            updateNumbersChart(false); 
                        });
                    }
                }, 50);
            });

            // this is it
            scope.$watch('visibleRotationIndex', function () { 
                
                var modalityPieChartLoadedCheck = $interval(function () {
                    if (scope.modalityPieChartLoaded) {
                        $interval.cancel(modalityPieChartLoadedCheck);
                        weeklyNumbers = [0, 0, 0, 0, 0, 0, 0];
                        dateRange = scope.data.rotations[scope.visibleRotationIndex].rotationDates;
                        var dates = [];
                        for (var i=0; i<7; i++) {
                            startDate = new Date(dateRange.split('-')[0]);
                            tempDate = parseDate(new Date(startDate.getTime() + i * MILLISECONDS_IN_DAY).toDateString());
                            dates.push(d3.time.format('%m-%d-%Y')(tempDate));
                        }

                        $q.all(dates.map(function (date) {
                            return $http.get('/api/studies/' + scope.currentUser.userId + '/' + scope.modalitySelected + '/' + date + '/count');
                        })).then(function (results) {
                            weeklyNumbers = [];
                            for (var i=0; i<results.length; i++) {
                                weeklyNumbers.push({
                                    'date': new Date(dates[i].replace(/-/g, '/')),
                                    'number': parseInt(results[i].data)
                                });
                            }

                            updateNumbersChart(true); 
                        });
                    }
                }, 50);
            });

        }

    };

});