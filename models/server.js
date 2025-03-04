
const express = require("express");
const cors = require("cors");
const clientesRoutes = require("../routes/clientes");
const casosRoutes = require("../routes/casos");
const usuariosRoutes = require("../routes/usuarios");

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT || 8081;
        this.clientesPath = "/api/clientes";
        this.casosPath = "/api/casos";
        this.usuariosPath = "/api/usuarios";

        // Middlewares
        this.middlewares();

        // Rutas de la aplicación
        this.routes();
    }

    middlewares() {
        // Habilitar CORS
        this.app.use(cors());
        
        // Parseo del body JSON
        this.app.use(express.json());
    }

    routes() {
        this.app.use(this.clientesPath, clientesRoutes);
        this.app.use(this.casosPath, casosRoutes);
        this.app.use(this.usuariosPath, usuariosRoutes);
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Servidor corriendo en el puerto ${this.port}`);
        });
    }
}

module.exports = Server;
