const Server = require("./models/server");

// backend/index.js
require("dotenv").config();



const server = new Server();

server.listen();

