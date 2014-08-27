'use strict';

var app = angular.module('troveApp');

app.controller('RotationCtrl', function ($rootScope, $scope, $http, $window, $interval, $timeout) {

    $rootScope.currentUser = {
        'fullName': 'Liyang Leon Chen',
        'altName': 'Leon Chen',
        'userId': 355
    };

    $scope.currentUser = $rootScope.currentUser;

    // colors used for modality indicator (CT, DX, MRI, FLUORO, US, NM)
    // blue, yellow, green, red, purple, orange
    $scope.colors = {
        'ALL': 'rgba(242, 241, 239, 1)', // '#F2F1EF'
        'CT': 'rgba(92, 151, 191, 1)', // '#5C97BF'
        'DX': 'rgba(244, 208, 63, 1)', // '#F4D03F'
        'MRI': 'rgba(210, 77, 87, 1)', // '#D24D57'
        'FLUORO': 'rgba(27, 188, 155, 1)', // '#1BBC9B'
        'US': 'rgba(155, 89, 182, 1)', // '#9B59B6'
        'NM': 'rgba(248, 148, 6, 1)' // '#F89406'
    };
    $scope.colors_transparent = {
        'ALL': 'rgba(242, 241, 239, 0.6)',
        'CT': 'rgba(92, 151, 191, 0.6)', 
        'DX': 'rgba(244, 208, 63, 0.6)', 
        'MRI': 'rgba(210, 77, 87, 0.6)', 
        'FLUORO': 'rgba(27, 188, 155, 0.6)', 
        'US': 'rgba(155, 89, 182, 0.6)', 
        'NM': 'rgba(248, 148, 6, 0.6)'
    };

    var slidesToShow = 4;

    $scope.slickConfig = {
        dots: false,
        infinite: false,
        speed: 400,
        slidesToShow: slidesToShow,
        slidesToScroll: 4,
        cssEase: 'ease-in-out',
        prevArrow: '<span class="navButton prevButton"><i class="fa fa-chevron-left"></i></span>',
        nextArrow: '<span class="navButton nextButton"><i class="fa fa-chevron-right"></i></span>'
    };

    $scope.slickHandle = {
    };

    $scope.data = {
    };

    function getRotationNumStudies () {

        var dateRange = $scope.data.rotations[$scope.visibleRotationIndex];

        var startDate, tempDate, tempMonth, tempDay, tempYear;
        for (var i=0; i<7; i++) {
            startDate = new Date(dateRange.split('-')[0]);
            tempDate = new Date(startDate.setDate(startDate.getDate() + i));
            tempMonth = tempDate.getMonth() + 1;
            tempDay = tempDate.getDate();
            tempYear = tempDate.getFullYear();
        }

        $scope.data.residentStudies = {
            'dateRange': dateRange,

        };
    }

    $scope.data.name = $rootScope.currentUser.altName;

    $scope.data.rotations = null;
    $scope.currentRotationIndex = -1;
    $http.get('/assets/data/residentSchedules.json').success(function(data) { 

        $scope.data.rotations = data[$scope.data.name];

        $scope.data.rotations.some(function (rotation, index) {
            var startDate = new Date(rotation.rotationDates.split('-')[0]);
            var endDate = new Date(rotation.rotationDates.split('-')[1]);
            endDate.setDate(endDate.getDate() + 1);
            var dateNow = new Date();
            if (dateNow >= startDate && dateNow < endDate) {
                $scope.currentRotationIndex = index;
                return true;
            } else {
                return false;
            }
        });

        $scope.visibleRotationIndex = $scope.currentRotationIndex;
    });

    $http.get('/assets/data/rotationGoalsModality.json').success(function(data) {

        $scope.data.goals = data;
    });

    $scope.rotationsLoaded = false;
    $scope.modalityGoalLoaded = false;
    $scope.modalityPieChartLoaded = false;
    $scope.weeklyNumbersChartLoaded = false;

    $scope.setVisibleRotation = function(index) {
        if (index <= $scope.currentRotationIndex) {
            $scope.visibleRotationIndex = index;
            $scope.modalityGoalLoaded = false;
            $scope.modalityPieChartLoaded = false;
            $scope.weeklyNumbersChartLoaded = false;
        }
    };

    var scrollToCurrentRotation = $interval(function () {
        if ($scope.slickHandle.hasOwnProperty('slickGoTo') && $scope.data.rotations) {
            $scope.rotationsLoaded = true;
            $scope.slickHandle.slickGoTo(Math.max(0, $scope.visibleRotationIndex - slidesToShow + 2));
            $interval.cancel(scrollToCurrentRotation);
        }
        return;
    }, 100);

    var adjustElementHeights = $interval(function () {
        if ($scope.rotationsLoaded && $scope.modalityGoalLoaded && $scope.modalityPieChartLoaded && $scope.weeklyNumbersChartLoaded) {
            $('#rotation-summary').height($window.innerHeight - $('#dashboard-header').outerHeight() - $('#rotation-carousel').outerHeight() - $('#rotation-goals').outerHeight());
            $interval.cancel(adjustElementHeights);
        }
        return;
    }, 200, 50);

    $scope.modalitySelected = 'ALL';

    $scope.modalityPieChartRadius = 0;
    $scope.numStudiesTotal = 0;

    $scope.studiesList = [];

    $scope.studiesListShowBoolean = false;
    $scope.studiesListClose = function () {
        $scope.studiesListFadeOutBoolean = true;
        $timeout(function () {
            $scope.studiesListShowBoolean = false;
            $scope.studiesListFadeOutBoolean = false;
            $scope.apply();
        }, 1000);
    };

    $scope.badgesListShowBoolean = false;
    $scope.badgesListShow = function () {
        $scope.badgesListShowBoolean = true;
        $scope.apply();
    };
    $scope.badgesListClose = function () {
        $scope.badgesListFadeOutBoolean = true;
        $timeout(function () {
            $scope.badgesListShowBoolean = false;
            $scope.badgesListFadeOutBoolean = false;
            $scope.apply();
        }, 1000);
    };
    
});