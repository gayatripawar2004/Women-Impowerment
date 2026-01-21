const mysql = require("mysql2");
const util = require("util");

const pool = mysql.createPool({
    host: "bs0cflawbzpbcqdn1eoy-mysql.services.clever-cloud.com",
    user: "ue2dkblryxvutm0v",
    password: "0EmD0TFnUhZlczj2bo2G",
    database: "bs0cflawbzpbcqdn1eoy",
   
});

// promisify pool.query
const exe = util.promisify(pool.query).bind(pool);

module.exports = exe;
