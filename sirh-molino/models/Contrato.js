import mongoose from "mongoose";

const contratoSchema = new mongoose.Schema({
  fecha_inicio: Date,
  fecha_fin: Date,
  valor: Number,
  empleado_id: { type: mongoose.Schema.Types.ObjectId, ref: "Empleado" },
});

export default mongoose.model("Contrato", contratoSchema);
