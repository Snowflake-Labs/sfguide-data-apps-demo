const snowflake = require('../database/snowflake.js');

const Trip = function() {}

// query Snowflake to get monthly trip data
Trip.countByMonth = (start_date, end_date, cb) => {
  // check if filtering on date range
  if (start_date && end_date) {
    var sql = 'select COUNT(*) as trip_count, MONTHNAME(starttime) as month ' +
      'from demo.trips ' +
      'where starttime between ? and ? ' +
      'group by MONTH(starttime), MONTHNAME(starttime) ' +
      'order by MONTH(starttime);'
    if ("MATERIALIZED" in process.env) {
      console.log("...using materialized view COUNT_BY_DAY_MVW");
      sql = 'select SUM(trip_count) as trip_count, MONTHNAME(starttime) as month ' +
        'from demo.COUNT_BY_DAY_MVW ' +
        'where starttime between ? and ? ' +
        'group by MONTH(starttime), MONTHNAME(starttime) ' +
        'order by MONTH(starttime);'
    }
    snowflake.query(sql, [start_date, end_date]).then(rows => {cb(null, rows)}).catch(err => {cb(err, null)});
  } else {
    var sql = 'select COUNT(*) as trip_count, MONTHNAME(starttime) as month ' +
      'from demo.trips ' +
      'group by MONTH(starttime), MONTHNAME(starttime) ' +
      'order by MONTH(starttime);'
      if ("MATERIALIZED" in process.env) {
        console.log("...using materialized view COUNT_BY_MONTH_MVW");
        sql = 'select * from demo.COUNT_BY_MONTH_MVW order by starttime;'
      }
    snowflake.query(sql).then(rows => {cb(null, rows)}).catch(err => {cb(err, null)});
  }
}

// query Snowflake to get day of week trip data
Trip.countByDayOfWeek = (start_date, end_date, cb) => {
  // check if filtering on date range
  if (start_date && end_date) {
    var sql = 'select count(*) as trip_count, dayname(starttime) as day_of_week ' +
            'from demo.trips ' +
            'where starttime between ? and ? ' +
            'group by dayofweek(starttime), dayname(starttime) ' +
            'order by dayofweek(starttime);';
    snowflake.query(sql, [start_date, end_date]).then(rows => {cb(null, rows)}).catch(err => {cb(err, null)});
  } else {
    var sql = 'select count(*) as trip_count, dayname(starttime) as day_of_week ' +
            'from demo.trips ' +
            'group by dayofweek(starttime), dayname(starttime) ' +
            'order by dayofweek(starttime);';
    snowflake.query(sql).then(rows => {cb(null, rows)}).catch(err => {cb(err, null)});
  }
}

Trip.countByTemperature = (start_date, end_date, cb) => {
  // check if filtering on date range
  if (start_date && end_date) {
    var sql = 'with weather_trips as (select * from demo.trips t ' +
                    'inner join demo.weather w ' +
                    'on date_trunc("day", t.starttime) = w.observation_date) ' +
                    'select round(temp_avg_f, -1) as temp, count(*) as trip_count ' +
                    'from weather_trips ' +
                    'where starttime between ? and ? ' +
                    'group by round(temp_avg_f, -1) ' +
                    'order by round(temp_avg_f, -1) asc;';
    snowflake.query(sql, [start_date, end_date]).then(rows => {cb(null, rows)}).catch(err => {cb(err, null)});
  } else {
    var sql = 'with weather_trips as (select * from demo.trips t ' +
                    'inner join demo.weather w ' +
                    'on date_trunc("day", t.starttime) = w.observation_date) ' +
                    'select round(temp_avg_f, -1) as temp, count(*) as trip_count ' +
                    'from weather_trips ' +
                    'group by round(temp_avg_f, -1) ' +
                    'order by round(temp_avg_f, -1) asc;';
    snowflake.query(sql).then(rows => {cb(null, rows)}).catch(err => {cb(err, null)});
  }
}

module.exports = Trip;
