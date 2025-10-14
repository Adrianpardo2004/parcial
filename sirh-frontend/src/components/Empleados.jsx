import { useState, useEffect } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

function Empleados() {
  const [empleados, setEmpleados] = useState([]);
  const [q, setQ] = useState("");
  const [form, setForm] = useState({ 
    nro_documento: "", 
    nombre: "", 
    apellido: "", 
    cargo: "", 
    estado: "activo",
    correo: "",
    password: ""
  });
  const [editingId, setEditingId] = useState(null);

  const API_BASE = import.meta.env.VITE_API_URL;

  const fetchEmpleados = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/empleados`);
      setEmpleados(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => { fetchEmpleados(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if(editingId){
        await axios.put(`${API_BASE}/api/empleados/${editingId}`, form);
      } else {
        await axios.post(`${API_BASE}/api/empleados`, form);
      }
      setForm({ nro_documento: "", nombre: "", apellido: "", cargo: "", estado: "activo", correo:"", password:"" });
      setEditingId(null);
      fetchEmpleados();
    } catch(err){
      console.log(err);
    }
  }

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Empleados SIRH Molino", 10, 10);
    let row = 20;
    empleados.forEach(e => {
      doc.text(`${e.nro_documento} - ${e.nombre} ${e.apellido} - ${e.cargo} - ${e.estado}`, 10, row);
      row += 10;
    });
    doc.save("empleados.pdf");
  };

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(empleados);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Empleados");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], {type: "application/octet-stream"});
    saveAs(data, "empleados.xlsx");
  };

  const handleEdit = (empleado) => {
    setForm({
      nro_documento: empleado.nro_documento,
      nombre: empleado.nombre,
      apellido: empleado.apellido,
      cargo: empleado.cargo,
      estado: empleado.estado,
      correo: empleado.correo,
      password: empleado.password
    });
    setEditingId(empleado._id);
  }

  const handleDelete = async (id) => {
    if(window.confirm("¿Eliminar empleado y sus contratos?")){
      await axios.delete(`${API_BASE}/api/empleados/${id}`);
      fetchEmpleados();
    }
  }

  const handleBuscar = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/empleados/buscar?q=${q}`);
      alert(`Empleado: ${res.data.empleado.nombre}, Contratos: ${res.data.cantidad_contratos}`);
    } catch (err) {
      alert("Empleado no encontrado");
    }
  }

  return (
    <div>
      <h2>Empleados</h2>
      <input type="text" placeholder="Buscar por nombre o documento" value={q} onChange={e => setQ(e.target.value)} />
      <button onClick={handleBuscar}>Buscar</button>

      <h3>{editingId ? "Editar empleado" : "Crear empleado"}</h3>
      <form onSubmit={handleSubmit}>
        <input placeholder="Documento" value={form.nro_documento} onChange={e=>setForm({...form, nro_documento:e.target.value})} required />
        <input placeholder="Nombre" value={form.nombre} onChange={e=>setForm({...form, nombre:e.target.value})} required />
        <input placeholder="Apellido" value={form.apellido} onChange={e=>setForm({...form, apellido:e.target.value})} required />
        <input placeholder="Cargo" value={form.cargo} onChange={e=>setForm({...form, cargo:e.target.value})} />
        <input type="email" placeholder="Correo" value={form.correo} onChange={e=>setForm({...form, correo:e.target.value})} required />
        <input type="password" placeholder="Contraseña" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} required />
        <select value={form.estado} onChange={e=>setForm({...form, estado:e.target.value})}>
          <option value="activo">Activo</option>
          <option value="retirado">Retirado</option>
        </select>
        <button type="submit">{editingId ? "Actualizar" : "Crear"}</button>
      </form>

      <table border="1" cellPadding="5" style={{ marginTop: "10px" }}>
        <thead>
          <tr>
            <th>Documento</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Cargo</th>
            <th>Correo</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {empleados.map(e => (
            <tr key={e._id}>
              <td>{e.nro_documento}</td>
              <td>{e.nombre}</td>
              <td>{e.apellido}</td>
              <td>{e.cargo}</td>
              <td>{e.correo}</td>
              <td>{e.estado}</td>
              <td>
                <button onClick={()=>handleEdit(e)}>Editar</button>
                <button onClick={()=>handleDelete(e._id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ margin: "10px 0" }}>
        <button onClick={exportPDF}>Exportar PDF</button>
        <button onClick={exportExcel}>Exportar Excel</button>
      </div>
    </div>
  );
}

export default Empleados;
