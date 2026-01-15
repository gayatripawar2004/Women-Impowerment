var mysql = require("mysql2");
var util = require("util");
var url = require("url");

const conn = mysql.createConnection({
    host:"biuv65ldy5ygvxlttmhp-mysql.services.clever-cloud.com",
    user: "uwpq8ggyq5volmtm",
    password: "kKNaVEn7eH36u3ThMsXe",
    database:"biuv65ldy5ygvxlttmhp"
})

const exe = util.promisify(conn.query).bind(conn);

module.exports = exe;
