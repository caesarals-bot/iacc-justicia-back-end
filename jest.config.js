module.exports = {
    // Directorio donde Jest buscará los archivos de prueba
    testMatch: ['**/tests/**/*.test.js'],
    
    // Ambiente de pruebas
    testEnvironment: 'node',
    
    // Archivos a ignorar
    testPathIgnorePatterns: ['/node_modules/'],
    
    // Configuración de cobertura
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coveragePathIgnorePatterns: ['/node_modules/'],
    
    // Configuración de tiempo de espera
    testTimeout: 10000,
    
    // Configuración de informes
    verbose: true,
    
    // Setup de ambiente
    setupFiles: ['dotenv/config']
};
