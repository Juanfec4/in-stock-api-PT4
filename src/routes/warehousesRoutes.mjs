import express from 'express';
const router = express.Router();
import warehousesController from '../controllers/warehousesController';

router.put('/api/warehouses/:id', warehousesController.update);

export default router;
