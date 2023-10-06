import express from "express";
import warehouseController from "../controllers/warehouseController";

const router = express.Router();

//Get all warehouses
router.get("/", (req, res) => {
  return warehouseController.getWarehouses(req, res);
});

//Get a single warehouse
router.get("/:id", (req, res) => {
  return warehouseController.getWarehouse(req, res);
});

//Create a warehouse
router.post("/", (req, res) => {
  return warehouseController.createWarehouse(req, res);
});

//TODO

//Delete warehouse

//Edit warehouse

export default router;
