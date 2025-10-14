import { useState, useEffect } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";



function Contratos() {
  const [contratos, setContratos] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [form, setForm] = useState({ empleado_id: "", fecha_inicio: "", fecha_fin: "", valor: "" });
  const [editingId, setEditingId] = useState(null);

  const fetchContratos = async () => {
    const res = await axios.get("http://localhost:4000/api/contratos");
    setContratos(res.data);
  };

  const fetchEmpleados = async () => {
    const res = await axios.get("http://localhost:4000/api/empleados");
    setEmpleados(res.data);
  }

  useEffect(() => {
    fetchContratos();
    fetchEmpleados();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if(editingId){
        await axios.put(`http://localhost:4000/api/contratos/${editingId}`, form);
      } else {
        await axios.post("http://localhost:4000/api/contratos", form);
      }
      setForm({ empleado_id: "", fecha_inicio: "", fecha_fin: "", valor: "" });
      setEditingId(null);
      fetchContratos();
    } catch(err){ console.log(err) }
  }
  const exportPDF = () => {
  const doc = new jsPDF();
  doc.text("Contratos SIRH Molino", 10, 10);
  let row = 20;
  contratos.forEach(c => {
    doc.text(`${c.empleado_id?.nombre || "N/A"} - ${new Date(c.fecha_inicio).toLocaleDateString()} / ${new Date(c.fecha_fin).toLocaleDateString()} - $${c.valor}`, 10, row);
    row += 10;
  });
  doc.save("contratos.pdf");
};

const exportExcel = () => {
  const dataExcel = contratos.map(c => ({
    Empleado: c.empleado_id?.nombre || "N/A",
    Fecha_Inicio: new Date(c.fecha_inicio).toLocaleDateString(),
    Fecha_Fin: new Date(c.fecha_fin).toLocaleDateString(),
    Valor: c.valor
  }));
  const ws = XLSX.utils.json_to_sheet(dataExcel);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Contratos");
  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const data = new Blob([excelBuffer], {type: "application/octet-stream"});
  saveAs(data, "contratos.xlsx");
};

  const handleEdit = (c) => {
    setForm({ empleado_id:c.empleado_id._id, fecha_inicio:c.fecha_inicio.slice(0,10), fecha_fin:c.fecha_fin.slice(0,10), valor:c.valor });
    setEditingId(c._id);
  }

  const handleDelete = async (id) => {
    if(window.confirm("¿Eliminar contrato?")){
      await axios.delete(`http://localhost:4000/api/contratos/${id}`);
      fetchContratos();
    }
  }

  return (
    <div>
      <h2>Contratos</h2>
      <h3>{editingId ? "Editar contrato" : "Crear contrato"}</h3>
      <form onSubmit={handleSubmit}>
        <select value={form.empleado_id} onChange={e=>setForm({...form, empleado_id:e.target.value})} required>
          <option value="">Seleccione empleado</option>
          {empleados.map(emp=>(
            <option key={emp._id} value={emp._id}>{emp.nombre} {emp.apellido}</option>
          ))}
        </select>
        <input type="date" value={form.fecha_inicio} onChange={e=>setForm({...form, fecha_inicio:e.target.value})} required />
        <input type="date" value={form.fecha_fin} onChange={e=>setForm({...form, fecha_fin:e.target.value})} required />
        <input type="number" placeholder="Valor" value={form.valor} onChange={e=>setForm({...form, valor:e.target.value})} required />
        <button type="submit">{editingId ? "Actualizar" : "Crear"}</button>
      </form>

      <table border="1" cellPadding="5" style={{ marginTop: "10px" }}>
        <thead>
          <tr>
            <th>Empleado</th>
            <th>Fecha Inicio</th>
            <th>Fecha Fin</th>
            <th>Valor</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {contratos.map(c => (
            <tr key={c._id}>
              <td>{c.empleado_id?.nombre || "N/A"}</td>
              <td>{new Date(c.fecha_inicio).toLocaleDateString()}</td>
              <td>{new Date(c.fecha_fin).toLocaleDateString()}</td>
              <td>{c.valor}</td>
              <td>
                <button onClick={()=>handleEdit(c)}>Editar</button>
                <button onClick={()=>handleDelete(c._id)}>Eliminar</button>
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

export default Contratos;
