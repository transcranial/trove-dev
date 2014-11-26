'use strict';

var Study = require('../study/study.model');

var modalityMapper = require('./../modalityMapper');

var modalities = ['CT', 'XR', 'MRI', 'FLUORO', 'US', 'NM'];
var modalitiesIconURL = [
    'assets/images/icons/icon-modality-CT.svg',
    'assets/images/icons/icon-modality-XR.svg',
    'assets/images/icons/icon-modality-MRI.svg',
    'assets/images/icons/icon-modality-angio.svg',
    'assets/images/icons/icon-modality-US.svg',
    'assets/images/icons/icon-modality-NM.svg'
];

exports.modalityNumberBadges = function (user) {
    var modalityNumberBadgesCutoffs = [100, 250, 500, 1000];
    try {
        for (var i = 0; i < modalities.length; i++) {
            (function (index) {
                var modality = modalities[index];
                var modalityIconURL = modalitiesIconURL[index];
                Study.count({
                    assistant_radiologist: parseInt(user.userId),
                    modality: modalityMapper.map(modality)
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
        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
};
