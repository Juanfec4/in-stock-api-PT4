import categoryController from "../controllers/categoryController.js";
import express from "express";

const router = express.Router();
router.get("/", (req, res) => {
  return categoryController.getCategories(req, res);
});

export default router;
