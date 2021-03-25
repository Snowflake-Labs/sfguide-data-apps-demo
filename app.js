const http = require('http');
const express = require('express');
const path = require('path');
const morgan = require('morgan');

// create express app, set up json parsing and logging
const app = express();
app.use(express.json());
app.use(morgan('dev'))
app.use(timeout(5000));

// static assets directory
app.use(express.static(path.join(__dirname, 'static')));

// custom middleware for parsing querystring params
const {parseDates,
       randomizer} = require('./middleware/parse_dates');
app.use(parseDates);
app.use(randomizer);

// api routes
const {getTripsByMonth,
       getTripsByDayOfWeek,
       getTripsByTemperature} = require('./routes/api/trips');

// router (homepage)
app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname+'/views/index.html'));
});

// router (api calls)
app.get('/trips/monthly', getTripsByMonth);
app.get('/trips/day_of_week', getTripsByDayOfWeek);
app.get('/trips/temperature', getTripsByTemperature);

// create server
const server = http.createServer(app);
const port = 3000;
server.listen(port);
console.debug('...server listening on port ' + port);
