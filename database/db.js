const snowflake = require('snowflake-sdk')
const config = require('../config')

var connection = snowflake.createConnection({
  account: config.snowflake_account,
  username: config.snowflake_user,
  password: config.snowflake_password,
  database: config.snowflake_database,
  warehouse: config.snowflake_warehouse,
  insecureConnect: true
});

connection.connect(function(err, conn) {
  if (err) throw err;
  console.log("...connected to snowflake");
});

module.exports = connection;
