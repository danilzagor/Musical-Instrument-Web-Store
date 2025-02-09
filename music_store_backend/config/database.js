const mysql = require('mysql2/promise');

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    port: 3307,
    password: '12345678',
    database: 'musica',
});

module.exports = db;