const express = require('express');
const router = express.Router();
const warehousesController = require('../controllers/warehousesController');

router.put('/api/warehouses/:id', warehousesController.update);
router.get('')

module.exports = router;