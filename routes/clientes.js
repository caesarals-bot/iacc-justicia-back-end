const express = require("express");
const router = express.Router();
const { clientesGet, clienteGetById, clienteCreate, clienteDelete, clienteUpdate } = require("../controllers/clientes");

router.get("/", clientesGet);
router.get("/:id", clienteGetById);
router.post("/", clienteCreate);
router.put("/:rut", clienteUpdate); 
router.delete("/:id", clienteDelete);

module.exports = router;