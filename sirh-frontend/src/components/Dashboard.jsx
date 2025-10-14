import { useState } from "react";
import Empleados from "./Empleados";
import Contratos from "./Contratos";

function Dashboard() {
  const [view, setView] = useState("empleados");

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>SIRH Molino - Dashboard</h1>
      <button onClick={handleLogout}>Cerrar sesión</button>
      <hr />
      <div>
        <button onClick={() => setView("empleados")}>Empleados</button>
        <button onClick={() => setView("contratos")}>Contratos</button>
      </div>
      <div style={{ marginTop: "20px" }}>
        {view === "empleados" && <Empleados />}
        {view === "contratos" && <Contratos />}
      </div>
    </div>
  );
}

export default Dashboard;
