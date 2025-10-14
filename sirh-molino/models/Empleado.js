import mongoose from "mongoose";

const empleadoSchema = new mongoose.Schema({
  nro_documento: { type: String, required: true, unique: true },
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  edad: Number,
  genero: String,
  cargo: String,
  correo: { type: String, required: true, unique: true }, // <-- correo obligatorio
  password: { type: String, required: true },            // <-- contraseña obligatoria
  nro_contacto: String,
  estado: { type: String, enum: ["activo", "retirado"], default: "activo" },
  observaciones: [String],
});

export default mongoose.model("Empleado", empleadoSchema);
