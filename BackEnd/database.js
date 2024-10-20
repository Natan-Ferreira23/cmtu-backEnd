const mysql = require('mysql2');
const database = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'cmtu'
});
database.connect((err) => {
    if (err) throw err;
    console.log('Conectado ao banco de dados MySQL');
});
module.exports = database;
