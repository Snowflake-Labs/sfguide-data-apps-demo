const db = require('../database/db.js');

const Trip = function() {}

// query Snowflake to get monthly trip data
Trip.countByMonth = (start_date, end_date, cb) => {
  // check if filtering on date range
  if (start_date && end_date) {
    var oquery = 'select COUNT(*) as trip_count, MONTHNAME(starttime) as month ' +
            'from demo.trips ' +
            'where starttime between ? and ? ' +
            'group by MONTH(starttime), MONTHNAME(starttime) ' +
            'order by MONTH(starttime);'
    var mquery = 'select SUM(trip_count) as trip_count, MONTHNAME(starttime) as month ' +
            'from demo.COUNT_BY_DAY_MVW ' +
            'where starttime between ? and ? ' +
            'group by MONTH(starttime), MONTHNAME(starttime) ' +
            'order by MONTH(starttime);'
    db.execute({
      sqlText: oquery,
      binds: [start_date, end_date],
      complete: (err, stmt, rows) => {
        if (err) throw err;
        cb(null, rows);
      }
    });
  } else {
    var oquery = 'select COUNT(*) as trip_count, MONTHNAME(starttime) as month ' +
            'from demo.trips ' +
            'group by MONTH(starttime), MONTHNAME(starttime) ' +
            'order by MONTH(starttime);'
    var mquery = 'select * from demo.COUNT_BY_MONTH_MVW order by starttime;'
    db.execute({
      sqlText: oquery,
      complete: (err, stmt, rows) => {
        if (err) throw err;
        cb(null, rows);
      }
    });
  }
}

// query Snowflake to get day of week trip data
Trip.countByDayOfWeek = (start_date, end_date, cb) => {
  // check if filtering on date range
  if (start_date && end_date) {
    var query = 'select count(*) as trip_count, dayname(starttime) as day_of_week ' +
            'from demo.trips ' +
            'where starttime between ? and ? ' +
            'group by dayofweek(starttime), dayname(starttime) ' +
            'order by dayofweek(starttime);';
    db.execute({
      sqlText: query,
      binds: [start_date, end_date],
      complete: (err, stmt, rows) => {
        if (err) throw err;
        cb(null, rows);
      }
    });
  } else {
    var query = 'select count(*) as trip_count, dayname(starttime) as day_of_week ' +
            'from demo.trips ' +
            'group by dayofweek(starttime), dayname(starttime) ' +
            'order by dayofweek(starttime);';
    db.execute({
      sqlText: query,
      complete: function(err, stmt, rows){
        if (err) throw err;
        cb(null, rows);
      }
    });
  }
}

Trip.countByTemperature = (start_date, end_date, cb) => {
  // check if filtering on date range
  if (start_date && end_date) {
    var query = 'with weather_trips as (select * from demo.trips t ' +
                    'inner join demo.weather w ' +
                    'on date_trunc("day", t.starttime) = w.observation_date) ' +
                    'select round(temp_avg_f, -1) as temp, count(*) as trip_count ' +
                    'from weather_trips ' +
                    'where starttime between ? and ? ' +
                    'group by round(temp_avg_f, -1) ' +
                    'order by round(temp_avg_f, -1) asc;';
    db.execute({
      sqlText: query,
      binds: [start_date, end_date],
      complete: (err, stmt, rows) => {
        if (err) throw err;
        cb(null, rows);
      }
    });
  } else {
    var query = 'with weather_trips as (select * from demo.trips t ' +
                    'inner join demo.weather w ' +
                    'on date_trunc("day", t.starttime) = w.observation_date) ' +
                    'select round(temp_avg_f, -1) as temp, count(*) as trip_count ' +
                    'from weather_trips ' +
                    'group by round(temp_avg_f, -1) ' +
                    'order by round(temp_avg_f, -1) asc;';
    db.execute({
      sqlText: query,
      complete: function(err, stmt, rows){
        if (err) throw err;
        cb(null, rows);
      }
    });
  }
}

module.exports = Trip;
