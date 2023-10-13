import express from "express";
import warehouseController from "../controllers/warehouseController.js";

const router = express.Router();

//Get all warehouses
router.get("/", (req, res) => {
  return warehouseController.getWarehouses(req, res);
});

//Get a single warehouse
router.get("/:id", (req, res) => {
  return warehouseController.getWarehouse(req, res);
});

//Get inventory @ warehouse
router.get("/:id/inventories", (req, res) => {
  return warehouseController.getInventoryAtWarehouse (req, res)
});

//Create a warehouse
router.post("/", (req, res) => {
  return warehouseController.createWarehouse(req, res);
});

//TODO

//Delete warehouse
router.delete('/:id', (req, res) => {
  return warehouseController.deleteWarehouse(req, res);
});

//Edit warehouse
router.put("/:id", (req, res) => {
  return warehouseController.editWarehouse (req, res);
});


export default router;
