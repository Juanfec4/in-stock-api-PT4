import express from "express";
import inventoryController from "../controllers/inventoryController.js";

const router = express.Router();

//Delete an inventory item
router.delete("/:id", (req, res) => {
  return inventoryController.handleDeleteInventoryItem(req, res);
});

export default router;
