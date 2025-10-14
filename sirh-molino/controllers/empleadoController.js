import Empleado from "../models/Empleado.js";
import Contrato from "../models/Contrato.js";

// Listar todos los empleados
export const getEmpleados = async (req, res) => {
  try {
    const empleados = await Empleado.find();
    res.json(empleados);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Crear empleado
export const createEmpleado = async (req, res) => {
  try {
    const { nro_documento, nombre, apellido, cargo, estado, correo, password } = req.body;
    const nuevoEmpleado = new Empleado({ nro_documento, nombre, apellido, cargo, estado, correo, password });
    const savedEmpleado = await nuevoEmpleado.save();
    res.status(201).json(savedEmpleado);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Actualizar empleado
export const updateEmpleado = async (req, res) => {
  try {
    const { nro_documento, nombre, apellido, cargo, estado, correo, password } = req.body;
    const updated = await Empleado.findByIdAndUpdate(
      req.params.id,
      { nro_documento, nombre, apellido, cargo, estado, correo, password },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Eliminar empleado
export const deleteEmpleado = async (req, res) => {
  try {
    await Empleado.findByIdAndDelete(req.params.id);
    // También eliminamos contratos asociados
    await Contrato.deleteMany({ empleado_id: req.params.id });
    res.json({ message: "Empleado y contratos eliminados" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Buscar empleado por documento o nombre y mostrar contratos
export const buscarEmpleado = async (req, res) => {
  try {
    const { q } = req.query;
    const empleado = await Empleado.findOne({
      $or: [
        { nro_documento: q },
        { nombre: { $regex: q, $options: "i" } },
      ],
    });

    if (!empleado) return res.status(404).json({ message: "Empleado no encontrado" });

    const contratos = await Contrato.find({ empleado_id: empleado._id });
    res.json({ empleado, contratos, cantidad_contratos: contratos.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
