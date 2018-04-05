'use strict';

var express = require('express');
var controller = require('./matching.controller');

var router = express.Router();

import * as auth from '../../auth/auth.service';

router.post('/create', auth.isAuthenticated(), controller.create);
router.post('/save', auth.isAuthenticated(), controller.save);
router.post('/finish', auth.isAuthenticated(), controller.finish);
router.delete('/:id', auth.isAuthenticated(), controller.destroy);

module.exports = router;
