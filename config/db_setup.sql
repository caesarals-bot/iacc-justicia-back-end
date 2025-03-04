-- Drop table if exists to ensure clean creation
DROP TABLE IF EXISTS usuarios;

-- Create usuarios table
CREATE TABLE usuarios (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL,
    role VARCHAR(10) NOT NULL DEFAULT 'user',
    status VARCHAR(10) NOT NULL DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT uk_username UNIQUE (username),
    CONSTRAINT uk_email UNIQUE (email),
    CONSTRAINT chk_role CHECK (role IN ('admin', 'user')),
    CONSTRAINT chk_status CHECK (status IN ('active', 'inactive'))
);

-- Create default admin user
-- Password: admin123 (hashed with bcrypt)
INSERT INTO usuarios (username, password, email, role) 
VALUES (
    'admin',
    '$2a$10$8Ux9XBWGKmBcYNR5hkVyPOYxZHXCLqS9l0dKtjx7KQFmBxhXmQn3.',
    'admin@sistema.com',
    'admin'
);
