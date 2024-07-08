
const sql = require("mssql")
const { serve } = require("swagger-ui-express")
const config = {
    user: 'sa',
    password: 'sa',
    server: 'localhost',
    database: 'Shopping_DB', 
    options:{
        trustServerCertificate:true
    }
};

sql.connect(config).catch(error => console.log(error)) 
module.exports = sql;