'use strict';

var app = angular.module('troveApp');

app.directive('modalityPieChart', function ($window, $http, $interval, $q) {

    return {
        restrict: 'E',
        link: function (scope, elem, attrs) {

            var modalities = ['CT', 'DX', 'MRI', 'FLUORO', 'US', 'NM'];

            // pie chart

            var widthPieChart = $window.innerHeight / 4,
                heightPieChart = $window.innerHeight / 4,
                marginPieChart = {top: 60, bottom: 60, left: 40, right: 100},
                radius = heightPieChart / 2,
                labelRadius = radius + 20;

            var numStudiesPieChart, modalityWeeklyTotal, totalTemp, pieChart, pieArc, pie, pieGroup;

            pieChart = d3.select(elem[0])
                .append('svg')
                .attr('width', widthPieChart + marginPieChart.left + marginPieChart.right)
                .attr('height', heightPieChart + marginPieChart.top + marginPieChart.bottom)
                .append('g')
                .attr('transform', 'translate(' + (radius + marginPieChart.left) + ',' + (radius + marginPieChart.top) + ')');

            pieArc = d3.svg.arc()
                .outerRadius(radius)
                .innerRadius(0);

            function createPie () {

                pie = d3.layout.pie()
                    .sort(null)
                    .value(function (d) { return d.total; });

                pieChart.selectAll('.pieArc').remove();

                pieGroup = pieChart.selectAll('.pieArc')
                    .data(pie(modalityWeeklyTotal))
                    .enter()
                    .append('g')
                    .attr('class', 'pieArc')
                    .on('mouseover', function (d) {
                        var arcOver = d3.svg.arc().outerRadius(radius + 10);
                        d3.select(this).select('path')
                            .transition()
                            .ease('elastic')
                            .duration(600)
                            .attr('d', arcOver);
                    })
                    .on('mouseout', function (d) {
                        d3.select(this).select('path')
                            .transition()
                            .ease('elastic')
                            .duration(600)
                            .attr('d', pieArc);
                    });

                pieGroup.append('path')
                    .attr('d', pieArc)
                    .style('fill', function (d) { return scope.colors[d.data.modality]; })
                    .on('mouseover', function (d) {
                        scope.modalitySelected = d.data.modality;
                        scope.$apply();
                    })
                    .on('mouseout', function (d) {
                        scope.modalitySelected = 'ALL';
                        scope.$apply();
                    });

                pieGroup.append('text')
                    .attr('transform', function (d, i) { return 'translate(' + (radius+10) + ',' + (i*20-radius) + ')'; })
                    /*.attr('transform', function (d) { 
                        var c = pieArc.centroid(d),
                            x = c[0],
                            y = c[1],
                            h = Math.sqrt(x*x + y*y);
                        return 'translate(' + (x/h * labelRadius) + ',' + (y/h * labelRadius) + ')';
                    })*/
                    .attr('class', 'pie-graph-label')
                    .attr('text-anchor', 'left')
                    /*.attr('text-anchor', function (d) {
                        return (d.endAngle + d.startAngle)/2 > Math.PI ? 'end' : 'start';
                    })*/
                    .text(function (d) { return d.data.modality; })
                    .style('fill', function (d) { return scope.colors[d.data.modality]; });

                pieGroup.append('text')
                    /*.attr('transform', function (d) { return 'translate(' + pieArc.centroid(d) + ')'; })*/
                    .attr('transform', function (d) { 
                        var c = pieArc.centroid(d),
                            x = c[0],
                            y = c[1],
                            h = Math.sqrt(x*x + y*y);
                        return 'translate(' + (x/h * labelRadius) + ',' + (y/h * labelRadius) + ')';
                    })
                    .attr('dy', '.35em')
                    .attr('class', 'pie-graph-number')
                    /*.attr('text-anchor', 'middle')*/
                    .attr('text-anchor', function (d) {
                        return (d.endAngle + d.startAngle)/2 > Math.PI ? 'end' : 'start';
                    })
                    .text(function (d) { return d.data.total; });

                scope.modalityPieChartLoaded = true;
                scope.modalityPieChartRadius = radius;

            }

            scope.$watch('visibleRotationIndex', function () { 
                var checkDataLoaded = $interval(function () {
                    if (scope.data.rotations) { 
                        var dateRange = scope.data.rotations[scope.visibleRotationIndex].rotationDates;
                        $q.all(modalities.map(function (modality) {
                            return $http.get('/api/studies/' + scope.currentUser.userId + '/' + modality + '/' + dateRange.split('-')[0].replace(/\//g,'-') + '/' + dateRange.split('-')[1].replace(/\//g,'-') + '/count');
                        })).then(function (results) {
                            modalityWeeklyTotal = [];
                            scope.numStudiesTotal = 0;
                            for (var i=0; i<results.length; i++) {
                                if (parseInt(results[i].data) > 0) {
                                    scope.numStudiesTotal += parseInt(results[i].data);
                                    modalityWeeklyTotal.push({
                                        'modality': modalities[i],
                                        'total': parseInt(results[i].data)
                                    });
                                }
                            }
                            createPie(); 
                        });
                        $interval.cancel(checkDataLoaded);
                    }
                    return;
                }, 50);
            });

        }
    };
});