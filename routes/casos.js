const express = require("express");
const router = express.Router();
const { crearCaso, obtenerCasos, obtenerCasoPorId, eliminarCaso } = require("../controllers/casos");

router.post("/", crearCaso);
router.get("/", obtenerCasos);
router.get("/:id", obtenerCasoPorId);
router.delete("/:id", eliminarCaso);

module.exports = router;