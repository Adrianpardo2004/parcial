import express from "express";
import {
  getEmpleados,
  createEmpleado,
  updateEmpleado,
  deleteEmpleado,
  buscarEmpleado,
} from "../controllers/empleadoController.js";

const router = express.Router();

router.get("/", getEmpleados);
router.post("/", createEmpleado);
router.put("/:id", updateEmpleado);
router.delete("/:id", deleteEmpleado);
router.get("/buscar", buscarEmpleado); // ?q=123 o ?q=Juan

export default router;
