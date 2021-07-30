/*
 * Configuration File Setup
 * 1. Create a copy of this file named "config.js" in same directory
 * 2. Edit values in <>s in "config.js" corresponding to your snowflake demo
 *    instance
 */
var config = {
  snowflake_account: '<account>',
  snowflake_user: '<user>',
  snowflake_private_key: `-----BEGIN RSA PRIVATE KEY-----
  YOUR_PRIVATE_KEY_HERE_FOR_KEY_PAIR_AUTHN===
  -----END RSA PRIVATE KEY-----`,
  snowflake_database: 'DATA_APPS_DEMO',
  snowflake_schema: 'DEMO',
  snowflake_warehouse: 'DATA_APPS_DEMO',
  pool_max: 100
}
module.exports = config;
