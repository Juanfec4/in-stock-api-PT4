import express from "express";
import inventoryController from "../controllers/inventoryController.js";

const router = express.Router();

//Delete an inventory item
router.delete("/:id", (req, res) => {
  return inventoryController.handleDeleteInventoryItem(req, res);
});

//Edit inventory @ warehouse
router.put("/:id", (req, res) => {
  return inventoryController.handleEditInventoryItem(req, res);
});

//Create inventory @ warehouse
router.post("/", (req, res) => {
  return inventoryController.handleCreateInventoryItem(req, res);
});

export default router;
