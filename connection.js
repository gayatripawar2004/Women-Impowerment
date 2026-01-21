const mysql = require("mysql2");
const util = require("util");

const pool = mysql.createPool({
    host: "b8nbtpwsqwhv1q3kchzq-mysql.services.clever-cloud.com",
    user: "ub4eqhhklxadkzvq",
    password: "vIssacff1tCA0b5eCdOO",
    database: "b8nbtpwsqwhv1q3kchzq",
   
});

// promisify pool.query
const exe = util.promisify(pool.query).bind(pool);

module.exports = exe;
