import { useState } from "react";
import axios from "axios";

function Login() {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");

  const API_BASE = import.meta.env.VITE_API_URL;

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE}/api/auth/login`, { correo, password });
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        window.location.href = "/dashboard";
      } else {
        alert("Correo o contraseña incorrecta");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Error en login");
    }
  };

  const handleRecuperar = async () => {
    if (!correo) {
      alert("Ingresa tu correo primero");
      return;
    }
    try {
      const res = await axios.post(`${API_BASE}/api/auth/recuperar`, { correo });
      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.message || "Error enviando correo");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Login SIRH Molino</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Correo"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          required
        />
        <br /><br />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br /><br />
        <button type="submit">Ingresar</button>
      </form>
      <br />
      <button onClick={handleRecuperar}>¿Olvidaste tu contraseña?</button>
    </div>
  );
}

export default Login;
