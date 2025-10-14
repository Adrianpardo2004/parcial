import bcrypt from "bcryptjs";
import Empleado from "./models/Empleado.js";

const empleado = await Empleado.findOne({ correo: "yimoray129@casdss.com" });
empleado.password = await bcrypt.hash("12345", 10);
await empleado.save();
console.log("Contraseña encriptada correctamente");
