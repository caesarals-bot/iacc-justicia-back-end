
const express = require("express");
const cors = require("cors");
const clientesRoutes = require("../routes/clientes");
const casosRoutes = require("../routes/casos");

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT || 8081;
        this.clientesPath = "/api/clientes";
        this.casosPath = "/api/casos";

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
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Servidor corriendo en el puerto ${this.port}`);
        });
    }
}

module.exports = Server;
