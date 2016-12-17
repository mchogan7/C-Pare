//Make mess below:

//https://www.cryptonator.com/api
//https://www.cryptocompare.com/api/#-api-data-coinlist-
//https://coinmarketcap.com/api/

//Collect global variables here:
var tickerSymbol
var chartViewerArray = [];
var chartLabels = [];

for (var i = 0; i < 492; i++) {
	chartLabels.push(i)
}



//Quandle AJAX Call - Work in progress
//quandle key EDWEb1oyzs8FrfoFyG1u
function stockAJAX() {
    var queryURL = "https://www.quandl.com/api/v3/datasets/WIKI/" + tickerSymbol + ".json?column_index=4&start_date=2015-01-01&end_date=2016-12-14&collapse=daily&api_key=EDWEb1oyzs8FrfoFyG1u";
    $.ajax({ url: queryURL, method: "GET" }).done(function(response) {
    	console.log(response)
        var stocksChartData = []
		//resetChartLabels
        for (var i = 0; i < response.dataset.data.length; i++) {
            stocksChartData.push(response.dataset.data[i][1])
            
        }
        console.log(chartLabels)

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

        	chartViewerArray.push(stockDataObject)
        	mainChart.update();

    })
}

//End of Quandle AJAX Call

//Testing function
//tickerConverter('apple')

//Ticker Converter Function
function tickerConverter(userSearch) {
    $.ajax({
        success: function(response) {
            tickerSymbol = response.ResultSet.Result[0].symbol
                //We will have to put the function for the next AJAX request here.
                //This is to avoid any async issues.
            stockAJAX();
            //log to show it is working.	
            console.log(tickerSymbol)
            console.log(response)
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


//Chart Stuff Below here


//Points to chart in the DOM
var ctx = $("#mainChart");



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


//UI and DOM stuff below here:

$('#compare').on('click', function(e) {
    e.preventDefault();
    var userInput = $('#query-input').val().trim();
    tickerConverter(userInput)
})
