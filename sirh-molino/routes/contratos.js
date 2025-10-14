import express from "express";
import {
  getContratos,
  createContrato,
  updateContrato,
  deleteContrato,
} from "../controllers/contratoController.js";

const router = express.Router();

router.get("/", getContratos);
router.post("/", createContrato);
router.put("/:id", updateContrato);
router.delete("/:id", deleteContrato);

export default router;
