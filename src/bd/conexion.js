require('dotenv').config();
const {Pool} = require('pg');

const pool = new Pool({
    connectionString: process.env.CONNECTIONSTRING,
     ssl: {
        rejectUnauthorized: false
    }
    /*user: process.env.USER,
    host: process.env.HOST,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: process.env.PORTSQL*/
})
    /*user: "postgres",
    host: "localhost",
    database: "sistema-encuestas",
    password: "admin",
    port: 5432,*/

pool.connect((err,client,done) => {
    if(!err){
        console.log("Conexion establecida")
    }else{
        console.log(err)
    }
})

module.exports = pool;
