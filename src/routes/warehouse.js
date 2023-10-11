import express from "express";
import warehouseController from "../controllers/warehouseController.js";

const router = express.Router();

//Get all warehouses
router.get("/warehouses", (req, res) => {
  return warehouseController.getWarehouses(req, res);
});

//Get a single warehouse
router.get("/warehouses/:id", (req, res) => {
  return warehouseController.getWarehouse(req, res);
});

//Create a warehouse
router.post("/warehouses", (req, res) => {
  return warehouseController.createWarehouse(req, res);
});

//TODO

//Delete warehouse

//Edit warehouse
router.put("/warehouses/:id", (req, res) => {
  return warehouseController.editWarehouse (req, res);
});

export default router;
