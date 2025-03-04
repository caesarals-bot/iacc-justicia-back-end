const express = require("express");
const router = express.Router();
const { 
    usuariosGet, 
    usuarioGetById, 
    usuarioCreate, 
    usuarioUpdate, 
    usuarioDelete,
    usuarioLogin
} = require("../controllers/usuarios");

// Middleware para verificar rol de administrador
const isAdmin = (req, res, next) => {
    const userRole = req.headers['user-role'];
    if (userRole !== 'admin') {
        return res.status(403).json({
            msg: "No tiene permisos para realizar esta acción"
        });
    }
    next();
};

// Rutas públicas
router.post("/login", usuarioLogin);

// Rutas protegidas que requieren rol de administrador
router.get("/", isAdmin, usuariosGet);
router.get("/:id", isAdmin, usuarioGetById);
router.post("/", isAdmin, usuarioCreate);
router.put("/:id", isAdmin, usuarioUpdate);
router.delete("/:id", isAdmin, usuarioDelete);

module.exports = router;
