'use strict';

var app = angular.module('troveApp');

app.controller('RotationCtrl', function ($rootScope, $scope, $http, $location, $window, $interval, $timeout, $idle, $keepalive) {

    $scope.logout = function() {
        $http({
            method: 'POST',
            url: '/auth/logout'
        }).success(function (response) {
            $scope.currentUser = null;
            $rootScope.currentUser = null;
            $location.path('/');
        }).error(function (error) {
            console.log('error logging out');
            $scope.currentUser = null;
            $rootScope.currentUser = null;
            $location.path('/');
        });
    };

    if (!$rootScope.currentUser) {
        $location.path('/');
    }
    $scope.currentUser = $rootScope.currentUser;

    // get # minnies
    if ($rootScope.minnies > 0) {
        $scope.minnies = $rootScope.minnies;
    } else {
        $scope.minnies = 0;
        $http.get('/api/users/' + $scope.currentUser.username + '/minnies/get').success(
            function (minnies) {
                $scope.minnies = minnies;
                $rootScope.minnies = minnies;
            }
        );
    }

    // update badges
    /*$http.get('/api/users/' + $scope.currentUser.username + '/badges/update').success(
        function (successBoolean) { 
            if (successBoolean) {
                console.log("User badges updated successfully.");
            } else {
                console.log("Error in updating user badges.");
            }
        }
    );*/

    // feedback box control
    $scope.feedbackBoxShow = false;

    // colors used for modality indicator (CT, XR, MRI, FLUORO, US, NM)
    // blue, yellow, green, red, purple, orange
    $scope.colors = {
        'ALL': 'rgba(242, 241, 239, 1)', // '#F2F1EF'
        'CT': 'rgba(92, 151, 191, 1)', // '#5C97BF'
        'XR': 'rgba(244, 208, 63, 1)', // '#F4D03F'
        'MRI': 'rgba(210, 77, 87, 1)', // '#D24D57'
        'FLUORO': 'rgba(27, 188, 155, 1)', // '#1BBC9B'
        'US': 'rgba(155, 89, 182, 1)', // '#9B59B6'
        'NM': 'rgba(248, 148, 6, 1)' // '#F89406'
    };
    $scope.colors_transparent = {
        'ALL': 'rgba(242, 241, 239, 0.6)',
        'CT': 'rgba(92, 151, 191, 0.6)', 
        'XR': 'rgba(244, 208, 63, 0.6)', 
        'MRI': 'rgba(210, 77, 87, 0.6)', 
        'FLUORO': 'rgba(27, 188, 155, 0.6)', 
        'US': 'rgba(155, 89, 182, 0.6)', 
        'NM': 'rgba(248, 148, 6, 0.6)'
    };

    // Configures the rotation carousel view
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

    // rotation carousel handles (which will be populated by directive)
    $scope.slickHandle = {
        
    };

    $scope.data = {};

    // get number of studies for rotation
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

    // set user name
    $scope.data.name = $rootScope.currentUser.alt_name;

    $scope.data.rotations = null;
    $scope.currentRotationIndex = -1;
    $http.get('/assets/data/schedulesJSON/' + $scope.currentUser.username + '.json').success(function(schedule) { 

        $scope.data.rotations = schedule.slice(Math.max(schedule.length - 104, 0));

        // determine what the user's current rotation is based on current date
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

        // as default, sets the selected rotation as the current rotation
        $scope.visibleRotationIndex = $scope.currentRotationIndex;
    });

    // Loads the json file for modality number goals
    $http.get('/assets/data/rotationGoalsModality.json').success(function(data) {

        $scope.data.goals = data;
    });

    // Boolean for determining if selected rotation has goals
    $scope.isRotationWithoutGoals = false;

    // Returns the rotation goals div height in pixels
    $scope.rotationGoalsDivHeight = function () {
        return $window.innerHeight / 4 + 44; // donut height + marginTop + marginBottom
    }

    // Booleans for determining whether various parts of graphical interface is loaded
    $scope.rotationsLoaded = false;
    $scope.modalityGoalLoaded = false;
    $scope.modalityPieChartLoaded = false;
    $scope.weeklyNumbersChartLoaded = false;

    // sets index rotation as the visible selected rotation
    $scope.setVisibleRotation = function(index) {
        if (index <= $scope.currentRotationIndex) {
            $scope.visibleRotationIndex = index;
            $scope.modalityGoalLoaded = false;
            $scope.modalityPieChartLoaded = false;
            $scope.weeklyNumbersChartLoaded = false;
        }
    };

    // on load, scroll to the user's current rotation
    // timeout by 100 ms for the rotation carousel handles to be initialized
    var scrollToCurrentRotation = $interval(function() {
        if ($scope.slickHandle.hasOwnProperty('slickGoTo') && $scope.data.rotations) {
            $scope.rotationsLoaded = true;
            $scope.slickHandle.slickGoTo(Math.max(0, $scope.visibleRotationIndex - slidesToShow + 2));
            $interval.cancel(scrollToCurrentRotation);
        }
        return;
    }, 100);

    // make sure the graphical elements span the entire window height
    var adjustElementHeights = $interval(function() {
        if ($scope.rotationsLoaded && $scope.modalityGoalLoaded && $scope.modalityPieChartLoaded && $scope.weeklyNumbersChartLoaded) {
            $('#rotation-summary').height($window.innerHeight - $('#dashboard-header').outerHeight() - $('#rotation-carousel').outerHeight() - $('#rotation-goals').outerHeight());
            $interval.cancel(adjustElementHeights);
        }
        return;
    }, 200, 50);

    // default modality
    $scope.modalitySelected = 'ALL';

    $scope.modalityPieChartRadius = 0;
    $scope.numStudiesTotal = 0;

    // initializes popup/modal window for list of studies
    // shown when a particular date is clicked
    $scope.studiesList = [];
    $scope.studiesListShowBoolean = false;
    $scope.studiesSortBy = 'transcribed_time';
    $scope.studiesListClose = function() {
        $scope.studiesListFadeOutBoolean = true;
        $timeout(function() {
            $scope.studiesListShowBoolean = false;
            $scope.studiesListFadeOutBoolean = false;
            $scope.$apply();
        }, 1000);
    };

    // Preprocess transcribed report to fix the problem of the tail end of the report always
    // appearing in the diff.
    $scope.preprocessReport = function (transcribed_report, report) {
        var footerIndexTranscribed = transcribed_report.toLowerCase().lastIndexOf("prepared by: ");
        var footerIndexFinal = report.toLowerCase().lastIndexOf("prepared by: ");
        var transcribed_report_processed = transcribed_report.substring(0, footerIndexTranscribed) + report.substring(footerIndexFinal);
        return transcribed_report_processed;
    };

    // because studiesList displays PHI, we must implement a timeout feature when it is displayed
    // idle duration set by $idleProvider in app.js
    /*$scope.$on('$idleStart', function() {
        console.log('logging out');
    });*/
    $scope.$on('$idleTimeout', function() {
        $location.path('/');
    });
    $scope.$watch('studiesListShowBoolean', function (newValue) {
        if (newValue) {
            $idle.watch();
        } else {
            $idle.unwatch();
        }
    });

    // initializes popup/modal window for badges
    $scope.badgesListShowBoolean = false;
    $scope.badgesListShow = function() {
        $http.get('/api/users/' + $scope.currentUser.username + '/badges/get').success(function (badges) {
            $scope.badges = badges;
        });
        $scope.badgesListShowBoolean = true;
        $scope.$apply();
    };
    $scope.badgesListClose = function() {
        $scope.badgesListFadeOutBoolean = true;
        $timeout(function() {
            $scope.badgesListShowBoolean = false;
            $scope.badgesListFadeOutBoolean = false;
            $scope.$apply();
        }, 1000);
    };

    // send feedback message to slack using webhooks
    $scope.sendFeedback = function() {
        var text = "";
        if ($scope.fmsg) {
            text = $scope.fmsg;
            if ($scope.fname) {
                text = text + "\n-- " + $scope.fname;
            }
            $http({
                method: 'POST',
                url: 'https://trovedashboard.slack.com/services/hooks/incoming-webhook?token=gxdkEcqtMaHg9jP9ZV87uuV8',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                transformRequest: function(obj) {
                    var str = [];
                    for(var p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                },
                data: {payload: JSON.stringify({text: text, username: "feedback", channel: "#feedback"})}
            }).success(function() {})
            .error(function() {
                console.log("error sending feedback message.");
            });
        }
    };

    $scope.diseaseView = function() {
        $location.path('/dashboard/disease');
    };
    $scope.ACGMEView = function() {
        $location.path('/dashboard/ACGME');
    };
    
});