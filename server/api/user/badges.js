'use strict';

var Study = require('../study/study.model');

var modalities = ['CT', 'XR', 'MRI', 'FLUORO', 'US', 'NM'];
var modalitiesIconURL = [
    'assets/images/modality-CT.png',
    'assets/images/modality-XR.png',
    'assets/images/modality-MRI.png',
    'assets/images/modality-FLUORO.png',
    'assets/images/modality-US.png',
    'assets/images/modality-NM.png'
];

exports.modalityNumberBadges = function (user) {
    var modalityNumberBadgesCutoffs = [100, 250, 500, 750, 1000];
    for (var i = 0; i < modalities.length; i++) {
        (function (index) {
            var modality = modalities[index];
            var modalityIconURL = modalitiesIconURL[index];
            Study.count({
                radiologist: user.userId,
                modality: modality
            }, function (err, count) {
                var cutoff = 0;
                for (var j = 0; j < modalityNumberBadgesCutoffs.length; j++) {
                    cutoff = modalityNumberBadgesCutoffs[j];
                    if (count > cutoff) {
                        var badge = {
                            'desc': cutoff + ' ' + modality + ' studies read',
                            'number': cutoff,
                            'iconURL': modalityIconURL,
                            'dateAchieved': new Date()
                        };
                        var doesBadgeExist = user.badges.filter(function (b) { return b.desc === badge.desc; }).length > 0;
                        if (!doesBadgeExist) {
                            user.badges.push(badge);
                            user.save();
                        }
                    }
                }
            });
        })(i);
    }
};
