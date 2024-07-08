
const sql = require("mssql")
const { serve } = require("swagger-ui-express")
const config = {
    user: 'adminalreem',
    password: '97919895@Reen',
    server: 'serveruser.database.windows.net',
    database: 'Shopping_DB', 
    options:{
        encrypt:true
    }
};

sql.connect(config).catch(error => console.log(error)) 
module.exports = sql;