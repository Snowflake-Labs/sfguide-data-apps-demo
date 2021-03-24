var monthlyChart;
var dayOfWeekChart;
var temperatureChart;

// utility fn for randomizing a number between min and max
function randomValueBetween(min, max) {
  return Math.random() * (max - min) + min;
}

// utility fn to get two random days in successive order
function randomizeDates() {
  // min and max dates
  const minDate = new Date('2013-06-01');
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

// build params for montly trips chart (for chart.js)
function getMonthlyTripsChartParams(data) {
  // extract data
  var data_labels = [];
  var data_values = [];
  for (item of data) {
    data_labels.push(item.MONTH);
    data_values.push(item.TRIP_COUNT);
  }
  var chart_params = {
    type: 'bar',
    data: {
        labels: data_labels,
        datasets: [{
            label: 'Total Trips',
            backgroundColor: 'rgb(0, 41, 94)',
            data: data_values
        }]
    },
    options: {
      title: { display: true, text: 'Trips by Month' },
      scales: {
        xAxes: [{
          scaleLabel: { display: true, labelString: 'Month' },
          gridLines: { display: false } }],
        yAxes: [{
          scaleLabel: { display: true, labelString: 'Trip Count' },
          ticks: { callback: (value, idx, values) => {
                    return value.toLocaleString();
                   }
                 } }]
      },
      legend: { display: false }
    }
  }
  return chart_params
}

// build params for day of week trips chart (for chart.js)
function getDayOfWeekTripsChartParams(data) {
  // extract data
  var data_labels = [];
  var data_values = [];
  for (item of data) {
    data_labels.push(item.DAY_OF_WEEK);
    data_values.push(item.TRIP_COUNT);
  }
  var chart_params = {
      type: 'bar',
      data: {
          labels: data_labels,
          datasets: [{
              label: 'Total Trips',
              backgroundColor: 'rgb(0, 41, 94)',
              data: data_values
          }]
      },
      options: {
        title: { display: true, text: 'Trips by Day of Week' },
        scales: {
          xAxes: [{
            scaleLabel: { display: true, labelString: 'Weekday' },
            gridLines: { display:false }
          }],
          yAxes: [{
            scaleLabel: { display: true, labelString: 'Trip Count' },
            ticks: { callback: (value, idx, values) => {
                      return value.toLocaleString();
                     }
                   }
          }]
        },
        legend: { display: false }
      }
  };
  return chart_params;
}

function getTemperatureChartParams(data) {
  var data_labels = [];
  var data_values = [];
  for (item of data) {
    if (item.TEMP===null) continue;
    data_labels.push(String(item.TEMP) + "s");
    data_values.push(item.TRIP_COUNT);
  }
  var chart_params = {
      type: 'bar',
      data: {
          labels: data_labels,
          datasets: [{
              label: 'Total Trips',
              backgroundColor: 'rgb(115, 50, 168)',
              data: data_values
          }]
      },
      options: {
        title: { display: true, text: 'Trips by Temperature' },
        scales: {
          xAxes: [{
            scaleLabel: { display: true, labelString: 'Temperature (F)' },
            gridLines: { display:false }
          }],
          yAxes: [{
            scaleLabel: { display: true, labelString: 'Trip Count' },
            ticks: { callback: (value, idx, values) => {
                      return value.toLocaleString();
                     }
                   }
          }]
        },
        legend: { display: false }
      }
    }
    return chart_params;
}

// update charts for given date range
function updateCharts(dateRange) {
  // update all charts
  updateMonthlyTripsChart(dateRange);
  updateDayOfWeekTripsChart(dateRange);
  updateTemperatureChart(dateRange);

  // set date
  if(dateRange) {
    // set custom/random dates
    $("#customStart").val(moment(dateRange[0]).format('YYYY-MM-DD'));
    $("#customEnd").val(moment(dateRange[1]).format('YYYY-MM-DD'));
  } else {
    // set all-time dates
    $("#customStart").val(moment('2013-06-01').format('YYYY-MM-DD'));
    $("#customEnd").val(moment('2020-05-01').format('YYYY-MM-DD'));
  }
}

// add dates to querystring
function addDatesToQuerystring(querystring, dates) {
  if (dates) {
    return querystring + "?start=" + dates[0] + '&end=' + dates[1];
  }
  return querystring;
}

// make call to api and udpate client for new day of week trips
function updateDayOfWeekTripsChart(dates) {
  var dayOfWeekUrl = "/trips/day_of_week";
  var dayOfWeekUrl = addDatesToQuerystring(dayOfWeekUrl, dates);

  $.ajax({
    url: dayOfWeekUrl,
    type: "GET",
    success: function(data) {
      // build chart
      var params = getDayOfWeekTripsChartParams(data)
      if (dayOfWeekChart) {
        dayOfWeekChart.data = params.data;
        dayOfWeekChart.update();
      } else {
        var ctx = document.getElementById('tripsDayOfWeek');
        ctx.height = 75;
        dayOfWeekChart = new Chart(ctx, params);
      }
    },
    error: function(error) {
      console.log(error);
    }
  });
}

// make call to api and udpate client for monthly trips
function updateMonthlyTripsChart(dates) {
  var monthlyUrl = "/trips/monthly";
  var monthlyUrl = addDatesToQuerystring(monthlyUrl, dates);

  $.ajax({
    url: monthlyUrl,
    type: "GET",
    success: function(data) {
      // build chart
      var params = getMonthlyTripsChartParams(data)
      if (monthlyChart) {
        monthlyChart.data = params.data;
        monthlyChart.update();
      } else {
        var ctx = document.getElementById('tripsMonthly');
        ctx.height = 75;
        monthlyChart = new Chart(ctx, params);
      }
    },
    error: function(error) {
      console.log(error);
    }
  });
}

function updateTemperatureChart(dates) {
  var tempUrl = "/trips/temperature";
  var tempUrl = addDatesToQuerystring(tempUrl, dates);

  $.ajax({
    url: tempUrl,
    type: "GET",
    success: function(data) {
      // build chart
      var params = getTemperatureChartParams(data)
      if (temperatureChart) {
        temperatureChart.data = params.data;
        temperatureChart.update();
      } else {
        var ctx = document.getElementById('weatherTrips');
        ctx.height = 75;
        temperatureChart = new Chart(ctx, params);
      }
    },
    error: function(error) {
      console.log(error);
    }
  });
}

// handle randomize dates click
$(document).ready(function () {
  $('#randomizeButton').click(function(){
    var randomDates = randomizeDates();
    var newStartDate = randomDates[0];
    var newEndDate = randomDates[1];
    updateCharts(randomDates);
  });
});

$(document).ready(function () {
  // don't supply a date range on load (all-time range)
  updateCharts(null);

  // listen for custom date range
  $("form").on('submit', function (e) {
     updateCustomDates();
     e.preventDefault();
  });
});

// handler for custom date range submission
function updateCustomDates() {
  var newStartDate = moment($('#customStart').val()).format('L');
  var newEndDate = moment($('#customEnd').val()).format('L');
  var customDates = [newStartDate, newEndDate];
  updateCharts(customDates);
}
