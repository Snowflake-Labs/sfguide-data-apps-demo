var db = require('../../database/db');
const config = require('../../config')

var query = "create table citibike.demo.weather as " +
            "select state                                 state, " +
            "    date_valid_std                             observation_date, " +
            "    doy_std                                    day_of_year, " +
            "    min_temperature_air_2m_f                   temp_min_f, " +
            "    max_temperature_air_2m_f                   temp_max_f, " +
            "    avg_temperature_air_2m_f                   temp_avg_f, " +
            "    utils.degFtoC(min_temperature_air_2m_f)    temp_min_c, " +
            "    utils.degFtoC(max_temperature_air_2m_f)    temp_max_c, " +
            "    utils.degFtoC(avg_temperature_air_2m_f)    temp_avg_c, " +
            "    tot_precipitation_in                       tot_precip_in, " +
            "    tot_snowfall_in                            tot_snowfall_in, " +
            "    tot_snowdepth_in                           tot_snowdepth_in, " +
            "    truncate(tot_precipitation_in * 25.4, 1)   tot_precip_mm, " +
            "    truncate(tot_snowfall_in * 25.4, 1)        tot_snowfall_mm, " +
            "    truncate(tot_snowdepth_in * 25.4, 1)       tot_snowdepth_mm " +
            "from weather.weather_v3.history_day " +
            "where postal_code = '12201';";

db.execute({
  sqlText: query,
  complete: (err, stmt, rows) => {
    if (err) throw err;
    console.log('...created weather table');
  }
});
