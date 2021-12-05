require('dotenv').config();
const {Pool} = require('pg');

const pool = new Pool({
    user: process.env.USER,
    host: process.env.HOST,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: process.env.PORTSQL
})
    /*user: "postgres",
    host: "localhost",
    database: "sistema-encuestas",
    password: "admin",
    port: 5432,*/
module.exports = pool;