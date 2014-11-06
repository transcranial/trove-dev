'use strict';

var express = require('express');
var controller = require('./user.controller');

var router = express.Router();

router.get('/:username/info', controller.getInfo);
router.get('/:username/minnies', controller.getMinnies);
router.get('/:username/badges/update', controller.updateBadges);
router.get('/:username/badges/get', controller.getBadges);
router.get('/:user/ACGME/:study_index', controller.getNumberForACGME);

module.exports = router;