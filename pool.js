const mysql = require('mysql2');

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST || "localhost",
    user: process.env.MYSQL_USER || "root",
    password: process.env.MYSQL_HOST || "1234",
    database: process.env.MYSQL_DB || "smoothie_cms"
}).promise();

module.exports = pool;
