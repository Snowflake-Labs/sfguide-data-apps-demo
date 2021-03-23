var db = require('../../database/db');
const config = require('../../config')

var query = "create or replace warehouse " + config.snowflake_warehouse + " " +
            "warehouse_size = small " +
            "min_cluster_count = 1 " +
            "max_cluster_count = 5 " +
            "auto_suspend = 300;";

db.execute({
  sqlText: query,
  complete: (err, stmt, rows) => {
    if (err) throw err;
    console.log('...created warehouse ' + config.snowflake_warehouse);
  }
});
