const request = require('supertest');
const bcrypt = require('bcryptjs');
const db = require('../config/db');
const Server = require('../models/server');

const server = new Server();
const app = server.app;

// Mock de la base de datos
jest.mock('../config/db', () => ({
    query: jest.fn()
}));

describe('Login de Usuarios', () => {
    beforeEach(() => {
        // Limpiar todos los mocks antes de cada prueba
        jest.clearAllMocks();
    });

    test('Login exitoso con credenciales válidas', async () => {
        // Crear un hash de contraseña válido
        const hashedPassword = await bcrypt.hash('password123', 10);

        // Mock de usuario activo en la base de datos
        db.query.mockImplementation((query, params, callback) => {
            callback(null, [{
                id: 1,
                username: 'usuario_test',
                password: hashedPassword,
                email: 'test@example.com',
                role: 'user',
                status: 'active'
            }]);
        });

        const response = await request(app)
            .post('/api/usuarios/login')
            .send({
                username: 'usuario_test',
                password: 'password123'
            });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('msg', 'Login exitoso');
        expect(response.body.usuario).toHaveProperty('username', 'usuario_test');
    });

    test('Login fallido con credenciales inválidas', async () => {
        // Mock de usuario no encontrado
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

    test('Login fallido con contraseña incorrecta', async () => {
        // Crear un hash de contraseña diferente
        const hashedPassword = await bcrypt.hash('password_correcto', 10);

        // Mock de usuario con contraseña diferente
        db.query.mockImplementation((query, params, callback) => {
            callback(null, [{
                id: 1,
                username: 'usuario_test',
                password: hashedPassword,
                email: 'test@example.com',
                role: 'user',
                status: 'active'
            }]);
        });

        const response = await request(app)
            .post('/api/usuarios/login')
            .send({
                username: 'usuario_test',
                password: 'password_incorrecto'
            });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('msg', 'Usuario o contraseña incorrectos');
    });

    test('Login fallido con usuario inactivo', async () => {
        // Crear un hash de contraseña válido
        const hashedPassword = await bcrypt.hash('password123', 10);

        // Mock de usuario inactivo
        db.query.mockImplementation((query, params, callback) => {
            callback(null, [{
                id: 1,
                username: 'usuario_inactivo',
                password: hashedPassword,
                email: 'inactivo@example.com',
                role: 'user',
                status: 'inactive'
            }]);
        });

        const response = await request(app)
            .post('/api/usuarios/login')
            .send({
                username: 'usuario_inactivo',
                password: 'password123'
            });

        expect(response.status).toBe(403);
        expect(response.body).toHaveProperty('msg', 'Usuario inactivo');
    });

    test('Login fallido por error de servidor', async () => {
        // Mock de error en la base de datos
        db.query.mockImplementation((query, params, callback) => {
            callback(new Error('Error de conexión a la base de datos'), null);
        });

        const response = await request(app)
            .post('/api/usuarios/login')
            .send({
                username: 'usuario_test',
                password: 'password123'
            });

        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty('error');
    });
});
