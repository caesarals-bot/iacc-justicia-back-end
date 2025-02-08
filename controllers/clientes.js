const db = require("../config/db");

const clientesGet = (req, res) => {
    db.query("SELECT * FROM clientes", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });  
        res.json(results);
    });
};

const clienteGetById = (req, res) => {
    const { id } = req.params;
    db.query("SELECT * FROM clientes WHERE id = ?", [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.length === 0) return res.status(404).json({ error: "Cliente no encontrado" });
        res.json(result[0]);
    });
};

const clienteUpdate = (req, res) => {
    const { rut } = req.params;
    const { nombre, apellido, correo_electronico, telefono, direccion } = req.body;

    const sql = "UPDATE clientes SET nombre = ?, apellido = ?, correo_electronico = ?, telefono = ?, direccion = ? WHERE rut = ?";
    db.query(sql, [nombre, apellido, correo_electronico, telefono, direccion, rut], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ error: "Cliente no encontrado" });
        res.json({ message: "Cliente actualizado exitosamente" });
    });
};

const clienteCreate = (req, res) => {
    const { rut, nombre, apellido, correo_electronico, telefono, direccion } = req.body;
    const sql = "INSERT INTO clientes (rut, nombre, apellido, correo_electronico, telefono, direccion) VALUES (?, ?, ?, ?, ?, ?)";

    db.query(sql, [rut, nombre, apellido, correo_electronico, telefono, direccion], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Cliente registrado exitosamente", id: result.insertId });
    });
};

const clienteDelete = (req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM clientes WHERE id = ?", [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Cliente eliminado exitosamente" });
    });
};

module.exports = { clientesGet, clienteGetById, clienteUpdate, clienteCreate, clienteDelete };
