
const sql = require("mssql")
const { serve } = require("swagger-ui-express")
const config = {
    user: 'adminalreem',
    password: '97919895@Reem',
    server: 'serveruser.database.windows.net',
    database: 'ShoppingDB2024', 
    options:{
        encrypt:true
    }
};

sql.connect(config).catch(error => console.log(error)) 
module.exports = sql;