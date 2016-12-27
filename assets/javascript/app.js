
//Make mess below:

//https://www.cryptonator.com/api
//https://www.cryptocompare.com/api/#-api-data-coinlist-
//https://coinmarketcap.com/api/

//Initialize Firebase
<<<<<<< HEAD
var config = {
=======
  var config = {
>>>>>>> 514e99fad53e69090ab44bc9e42328b6b68dc7b1
    apiKey: "AIzaSyDm9y-YwKrmIXiF8mtSteotCMdd84VEtVo",
    authDomain: "commoditylookupindex.firebaseapp.com",
    databaseURL: "https://commoditylookupindex.firebaseio.com",
    storageBucket: "commoditylookupindex.appspot.com",
    messagingSenderId: "805209145451"
  };
<<<<<<< HEAD
firebase.initializeApp(config);
=======
  firebase.initializeApp(config);
>>>>>>> 514e99fad53e69090ab44bc9e42328b6b68dc7b1

//Collect global variables here:
var database = firebase.database();
var tickerSymbol
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

var stocksColor = [49, 141, 141] //defines the initial values of the stocks colors [red, green, blue]
var stocksBorder = [75, 192, 192] //defines the initial values of the stocks borders colors [red, green, blue]
var commodityColor = [36, 200, 183] //defines the initial values of the commodity colors [red, green, blue]
var commodityBorder = [62, 251, 134] //defines the initial values of the commodity borders colors [red, green, blue]
var currencyColor = [234, 46, 77] //defines the initial values of the currency colors [red, green, blue]
var currencyBorder = [255, 97, 128] //defines the initial values of the currency borders colors [red, green, blue]

var currentData = []
var stockLabel

//prototype Object constructor. Let us create objects globally, and avoid duplicates.
function stockDataObject(label, backgroundColor, borderColor, data) {
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
}

var stockLookUp = [{
    targetWord: "GOOG",
    queryWord: ["google", "gooogle", "googel", "alphabet"]
}, {
    targetWord: "FB",
    queryWord: ["facebook", "face book"]
}]


var commodityLookUp = [{
    targetWord: "AG_EIB",
    queryWord: ["silver", "si", "sliver", "slver"]
}, {
    targetWord: "AL_LME",
    queryWord: ["aluminum", "alluminum", "aluminium", "alumminum"]
}, {
    targetWord: "AU_EIB",
    queryWord: ["gold", "goled", "golld", "goldd"]
}, {
    targetWord: "BEEF_S",
    queryWord: ["beef", "beaf"]
}, {
    targetWord: "BUTTER",
    queryWord: ["butter", "buter", "butt", "buttr", "btter"]
}, {
    targetWord: "CHEESE_BRL",
    queryWord: ["cheese", "chease", "chees"]
}, {
    targetWord: "EGGS",
    queryWord: ["eggs", "egs", "egss", "egg"]
}, {
    targetWord: "CHKN_A",
    queryWord: ["chicken", "chikken", "chiken", "chicen", "chickn", "poultry"]
}, {
    targetWord: "COAL_CAPP",
    queryWord: ["coal", "cole", "coll", "cool"]
}, {
    targetWord: "COCOA",
    queryWord: ["cocoa", "cocoa beans", "coco", "coko", "cocoe", "cokeco"]
}, {
    targetWord: "COFFEE_CLMB",
    queryWord: ["coffee", "cafe", "cofee", "cofffe", "cofe", "coofee"]
}, {
    targetWord: "CORN_2",
    queryWord: ["corn", "maize", "korn", "corrn"]
}, {
    targetWord: "COTLOOK",
    queryWord: ["cotton", "coton", "cotten", "coten", "cottan", "cotan"]
}, {
    targetWord: "FE_TJN",
    queryWord: ["iron", "irron"]
}, {
    targetWord: "GAS_CR",
    queryWord: ["gas", "gasoline", "gassoline", "gass", "gassoleen", "gassolene", "gasolene", "gasolean", "gassolean"]
}, {
    targetWord: "MILK",
    queryWord: ["milk", "millk", "miilk"]
}, {
    targetWord: "OATS",
    queryWord: ["oats", "oets", "oots", "otts"]
}, {
    targetWord: "COPPER",
    queryWord: ["copper", "coper", "cooper"]
}, {
    targetWord: "FUELOIL",
    queryWord: ["crude oil", "crud oil", "cured oil", "petroleum", "petrolium", "oil"]
}, {
    targetWord: "LM_PK602_VARIETY",
    queryWord: ["swine", "pork", "pigs", "pig", "hogs", "hog"]
}, {
    targetWord: "RICE_2",
    queryWord: ["rice"]
}, {
    targetWord: "SOYB_1",
    queryWord: ["soybeans", "soy beans", "soybean"]
}, {
    targetWord: "WHEAT_KC",
    queryWord: ["wheat", "wheet"]
}, {
    targetWord: "WOOL",
    queryWord: ["wool"]
}, {
    targetWord: "SORGHUM",
    queryWord: ["sorghum", "soreghum", "sor gum", "sore gum", "sorgum", "soregum"]
}]

//fireBaseAdd();

function fireBaseAdd(){
for (var i = 0; i < commodityLookUp.length; i++) {
		for (var j = 0; j < commodityLookUp[i].queryWord.length; j++) {
				    database.ref('lookUpTable/' + commodityLookUp[i].queryWord[j]).set({
				    	target: commodityLookUp[i].targetWord, 
				    	category: "commodity"}
	             
	         );
		}

}
}

	 // database.ref('commodityAuto').on("value", function(snapshot) {
	 //     console.log(snapshot.val())
	 // });



//Stock AJAX Call

function stockAJAX() {
    var correctedSearch = lookUp(userInput, stockLookUp);
    //Checks user search against the yahoo ticker converter and our stockLookup table.

    if (!correctedSearch && (exchange !== 'NASDAQ' && exchange !== 'NYSE')) {

        buttonErrorDisplay('Stock not found on NYSE or NASDAQ')

        //If not found in stockLookUp table, use the yahoo ticker converter output.
    } else if (!correctedSearch) {
        tickerSymbol = tickerSymbol
            //If found in stockLookUp table, change the ticker symbol to be searched.
    } else {
        tickerSymbol = correctedSearch
    }

    //get cuurent date in the query's desired format
    var today = moment().endOf('month').subtract(1, 'months').format('YYYY-MM-DD')
    var dateStart = moment().endOf('month').subtract(2, 'years').format('YYYY-MM-DD')

    var queryURL = "https://www.quandl.com/api/v3/datasets/WIKI/" + tickerSymbol + ".json?&start_date=" + dateStart + "&end_date=" + today + "&collapse=daily&api_key=EDWEb1oyzs8FrfoFyG1u";
    $.ajax({ url: queryURL, method: "GET" }).done(function(response) {
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
    var correctedSearch = lookUp(userInput, commodityLookUp);

    //get cuurent date in the query's desired format
    var today = moment().endOf('month').subtract(1, 'months').format('YYYY-MM-DD')
    var dateStart = moment().endOf('month').subtract(2, 'years').format('YYYY-MM-DD')

    var queryURL = "https://www.quandl.com/api/v3/datasets/COM/" + correctedSearch + ".json?&start_date=" + dateStart + "&end_date=" + today + "&collapse=daily";
    $.ajax({ url: queryURL, method: "GET" }).done(function(response) {
        console.log(response)
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
    var correctedSearch = lookUp(userInput, commodityLookUp);

    //get cuurent date in the query's desired format
    var today = moment().endOf('month').subtract(1, 'months').format('YYYY-MM-DD')
    var dateStart = moment().endOf('month').subtract(2, 'years').format('YYYY-MM-DD')

    var queryURL = "https://www.quandl.com/api/v3/datasets/FRED/" + userInput + ".json?&start_date=" + dateStart + "&end_date=" + today + "&collapse=daily";
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

$('.selectButton').on('click', function() {
    $('.selectButton').removeClass('selectActive')
    $(this).addClass('selectActive')
    $('.selectButton').attr('value', 'inactive')
    $(this).attr('value', 'active')
})


//This is used to determine which AJAX calls are made, based on what buttons were selected.
function AJAXselector() {
    userInput = $('#query-input').val().trim().toLowerCase();

    //Clears the search Box
    $('#query-input').val("")

    //Checks which button is active and runs the appropriate function.
    if ($('#company').attr('value') === 'active') {
        tickerConverter(userInput)
    }
    if ($('#commodity').attr('value') === 'active') {
        commodityAJAX();
    }
    if ($('#currency').attr('value') === 'active') {
        currencyAJAX();
    }
    if ($('.selectButton').attr('value') === 'inactive') {
        buttonErrorDisplay('Select a catagory.')
    }
}

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
    twoYearViewArray.push(new stockDataObject(stockLabel, backgroundColor, borderColor, currentData))
}

//Displays only half of the twoYearAverager result.
function oneYearAverager(response) {
    var yearData = []
    for (var i = 11; i < currentData.length; i++) {
        yearData.push(currentData[i])
        if (oneYearLabels.length < 12)
            oneYearLabels.push(twoYearLabels[i])
    }
    oneYearViewArray.push(new stockDataObject(stockLabel, backgroundColor, borderColor, yearData))
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
    threeMonthViewArray.push(new stockDataObject(stockLabel, backgroundColor, borderColor, currentData))
}


//An easy one!
function oneWeekViewer(response) {
    currentData = []
    for (var i = 0; i < 7; i++) {
        currentData.unshift(response.dataset.data[i][1])
        if (oneWeekLabels.length < 7) {
            oneWeekLabels.unshift(response.dataset.data[i][0])
        }
    }
    oneWeekViewArray.push(new stockDataObject(stockLabel, backgroundColor, borderColor, currentData))
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


//END OF REUSABLE FUNCTIONS
