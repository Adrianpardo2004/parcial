import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import empleadoRoutes from "./routes/empleados.js";
import contratoRoutes from "./routes/contratos.js";
import authRoutes from "./routes/auth.js";

// Cargar variables de entorno
dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
let conn = null;
async function connectDB() {
  if (conn) return conn;
  conn = await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ MongoDB conectado");
  return conn;
}

// Rutas
app.use("/api/empleados", empleadoRoutes);
app.use("/api/contratos", contratoRoutes);
app.use("/api/auth", authRoutes);

// Para Vercel: handler
export default async function handler(req, res) {
  await connectDB();
  app(req, res);
}

// Para correr localmente con Node
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 4000;
  connectDB().then(() => {
    app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT} 🚀`));
  });
}
