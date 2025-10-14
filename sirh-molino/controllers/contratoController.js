import Contrato from "../models/Contrato.js";
import Empleado from "../models/Empleado.js";

// Listar todos los contratos
export const getContratos = async (req, res) => {
  try {
    const contratos = await Contrato.find().populate("empleado_id", "nombre apellido nro_documento");
    res.json(contratos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Crear contrato
export const createContrato = async (req, res) => {
  try {
    const { empleado_id } = req.body;
    const empleado = await Empleado.findById(empleado_id);
    if (!empleado) return res.status(404).json({ message: "Empleado no encontrado" });

    const nuevoContrato = new Contrato(req.body);
    const savedContrato = await nuevoContrato.save();
    res.status(201).json(savedContrato);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Actualizar contrato
export const updateContrato = async (req, res) => {
  try {
    const updated = await Contrato.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Eliminar contrato
export const deleteContrato = async (req, res) => {
  try {
    await Contrato.findByIdAndDelete(req.params.id);
    res.json({ message: "Contrato eliminado" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
