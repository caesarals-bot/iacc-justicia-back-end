const db = require('./db');
const bcrypt = require('bcryptjs');

const createUsersTable = async () => {
    try {
        // Drop table if exists
        await db.promise().query('DROP TABLE IF EXISTS usuarios');

        // Create table
        const createTableSQL = `
            CREATE TABLE usuarios (
                id INT NOT NULL AUTO_INCREMENT,
                username VARCHAR(50) NOT NULL,
                password VARCHAR(255) NOT NULL,
                email VARCHAR(100) NOT NULL,
                role VARCHAR(10) DEFAULT 'user',
                status VARCHAR(10) DEFAULT 'active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                PRIMARY KEY (id),
                UNIQUE KEY uk_username (username),
                UNIQUE KEY uk_email (email)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `;
        
        await db.promise().query(createTableSQL);
        console.log('Tabla usuarios creada exitosamente');

        // Create default admin user
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);

        const insertAdminSQL = `
            INSERT INTO usuarios (username, password, email, role) 
            VALUES (?, ?, ?, ?)
        `;

        await db.promise().query(insertAdminSQL, [
            'admin',
            hashedPassword,
            'admin@sistema.com',
            'admin'
        ]);

        console.log('Usuario administrador creado exitosamente');
        console.log('Credenciales por defecto:');
        console.log('Username: admin');
        console.log('Password: admin123');

        process.exit(0);
    } catch (error) {
        console.error('Error al configurar la base de datos:', error);
        process.exit(1);
    }
};

createUsersTable();
