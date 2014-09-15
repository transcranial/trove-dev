'use strict';

var express = require('express');
var controller = require('./study.controller');

var router = express.Router();

router.get('/:user/ALL/:date', controller.allStudiesOnDate);
router.get('/:user/ALL/:date/count', controller.allStudiesOnDateCount);
router.get('/:user/ALL/:startDate/:endDate', controller.allStudiesBetweenDates);
router.get('/:user/ALL/:startDate/:endDate/count', controller.allStudiesBetweenDatesCount);
router.get('/:user/:modality/:date', controller.modalityStudiesOnDate);
router.get('/:user/:modality/:date/count', controller.modalityStudiesOnDateCount);
router.get('/:user/:modality/:startDate/:endDate', controller.modalityStudiesBetweenDates);
router.get('/:user/:modality/:startDate/:endDate/count', controller.modalityStudiesBetweenDatesCount);

router.post('/processHL7JSON', controller.processHL7JSON);

module.exports = router;