'use strict';

var alternateModalityMapper = {
    'XR':/DX|XR/i,
    'FLUORO':/GI|GU|FLUORO/i,
    'NM':/PT|NM/i
};

exports.map = function(modality) {
    return alternateModalityMapper[modality] || new RegExp(".*"+modality+".*");
};