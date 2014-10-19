'use strict';

var app = angular.module('troveApp');

app.directive("bulletChart", function ($window) {
    return {
        restrict: "E",
        scope: {
            directiveData:"="
        },
        link: function (scope, elem, attrs) {

// Chart design based on the recommendations of Stephen Few. Implementation
// based on the work of Clint Ivy, Jamie Love, and Jason Davies.
// http://projects.instantcognition.com/protovis/bulletchart/

            var margin = {top: 5, right: 40, bottom: 20, left: 220},
            width = 960 - margin.left - margin.right,
            height = 50 - margin.top - margin.bottom;
            //width = elem.parent().width() - margin.left - margin.right,
            //height = elem.parent().height() - margin.top - margin.bottom;

            /*
            scope.data = [
                {"title":"Revenue","subtitle":"","ranges":[0,3],"measures":[1],"markers":[3]},
                {"title":"Profit","subtitle":"%","ranges":[0,3],"measures":[3,0],"markers":[3]},
                {"title":"Order Size","subtitle":"US$, average","ranges":[0,2],"measures":[0,0],"markers":[2]},
                {"title":"New Customers lalalaala","subtitle":"count","ranges":[0,3],"measures":[2,0],"markers":[3]},
                {"title":"Satisfaction","subtitle":"out of 5","ranges":[0,7],"measures":[5,0],"markers":[7]}
            ]
            */

            var chart = d3.bullet()
            .width(width)
            .height(height);

            var svg = null;
            var bullet = null;
            var title = null;

            scope.$watchCollection("directiveData", function(newValue,OldValue) {
                svg = d3.select(elem[0]).selectAll("svg");
                svg.remove();

                svg = d3.select(elem[0]).selectAll("svg")
                .data(scope.directiveData)
                .enter()
                .append("svg")
                .attr("class", "bullet")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                .call(chart);


                title = svg.append("g")
                .style("text-anchor", "end")
                .attr("transform", "translate(-6," + height / 2 + ")");

                title.append("text")
                .attr("class", "title")
                .text(function(d) { return d.title; });

                title.append("text")
                .attr("class", "subtitle")
                .attr("dy", "1em")
                .text(function(d) { return d.subtitle; });
            });
        }
    };
});

