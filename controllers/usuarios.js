const db = require("../config/db");
const bcrypt = require('bcryptjs');

// Obtener todos los usuarios
const usuariosGet = (req, res) => {
    db.query("SELECT id, username, email, role, status, created_at, updated_at FROM usuarios", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

// Obtener un usuario por ID
const usuarioGetById = (req, res) => {
    const { id } = req.params;
    db.query("SELECT id, username, email, role, status, created_at, updated_at FROM usuarios WHERE id = ?", 
        [id], 
        (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            if (results.length === 0) return res.status(404).json({ msg: "Usuario no encontrado" });
            res.json(results[0]);
        }
    );
};

// Crear un nuevo usuario
const usuarioCreate = async (req, res) => {
    const { username, password, email, role = 'user' } = req.body;

    try {
        // Verificar si el usuario ya existe
        db.query("SELECT id FROM usuarios WHERE username = ? OR email = ?", 
            [username, email],
            async (err, results) => {
                if (err) return res.status(500).json({ error: err.message });
                if (results.length > 0) {
                    return res.status(400).json({
                        msg: "El usuario o email ya existe"
                    });
                }

                // Encriptar la contraseña
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);

                // Crear el usuario
                db.query(
                    "INSERT INTO usuarios (username, password, email, role) VALUES (?, ?, ?, ?)",
                    [username, hashedPassword, email, role],
                    (err, result) => {
                        if (err) return res.status(500).json({ error: err.message });
                        res.status(201).json({
                            msg: "Usuario creado exitosamente",
                            id: result.insertId
                        });
                    }
                );
            }
        );
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Actualizar un usuario
const usuarioUpdate = async (req, res) => {
    const { id } = req.params;
    const { username, password, email, role, status } = req.body;

    try {
        // Verificar si el usuario existe
        db.query("SELECT * FROM usuarios WHERE id = ?", [id], async (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            if (results.length === 0) {
                return res.status(404).json({
                    msg: "Usuario no encontrado"
                });
            }

            let updateQuery = "UPDATE usuarios SET ";
            const updateValues = [];

            if (username) {
                updateQuery += "username = ?, ";
                updateValues.push(username);
            }
            if (password) {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);
                updateQuery += "password = ?, ";
                updateValues.push(hashedPassword);
            }
            if (email) {
                updateQuery += "email = ?, ";
                updateValues.push(email);
            }
            if (role) {
                updateQuery += "role = ?, ";
                updateValues.push(role);
            }
            if (status) {
                updateQuery += "status = ?, ";
                updateValues.push(status);
            }

            // Remover la última coma y espacio
            updateQuery = updateQuery.slice(0, -2);
            updateQuery += " WHERE id = ?";
            updateValues.push(id);

            db.query(updateQuery, updateValues, (err, result) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json({
                    msg: "Usuario actualizado exitosamente"
                });
            });
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Eliminar un usuario
const usuarioDelete = (req, res) => {
    const { id } = req.params;

    db.query("UPDATE usuarios SET status = 'inactive' WHERE id = ?", 
        [id], 
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            if (result.affectedRows === 0) {
                return res.status(404).json({
                    msg: "Usuario no encontrado"
                });
            }
            res.json({
                msg: "Usuario desactivado exitosamente"
            });
        }
    );
};

// Login de usuario
const usuarioLogin = async (req, res) => {
    const { username, password } = req.body;

    try {
        db.query("SELECT * FROM usuarios WHERE username = ?", 
            [username],
            async (err, results) => {
                if (err) return res.status(500).json({ error: err.message });
                if (results.length === 0) {
                    return res.status(400).json({
                        msg: "Usuario o contraseña incorrectos"
                    });
                }

                const usuario = results[0];
                
                // Verificar si el usuario está activo
                if (usuario.status === 'inactive') {
                    return res.status(403).json({
                        msg: "Usuario inactivo"
                    });
                }

                const validPassword = await bcrypt.compare(password, usuario.password);

                if (!validPassword) {
                    return res.status(400).json({
                        msg: "Usuario o contraseña incorrectos"
                    });
                }

                res.json({
                    msg: "Login exitoso",
                    usuario: {
                        id: usuario.id,
                        username: usuario.username,
                        email: usuario.email,
                        role: usuario.role
                    }
                });
            }
        );
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    usuariosGet,
    usuarioGetById,
    usuarioCreate,
    usuarioUpdate,
    usuarioDelete,
    usuarioLogin
};
