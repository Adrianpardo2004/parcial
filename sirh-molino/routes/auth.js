import express from "express";
import { recuperarPassword, login } from "../controllers/authController.js";

const router = express.Router();

router.post("/recuperar", recuperarPassword);
router.post("/login", login); // <-- agregamos esta línea

export default router;
