'use strict';

var alternateModalityMapper = {
    'XR':/DX|XR/i,
    'FLUORO':/GI|GU|FLUORO/i
};

exports.map = function(modality) {
    return alternateModalityMapper[modality] || new RegExp(".*"+modality+".*");
};