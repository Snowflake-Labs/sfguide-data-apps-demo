const snowflake = require('snowflake-sdk')
const config = require('../config')
const crypto = require('crypto')
const fs = require('fs')

var connection = snowflake.createConnection({
  account: config.snowflake_account,
  username: config.snowflake_user,
  authenticator: 'SNOWFLAKE_JWT',
  privateKey: crypto.createPrivateKey({
    key: fs.readFileSync(config.snowflake_private_key),
    format: 'pem'
  }).export({
    format: 'pem',
    type: 'pkcs8'
  }),
  database: config.snowflake_database,
  warehouse: config.snowflake_warehouse
});

connection.connect(function(err, conn) {
  if (err) throw err;
  console.log("...connected to snowflake");
});

module.exports = connection;
