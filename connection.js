const mysql = require("mysql2");
const util = require("util");

const pool = mysql.createPool({
    host: "bjydansfugroisrlj0ls-mysql.services.clever-cloud.com",
    user: "ugyf4hcdzulimg5e",
    password: "Mj98589FLIhrXHSLzqAb",
    database: "bjydansfugroisrlj0ls",
   
});

// promisify pool.query
const exe = util.promisify(pool.query).bind(pool);

module.exports = exe;
