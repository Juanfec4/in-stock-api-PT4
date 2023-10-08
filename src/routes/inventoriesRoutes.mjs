import express from 'express';
const router = express.Router();
import inventoriesController from '../controllers/inventoriesController.js';

//Get all inventories
router.get("/inventories", (req, res) => {
    return inventoriesController.index(req, res);
  });

//Get single Inventory
router.get("/inventories/:id", (req, res) => {
    return inventoriesController.getSingleItem(req, res)
})

export default router;
