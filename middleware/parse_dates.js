const moment = require('moment')

function randomValueBetween(min, max) {
  return Math.random() * (max - min) + min;
}

// utility fn to get two random days in successive order
function randomizeDates() {
  // min and max dates
  const minDate = new Date('2019-05-01');
  const maxDate = new Date('2020-05-01');
  // randomize two dates
  var randomDate = randomValueBetween(minDate.getTime(), maxDate.getTime());
  var randomDate2 = randomValueBetween(minDate.getTime(), maxDate.getTime());
  // format dates
  randomDateFormatted = moment(new Date(randomDate)).format('L');
  randomDateFormatted2 = moment(new Date(randomDate2)).format('L');
  // return dates with earlier date first
  if (randomDate > randomDate2) {
    return [randomDateFormatted2, randomDateFormatted];
  }
  return [randomDateFormatted, randomDateFormatted2];
}


module.exports = {
  // pull out query string params for start and end of date ranges
  parseDates: (req, res, next) => {
    if ("start" in req.query && "end" in req.query) {
      req.start_range = req.query.start;
      req.end_range = req.query.end;
    } else if ("start" in req.query && "end" in req.query === false) {
      console.debug("Using only start for date range not implemented.");
      res.status(400).end();
      return;
    } else if ("end" in req.query && "start" in req.query === false) {
      console.debug("Using only end for date range not implemented.");
      res.status(400).end();
      return;
    } else {
      req.start_range = null;
      req.end_range = null;
    }
    next();
  },
  randomizer: (req, res, next) => {
    if ("random" in req.query && req.query.random === 'true') {
      // randomize dates between 6/1/2013 and 5/01/2020
      randomDates = randomizeDates();
      req.start_range = randomDates[0];
      req.end_range = randomDates[1];
    }
    next();
  }
}
