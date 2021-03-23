/*
 * Configuration File Setup
 * 1. Create a copy of this file named "config.js" in same directory
 * 2. Edit values in <>s in "config.js" corresponding to your snowflake demo
 *    instance
 */
var config = {
  snowflake_account: '<account>',
  snowflake_user: '<user>',
  snowflake_password: '<password>',
  snowflake_database: 'CITIBIKE',
  snowflake_schema: 'DEMO',
  snowflake_warehouse: 'WEB_SMALL_WH'
}
module.exports = config;
