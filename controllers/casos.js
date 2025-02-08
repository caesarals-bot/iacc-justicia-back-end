const db = require("../config/db");

// Crear un nuevo caso
const crearCaso = (req, res) => {
    const { rut_cliente, numero_caso, fecha_inicio, estado, descripcion, descripcion_sentencia, fecha_cierre } = req.body;
    
    if (!rut_cliente || !numero_caso || !fecha_inicio || !estado || !descripcion) {
        return res.status(400).json({ error: "Todos los campos obligatorios deben estar llenos." });
    }
    
    // Convertir fechas al formato YYYY-MM-DD
    const formattedFechaInicio = new Date(fecha_inicio).toISOString().split("T")[0];
    const formattedFechaCierre = fecha_cierre ? new Date(fecha_cierre).toISOString().split("T")[0] : null;
    
    const sql = "INSERT INTO casos (rut_cliente, numero_caso, fecha_inicio, estado, descripcion, descripcion_sentencia, fecha_cierre) VALUES (?, ?, ?, ?, ?, ?, ?)";
    
    db.query(sql, [rut_cliente, numero_caso, formattedFechaInicio, estado, descripcion, descripcion_sentencia || null, formattedFechaCierre], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Caso registrado exitosamente", id: result.insertId });
    });
};

// Obtener todos los casos
const obtenerCasos = (req, res) => {
    db.query("SELECT * FROM casos ORDER BY id ASC", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

// Obtener un caso por ID
const obtenerCasoPorId = (req, res) => {
    const { id } = req.params;
    db.query("SELECT * FROM casos WHERE id = ?", [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.length === 0) return res.status(404).json({ error: "Caso no encontrado" });
        res.json(result[0]);
    });
};

// Eliminar un caso
const eliminarCaso = (req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM casos WHERE id = ?", [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Caso eliminado exitosamente" });
    });
};

module.exports = { crearCaso, obtenerCasos, obtenerCasoPorId, eliminarCaso };