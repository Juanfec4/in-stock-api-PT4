const express = require('express');
const router = express.Router();
const inventoriesController = require('../controllers/inventoriesController');

router.get('/api/inventories', inventoriesController.index);