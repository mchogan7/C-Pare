//Make mess below:

//https://www.cryptonator.com/api
//https://www.cryptocompare.com/api/#-api-data-coinlist-
//https://coinmarketcap.com/api/

//Collect global variables here:
var tickerSymbol
var exchange
var chartViewerArray = [];
var chartLabels = [];
var userInput;

var stockLookUp = [{
    targetWord: "GOOG",
    queryWord: ["google", "gooogle", "googel", "alphabet"]
}, {
    targetWord: "FB",
    queryWord: ["facebook", "face book"]
}]


//Generates place holder labels for the chart so it will display the full dataset.
//Will be replaced with a real solution.
for (var i = 0; i < 492; i++) {
    chartLabels.push(i)
}

//Quandle AJAX Call
function stockAJAX() {
    var correctedSearch = lookUp(userInput, stockLookUp);
    //Checks user search against the yahoo ticker converter and our stockLookup table.

    if (!correctedSearch && (exchange !== 'NASDAQ' && exchange !== 'NYSE')) {

        console.log('Search not found on NASDAQ or NYSE') //This will be reaplced with an error display function

        //If not found in stockLookUp table, use the yahoo ticker converter output.
    } else if (!correctedSearch) {
        tickerSymbol = tickerSymbol
            //If found in stockLookUp table, change the ticker symbol to be searched.
    } else {
        tickerSymbol = correctedSearch
    }

    //get cuurent date in the query's desired format
    var today = moment().format('YYYY-MM-DD')

    var queryURL = "https://www.quandl.com/api/v3/datasets/WIKI/" + tickerSymbol + ".json?column_index=4&start_date=2015-01-01&end_date=" + today + "&collapse=daily&api_key=EDWEb1oyzs8FrfoFyG1u";
    $.ajax({ url: queryURL, method: "GET" }).done(function(response) {

        //Initializes and clears the price data to be sent to the stockDataObject
        var stocksChartData = []

        //Loops through the response and pushes price data to the stocksChartData array
        for (var i = 0; i < response.dataset.data.length; i++) {
            stocksChartData.push(response.dataset.data[i][1])
        }

        //This is the object format to be sent to the chart.
        var stockDataObject = {
            label: response.dataset.dataset_code,
            fill: false,
            lineTension: 0.1,
            backgroundColor: "rgba(75,192,192,0.4)",
            borderColor: "rgba(75,192,192,1)",
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: "rgba(75,192,192,1)",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgba(75,192,192,1)",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: stocksChartData,
            spanGaps: false,
        }

        //Pushes dataObject to the viewer array, then updates the chart in the browers.
        chartViewerArray.push(stockDataObject)
        mainChart.update();
        zoomChart.update();
    })
}
//End of Quandle AJAX Call


//Ticker Converter Function - This is specific to the stockAJAX call.
function tickerConverter(userSearch) {
    $.ajax({
        success: function(response) {
            exchange = response.ResultSet.Result[0].exchDisp
            tickerSymbol = response.ResultSet.Result[0].symbol
            //the stockAJAX function has to be called here to avoid async issues.
            stockAJAX();
        },
        type: "GET",
        url: "http://d.yimg.com/autoc.finance.yahoo.com/autoc",
        data: {
            query: userSearch,
            region: 'US',
            lang: 'en-US'
        },
        dataType: "jsonp"
    })
}

//CHART GLOBAL SETTINGS:

//Points to chart in the DOM
var ctx = $("#mainChart");
var zcht = $("#zoomChart");

//Global Chart settings
var mainChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: chartLabels,
        datasets: chartViewerArray
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});

//small zoom chart eventually to have a slider superimposed on it.
//can't get slider to work at the moment
var zoomChart = new Chart(zcht, {
    type: 'line',
    data: {
        labels: chartLabels,
        datasets: chartViewerArray
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});

//END OF CHART GLOBAL SETTINGS

//UI AND DOM SECTION:

$('#compare').on('click', function(e) {
    e.preventDefault();
    userInput = $('#query-input').val().trim();
    tickerConverter(userInput)
})

//END OF UI AND DOM SECTION

//REUSABLE FUNCTIONS:

//lookUp table function.
//Feed it a search query and and lookUptable object. It will return the result.
function lookUp(query, lookUptable) {
    for (var i = 0; i < lookUptable.length; i++) {
        //if the query word is found, return the target word it was found under:
        if (lookUptable[i].queryWord.indexOf(query) !== -1) {
            return lookUptable[i].targetWord
        }
    }
}

//END OF REUSABLE FUNCTIONS
