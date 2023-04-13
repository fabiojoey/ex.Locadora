const mysql = require('mysql')

const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'locadora'
})

pool.getConnection(function (err, connection) {
    if (err) throw err
    console.log('Connected to database!')
})

module.exports = pool
