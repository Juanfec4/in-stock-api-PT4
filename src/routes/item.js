import express from "express";
import itemController from "../controllers/itemController.js";

const router = express.Router();

//Get single inventory item
router.get("/:id", (req, res) => {
  return itemController.getItem(req, res);
});

export default router;
