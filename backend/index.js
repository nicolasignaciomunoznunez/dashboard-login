import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

import { testConnection } from "./db/connectDB.js";

// Importar todas las rutas
import authRoutes from "./routes/authRoutes.js";
import plantaRoutes from "./routes/plantaRoutes.js";
import datoPlantaRoutes from "./routes/datoPlantaRoutes.js";
import incidenciaRoutes from "./routes/incidenciaRoutes.js";
import mantenimientoRoutes from "./routes/mantenimientoRoutes.js";
import reporteRoutes from "./routes/reporteRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Todas las rutas activas
app.use("/api/auth", authRoutes);
app.use("/api/plantas", plantaRoutes);
app.use("/api/datos-planta", datoPlantaRoutes);
app.use("/api/incidencias", incidenciaRoutes);
app.use("/api/mantenimientos", mantenimientoRoutes);
app.use("/api/reportes", reporteRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Ruta de salud
app.get("/api/salud", (req, res) => {
    res.status(200).json({
        success: true,
        message: "✅ API de Gestión de Plantas funcionando correctamente",
        timestamp: new Date().toISOString(),
        version: "1.0.0"
    });
});

// SERVIR LANDING PAGE EN DESARROLLO
if (process.env.NODE_ENV === "development") {
    app.use(express.static(path.join(__dirname, "frontend/landing")));
    
    app.get(/^\/(?!api).*/, (req, res) => {
        res.sendFile(path.resolve(__dirname, "frontend", "landing", "index.html"));
    });
}

// SERVIR APP EN PRODUCCIÓN
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "frontend/landing")));
    app.use(express.static(path.join(__dirname, "frontend/dist")));

    app.get("/api/*", (req, res, next) => next());
    
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "frontend", "landing", "index.html"));
    });
}

app.listen(PORT, async () => {
    try {
        await testConnection();
        console.log("✅ Servidor ejecutándose en el puerto:", PORT);
        console.log("🌍 Entorno:", process.env.NODE_ENV || "development");
        console.log("🚀 Rutas del API cargadas:");
        console.log("   - /api/auth");
        console.log("   - /api/plantas");
        console.log("   - /api/datos-planta");
        console.log("   - /api/incidencias");
        console.log("   - /api/mantenimientos");
        console.log("   - /api/reportes");
        console.log("   - /api/salud");
        console.log("");
        console.log("🔐 Sistema de gestión de plantas listo!");
    } catch (error) {
        console.error("❌ Error iniciando el servidor:", error);
    }
});