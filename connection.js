var mysql = require("mysql2");
var util = require("util");
var url = require("url");

const conn = mysql.createConnection({
    host:"bs0cflawbzpbcqdn1eoy-mysql.services.clever-cloud.com",
    user: "ue2dkblryxvutm0v",
    password: "0EmD0TFnUhZlczj2bo2G",
    database:"bs0cflawbzpbcqdn1eoy"
})

const exe = util.promisify(conn.query).bind(conn);

module.exports = exe;
