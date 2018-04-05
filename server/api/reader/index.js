'use strict';

var express = require('express');
var controller = require('./reader.controller');

var router = express.Router();

import * as auth from '../../auth/auth.service';

router.get('/', auth.isAuthenticated(), controller.index);
router.get('/tags', auth.isAuthenticated(), controller.tags);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/', auth.isAuthenticated(), controller.create);
router.put('/:id', auth.isAuthenticated(), controller.upsert);
router.patch('/:id', auth.isAuthenticated(), controller.patch);
router.delete('/:id', auth.isAuthenticated(), controller.destroy);

module.exports = router;
