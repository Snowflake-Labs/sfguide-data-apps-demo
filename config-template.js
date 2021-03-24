/*
 * Configuration File Setup
 * 1. Create a copy of this file named "config.js" in same directory
 * 2. Edit values in <>s in "config.js" corresponding to your snowflake demo
 *    instance
 */
var config = {
  snowflake_account: '<account>',
  snowflake_user: '<user>',
  snowflake_private_key: "<full path to your users private key>",
  snowflake_database: 'DATA_APPS_DEMO',
  snowflake_schema: 'DEMO',
  snowflake_warehouse: 'DATA_APPS_DEMO'
}
module.exports = config;
