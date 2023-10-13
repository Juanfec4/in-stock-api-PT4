import express from "express";
import inventoryController from "../controllers/inventoryController.js";

const router = express.Router();

//Get all inventory
router.get("/", (req, res) => {
  return inventoryController.handleGetInventories(req, res);
});

//Get single Inventory
router.get("/inventories/:id", (req, res) => {
  return inventoriesController.getSingleItem(req, res)
})



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
