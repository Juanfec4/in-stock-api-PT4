import express from 'express';
const router = express.Router();
import inventoriesController from '../controllers/inventoriesController.js';

router.get('/inventories', inventoriesController.index);

export default router;
