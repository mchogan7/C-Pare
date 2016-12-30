//Make mess below:

//https://www.cryptonator.com/api
//https://www.cryptocompare.com/api/#-api-data-coinlist-
//https://coinmarketcap.com/api/

//Initialize Firebase
var config = {
    apiKey: "AIzaSyDm9y-YwKrmIXiF8mtSteotCMdd84VEtVo",
    authDomain: "commoditylookupindex.firebaseapp.com",
    databaseURL: "https://commoditylookupindex.firebaseio.com",
    storageBucket: "commoditylookupindex.appspot.com",
    messagingSenderId: "805209145451"
};
firebase.initializeApp(config);

//Collect global variables here:
var database = firebase.database();
var symbol
var exchange
var twoYearViewArray = [];
var twoYearLabels = [];
var oneYearViewArray = [];
var oneYearLabels = [];
var threeMonthViewArray = [];
var threeMonthLabels = [];
var oneWeekViewArray = [];
var oneWeekLabels = [];
var chartLabels
var userInput;
var duplicateArray = [] //used to prevent duplicates in autocomplete list.

var stocksColor = [49, 141, 141] //defines the initial values of the stocks colors [red, green, blue]
var stocksBorder = [75, 192, 192] //defines the initial values of the stocks borders colors [red, green, blue]
var commodityColor = [36, 200, 183] //defines the initial values of the commodity colors [red, green, blue]
var commodityBorder = [62, 251, 134] //defines the initial values of the commodity borders colors [red, green, blue]
var currencyColor = [234, 46, 77] //defines the initial values of the currency colors [red, green, blue]
var currencyBorder = [255, 97, 128] //defines the initial values of the currency borders colors [red, green, blue]

var currentData = []
var stockLabel
var fullName //Full name of entry. Used in table.

//prototype Object constructor. Lets us create objects globally, and avoid duplicates.
//Object also contains functions for the table data.
function stockDataObject(label, backgroundColor, borderColor, data, fullName) {
    this.label = label
    this.fill = false,
        this.lineTension = 0.1,
        this.backgroundColor = backgroundColor,
        this.borderColor = borderColor,
        this.borderCapStyle = 'butt',
        this.borderDash = [],
        this.borderDashOffset = 0.0,
        this.borderJoinStyle = 'miter',
        this.pointBorderColor = borderColor,
        this.pointBackgroundColor = "#fff",
        this.pointBorderWidth = 1,
        this.pointHoverRadius = 5,
        this.pointHoverBackgroundColor = "rgba(75,192,192,1)",
        this.pointHoverBorderColor = "rgba(220,220,220,1)",
        this.pointHoverBorderWidth = 2,
        this.pointRadius = 1,
        this.pointHitRadius = 10,
        this.data = data,
        this.spanGaps = false,
        this.percentChange = function() {
            var change = (this.data[this.data.length - 1] - this.data[0]) / this.data[0] * 100
            return change.toFixed(2)
        },
        this.low = Math.min(...this.data),
        this.high = Math.max(...this.data);
    	this.fullName = fullName
}

var commodityLookUp = [{
    targetWord: "AG_EIB",
    queryWord: ["silver", "si", "sliver", "slver"]
}]

//Fill in the commodityLookUp objects with what you want to add ot the database.
//The run the FireBaseAdd function.
//fireBaseAdd();

function fireBaseAdd() {
    for (var i = 0; i < commodityLookUp.length; i++) {
        for (var j = 0; j < commodityLookUp[i].queryWord.length; j++) {
            database.ref('lookUpTable/' + commodityLookUp[i].queryWord[j]).set({
                target: commodityLookUp[i].targetWord,
                category: "commodity"
            });
        }
    }
}

//Stock AJAX Call

function stockAJAX() {
    //get cuurent date in the query's desired format
    var today = moment().endOf('month').subtract(1, 'months').format('YYYY-MM-DD')
    var dateStart = moment().endOf('month').subtract(2, 'years').format('YYYY-MM-DD')

    var queryURL = "https://www.quandl.com/api/v3/datasets/WIKI/" + symbol + ".json?&start_date=" + dateStart + "&end_date=" + today + "&collapse=daily&api_key=EDWEb1oyzs8FrfoFyG1u";
    $.ajax({ url: queryURL, method: "GET" }).done(function(response) {
        //Trims the name for table view
        var trim = response.dataset.name
        var trimPosition = trim.indexOf('(');
        fullName = trim.substring(0, trimPosition).trim()

        //Sets the label at the top of the chart
        stockLabel = response.dataset.dataset_code
            //Initializes and clears the price data to be sent to the stockDataObject
        var stocksChartData = []

        //Loops through the response and pushes price data to the stocksChartData array
        for (var i = 0; i < response.dataset.data.length; i++) {
            stocksChartData.push(response.dataset.data[i][1])

        }

        chartColor(stocksColor, stocksBorder);
        twoYearAverager(response)
        oneYearAverager(response)
        threeMonthAverager(response)
        oneWeekViewer(response)
        mainChart.update();
        console.log(twoYearViewArray)

    })
}

//End of Stock AJAX Call

//commodityAJAX function
function commodityAJAX() {
    // var correctedSearch = lookUp(userInput, commodityLookUp);

    //get cuurent date in the query's desired format
    var today = moment().endOf('month').subtract(1, 'months').format('YYYY-MM-DD')
    var dateStart = moment().endOf('month').subtract(2, 'years').format('YYYY-MM-DD')

    var queryURL = "https://www.quandl.com/api/v3/datasets/COM/" + symbol + ".json?&start_date=" + dateStart + "&end_date=" + today + "&collapse=daily";
    $.ajax({ url: queryURL, method: "GET" }).done(function(response) {
        stockLabel = response.dataset.dataset_code

        //Initializes and clears the price data to be sent to the stockDataObject
        var commodityChartData = []

        //Loops through the response and pushes price data to the stocksChartData array
        for (var i = 0; i < response.dataset.data.length; i++) {
            commodityChartData.push(response.dataset.data[i][1])
        }

        chartColor(commodityColor, commodityBorder);
        twoYearAverager(response)
        oneYearAverager(response)
        threeMonthAverager(response)
        oneWeekViewer(response)
        mainChart.update();
    })
}

function currencyAJAX() {
    // var correctedSearch = lookUp(userInput, commodityLookUp);

    //get cuurent date in the query's desired format
    var today = moment().endOf('month').subtract(1, 'months').format('YYYY-MM-DD')
    var dateStart = moment().endOf('month').subtract(2, 'years').format('YYYY-MM-DD')

    var queryURL = "https://www.quandl.com/api/v3/datasets/FRED/" + symbol + ".json?&start_date=" + dateStart + "&end_date=" + today + "&collapse=daily";
    $.ajax({ url: queryURL, method: "GET" }).done(function(response) {
        console.log(response)
        stockLabel = response.dataset.dataset_code

        //Initializes and clears the price data to be sent to the stockDataObject
        var currencyChartData = []

        //Loops through the response and pushes price data to the stocksChartData array
        for (var i = 0; i < response.dataset.data.length; i++) {
            currencyChartData.push(response.dataset.data[i][1])
        }

        chartColor(currencyColor, currencyBorder);
        twoYearAverager(response)
        oneYearAverager(response)
        threeMonthAverager(response)
        oneWeekViewer(response)
        mainChart.update();
    })
}

//creating cryptocurrency coin object for name/symbol key/value pairs
function coinObject(name, symbol) {
    this.name = name,
        this.symbol = symbol
}

//side note: this function will only allow coin objects to be accessible after the 
//ajax call has been made. Running the function and calling the cryptocurrency
//list array will only call an empty array until I find a way to prevent the call until 
//after the ajax call has been made and the array has been filled
function coinListCreator() {
    var coinListURL = "https://api.coinmarketcap.com/v1/ticker/";
    var cryptocurrencyList = []
    $.ajax({ url: coinListURL, method: "GET" }).done(function(response) {

        //iterating through to set coin name and symbol to info at index i 
        for (i = 0; i < response.length; i++) {
            var name = response[i].name;
            var symbol = response[i].symbol;
            var coinOBJ = new coinObject(name, symbol);
            //pushing new coin object to cryptocurrency list array
            cryptocurrencyList.push(coinOBJ);
        }
        console.log(cryptocurrencyList);
    });
}

//CHART GLOBAL SETTINGS:

//Points to chart in the DOM
var ctx = $("#mainChart");

//Global Chart settings
var mainChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: twoYearLabels,
        datasets: twoYearViewArray
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

//Chart has to be destroyed and rebuilt to change views.
//This function builds a new chart.
function newChart(labels, data) {
    mainChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: data
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
}

//END OF CHART GLOBAL SETTINGS

//UI AND DOM SECTION:

//On click and key press functions for the submit button.
$('#compare').on('click', function() {
        AJAXselector()
    })
    //Enter key runs the AJAXselector
$(document).on('keypress', function(e) {
    if (e.which === 13) {
        AJAXselector();
    }
})

//Clears input box of initial text.
$('#query-input').on('click', function() {
    if ($(this).val() === "What would you like to compare?") {
        $(this).val("")
    }
})

//Timeline view buttons.
$('#twoYearViewButton').on('click', function() {
    mainChart.destroy();
    newChart(twoYearLabels, twoYearViewArray)
})

$('#yearViewButton').on('click', function() {
    mainChart.destroy();
    newChart(oneYearLabels, oneYearViewArray)
})

$('#threeMonthsViewButton').on('click', function() {
    mainChart.destroy();
    newChart(threeMonthLabels, threeMonthViewArray)
})

$('#weekViewButton').on('click', function() {
        mainChart.destroy();
        newChart(oneWeekLabels, oneWeekViewArray)
    })
    //End of timeline view buttons.

//Displays an error for any failed AJAX call.
$(document).ajaxError(function() {
    buttonErrorDisplay('Sorry. No results found.')
});

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

//Feed this function a text string error message.
//Will display on the button.
function buttonErrorDisplay(errorMessage) {
    $('#errorDisplay').text(errorMessage)
    $('#compare').css('transform', 'rotateX(90deg)')
    $('#errorDisplay').css('transform', 'rotateX(0deg)')
    setTimeout(function() {
        $('#compare').css({
            'transform': 'perspective(1000px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)'
        });
        $('#errorDisplay').css({
            'transform': 'perspective(1000px) rotateX(-90deg) rotateY(0deg) rotateZ(0deg)'
        });
    }, 1500);
}

//Creates an average of data for each month. Generates labels and displays on chart.
function twoYearAverager(response) {
    currentData = []
    var matchDate = response.dataset.data[0][0].substr(0, 7)
    var date
    var total = 0;
    var count = 0;
    for (var i = 0; i < response.dataset.data.length; i++) {
        date = response.dataset.data[i][0].substr(0, 7)
        if (matchDate === date) {
            total += response.dataset.data[i][1]
            count++
            if (i === response.dataset.data.length - 1) {
                currentData.unshift((total / count).toFixed(2))
            }
        } else {
            currentData.unshift((total / count).toFixed(2))
            total = 0;
            count = 0;
            if (twoYearLabels.length < currentData.length) {
                twoYearLabels.unshift(matchDate)
            }
            matchDate = date
        }
    }
    twoYearViewArray.push(new stockDataObject(stockLabel, backgroundColor, borderColor, currentData, fullName))
}

//Displays only half of the twoYearAverager result.
function oneYearAverager(response) {
    var yearData = []
    for (var i = 11; i < currentData.length; i++) {
        yearData.push(currentData[i])
        if (oneYearLabels.length < 12)
            oneYearLabels.push(twoYearLabels[i])
    }
    oneYearViewArray.push(new stockDataObject(stockLabel, backgroundColor, borderColor, yearData, fullName))
}

//Averages all the weeks during a three month period.
function threeMonthAverager(response) {
    currentData = []
    var matchDate = moment().endOf('month').subtract(1, 'months')
    var endDate = moment().endOf('month').subtract(4, 'months')
    var i = 0;
    var activeDate
    var total = 0;
    var count = 0;
    while (endDate.diff(activeDate, 'days') <= 0) {
        activeDate = moment(response.dataset.data[i][0])
        if (activeDate.diff(matchDate, 'days') >= -5) {
            total += response.dataset.data[i][1]
            count++
        } else {
            currentData.unshift((total / count).toFixed(2))
            total = 0;
            count = 0;
            if (threeMonthLabels.length <= 12) {
                threeMonthLabels.unshift(response.dataset.data[i][0])
            }
            matchDate = activeDate
        }
        i++
    }
    threeMonthViewArray.push(new stockDataObject(stockLabel, backgroundColor, borderColor, currentData, fullName))
}


//Displays last 7 entires.
function oneWeekViewer(response) {
    currentData = []
    for (var i = 0; i < 7; i++) {
        currentData.unshift(response.dataset.data[i][1])
        if (oneWeekLabels.length < 7) {
            oneWeekLabels.unshift(response.dataset.data[i][0])
        }
    }
    oneWeekViewArray.push(new stockDataObject(stockLabel, backgroundColor, borderColor, currentData, fullName))
}

function chartColor(color, border) {
    //initial framework to change the shade of the color every time a new search for a stock happens
    //these values are not set in stone and can be adjusted
    backgroundColor = "rgba(" + color[0] + "," + color[1] + "," + color[2] + ",0.4)"
    borderColor = "rgba(" + border[0] + "," + border[1] + "," + border[2] + ",1)"
        //the line color is changed here
    color[0] = parseInt(color[0]) + 28;
    color[1] = parseInt(color[1]) + 40;
    color[2] = parseInt(color[2]) + 40;
    //the border color is changed here
    border[0] = parseInt(border[0]) + 28;
    border[1] = parseInt(border[1]) + 40;
    border[2] = parseInt(border[2]) + 40;

};

//Autocomplete function.

//Sends a query to firebase on each keypress.
$('#query-input').on('keyup', function() {
    var keyInput = $(this).val();
    autoComplete(keyInput)
})

//Grabs entries from firebase and checks for duplicates before sending them to the html datalist.
function autoComplete(input) {
    firebase.database().ref('lookUpTable').startAt(input).orderByKey().limitToFirst(6).once('value', function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            if (duplicateArray.indexOf(childSnapshot.key) === -1) {
                duplicateArray.push(childSnapshot.key)
                $('#autoComplete').append('<option value="' + childSnapshot.key + '">')
            }
        })
    })
}

//The main function for choosing which AJAX call to run.
function AJAXselector() {

    //Sanatizes user input.
    userInput = $('#query-input').val().trim().toLowerCase();

    //Displays error if the user fails to enter anything into the search field.
    if (userInput === "" || userInput === "what would you like to compare?") {
        buttonErrorDisplay('Please enter a search term.')
    } else {
        //Clears the search Box
        $('#query-input').val("")

        //Selects the appropriate AJAX call based on the category returned from firebase autocomplete result.
        firebase.database().ref('lookUpTable').startAt(userInput).orderByKey().limitToFirst(1).once('value', function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
                var category = childSnapshot.val().category
                symbol = childSnapshot.val().target

                if (category === 'commodity') {
                    commodityAJAX();
                }
                if (category === 'company') {
                    stockAJAX();
                }
                if (category === 'currency') {
                    currencyAJAX();
                }
                if (category === 'cryptocurrency') {
                    cryptocurrencyAJAX();
                }
            })

        })
    }
}

//END OF REUSABLE FUNCTIONS
