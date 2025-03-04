const request = require('supertest');
const bcrypt = require('bcryptjs');
const express = require('express');
const db = require('../config/db');

// Crear una aplicación Express para las pruebas
const app = express();
app.use(express.json());

// Importar el controlador de usuarios
const { usuarioLogin } = require('../controllers/usuarios');

// Configurar la ruta de login para las pruebas
app.post('/api/usuarios/login', usuarioLogin);

// Mock de la base de datos
jest.mock('../config/db', () => ({
    query: jest.fn()
}));

describe('Pruebas de Login', () => {
    beforeEach(() => {
        // Limpiar los mocks antes de cada prueba
        jest.clearAllMocks();
    });

    test('Login exitoso con credenciales válidas', async () => {
        const hashedPassword = await bcrypt.hash('password123', 10);
        
        // Simular usuario activo en la base de datos
        db.query.mockImplementation((query, params, callback) => {
            callback(null, [{
                id: 1,
                username: 'test_user',
                password: hashedPassword,
                email: 'test@example.com',
                role: 'user',
                status: 'active'
            }]);
        });

        const response = await request(app)
            .post('/api/usuarios/login')
            .send({
                username: 'test_user',
                password: 'password123'
            });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('msg', 'Login exitoso');
        expect(response.body.usuario).toHaveProperty('username', 'test_user');
    });

    test('Login fallido con credenciales inválidas', async () => {
        // Simular usuario no encontrado
        db.query.mockImplementation((query, params, callback) => {
            callback(null, []);
        });

        const response = await request(app)
            .post('/api/usuarios/login')
            .send({
                username: 'usuario_inexistente',
                password: 'password123'
            });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('msg', 'Usuario o contraseña incorrectos');
    });

    test('Login fallido con usuario inactivo', async () => {
        const hashedPassword = await bcrypt.hash('password123', 10);
        
        // Simular usuario inactivo
        db.query.mockImplementation((query, params, callback) => {
            callback(null, [{
                id: 1,
                username: 'inactive_user',
                password: hashedPassword,
                email: 'inactive@example.com',
                role: 'user',
                status: 'inactive'
            }]);
        });

        const response = await request(app)
            .post('/api/usuarios/login')
            .send({
                username: 'inactive_user',
                password: 'password123'
            });

        expect(response.status).toBe(403);
        expect(response.body).toHaveProperty('msg', 'Usuario inactivo');
    });
});
