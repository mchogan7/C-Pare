//Make mess below:

//https://www.cryptonator.com/api
//https://www.cryptocompare.com/api/#-api-data-coinlist-
//https://coinmarketcap.com/api/

//Initialize Firebase
var config = {
    apiKey: "AIzaSyBqELfq7q1WGSap8mqzFd-8WWnSxDHn4s0",
    authDomain: "c-pare.firebaseapp.com",
    databaseURL: "https://c-pare.firebaseio.com",
    storageBucket: "c-pare.appspot.com",
    messagingSenderId: "614106603921"
};
firebase.initializeApp(config);

//Collect global variables here:
var database = firebase.database();
var tickerSymbol
var exchange
var twoYearViewArray = [];
var twoYearLabels = [];
var oneYearViewArray = [];
var oneYearLabels = [];
var chartLabels
var userInput;
var stocksRed = 49; //starting values for rgb of stocks color
var stocksGreen = 141;
var stocksBlue = 141;
var stocksRedBorder = 75; //starting values for rgb stocks border color
var stocksGreenBorder = 192;
var stocksBlueBorder = 192;
var currentData = []
var stockLabel

//prototype Object constructor. Let us create objects globally, and avoid duplicates.
function stockDataObject(label, backgroundColor, borderColor, data){
    this.label = label
    this.fill = false,
    this.lineTension = 0.1,
    this.backgroundColor = backgroundColor,
    this.borderColor = borderColor,
    this.borderCapStyle ='butt',
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
    this.spanGaps = false;
}

console.log(new stockDataObject('test'))


var stockLookUp = [{
    targetWord: "GOOG",
    queryWord: ["google", "gooogle", "googel", "alphabet"]
}, {
    targetWord: "FB",
    queryWord: ["facebook", "face book"]
}]


var commodityLookUp = [{
    targetWord: "WLD_SILVER",
    queryWord: ["silver", "si", "sliver", "slver"]
}, {
    targetWord: "PALUM_USD",
    queryWord: ["aluminum", "alluminum", "aluminium", "alumminum"]
}, {
    targetWord: "WLD_GOLD",
    queryWord: ["gold", "goled", "golld", "goldd"]
}, {
    targetWord: "PBEEF_USD",
    queryWord: ["beef", "beaf"]
}, {
    targetWord: "BUTTER",
    queryWord: ["butter", "buter", "butt", "buttr", "btter"]
}, {
    targetWord: "CHEESE_BLK",
    queryWord: ["cheese", "chease", "chees"]
}, {
    targetWord: "EGGS",
    queryWord: ["eggs", "egs", "egss", "egg"]
}, {
    targetWord: "PPOULT_USD",
    queryWord: ["chicken", "chikken", "chiken", "chicen", "chickn"]
}, {
    targetWord: "PCOALAU_USD",
    queryWord: ["coal", "cole", "coll", "cool"]
}, {
    targetWord: "PCOCO_USD",
    queryWord: ["cocoa", "coco", "coko", "cocoe", "cokeco"]
}, {
    targetWord: "PCOFFOTM_USD",
    queryWord: ["coffee", "cafe", "cofee", "cofffe", "cofe", "coofee"]
}, {
    targetWord: "PMAIZMT_USD",
    queryWord: ["corn", "korn", "corrn"]
}, {
    targetWord: "PCOTTIND_USD",
    queryWord: ["cotton", "coton", "cotten", "coten", "cottan", "cotan"]
}, {
    targetWord: "WLD_IRON_ORE",
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
    targetWord: "PCOPP_USD",
    queryWord: ["copper", "coper", "cooper"]
}, {
    targetWord: "PFISH_USD",
    queryWord: ["fish", "fiish"]
}, {
    targetWord: "PGNUTS_USD",
    queryWord: ["peanuts", "peenuts", "penuts"]
}, {
    targetWord: "PLAMB_USD",
    queryWord: ["lamb"]
}, {
    targetWord: "PLEAD_USD",
    queryWord: ["lead", "led"]
}, {
    targetWord: "PLOGORE_USD",
    queryWord: ["wood", "lumber", "timber"]
}, {
    targetWord: "PNGASUS_USD",
    queryWord: ["natural gas", "natral gas"]
}, {
    targetWord: "PNICK_USD",
    queryWord: ["nickel", "nicckel", "nickkel"]
}, {
    targetWord: "POILWTI_USD",
    queryWord: ["crude oil", "crud oil", "cured oil", "petroleum", "petrolium", "oil"]
}, {
    targetWord: "POLVOIL_USD",
    queryWord: ["olive oil"]
}, {
    targetWord: "PORANG_USD",
    queryWord: ["orange", "oranges", "organs", "oragnes", "oragne", "organ"]
}, {
    targetWord: "PPORK_USD",
    queryWord: ["swine", "pork", "pigs", "pig", "hogs", "hog"]
}, {
    targetWord: "PRICENPQ_USD",
    queryWord: ["rice"]
}, {
    targetWord: "PRUBB_USD",
    queryWord: ["rubber", "rubbr", "ruber"]
}, {
    targetWord: "PSOYB_USD",
    queryWord: ["soybeans", "soy beans", "soybean", "soybeans"]
}, {
    targetWord: "PSUGAUSA_USD",
    queryWord: ["sugar", "sugr", "suger"]
}, {
    targetWord: "PTIN_USD",
    queryWord: ["tin"]
}, {
    targetWord: "PURAN_USD",
    queryWord: ["uranium", "uraneum"]
}, {
    targetWord: "PWHEAMT_USD",
    queryWord: ["wheat", "wheet"]
}, {
    targetWord: "PWOOLC_USD",
    queryWord: ["wool"]
}, {
    targetWord: "SORGHUM",
    queryWord: ["sorghum", "soreghum", "sor gum", "sore gum", "sorgum", "soregum"]
}, {
    targetWord: "WLD_BANANA_US",
    queryWord: ["banana", "bananas", "bannana", "bananna", "bannanas", "banannas"]
}, {
    targetWord: "WLD_BARLEY",
    queryWord: ["barley", "barlee", "baley"]
}, {
    targetWord: "WLD_COCONUT_OIL",
    queryWord: ["coconut oil", "coconut", "coconuts"]
}, {
    targetWord: "WLD_IRON_ORE",
    queryWord: ["iron", "iron ore"]
}, {
    targetWord: "WLD_TOBAC_US",
    queryWord: ["tobacco", "tobbacco", "tobbaco"]
}]

//Eventual Firebase Functions
// for (var i = 0; i < commodityLookUp.length; i++) {
// 	    database.ref('commodityAuto').push(
// 	             commodityLookUp[i]
// 	         );
// }

// 	 database.ref('commodityAuto').on("value", function(snapshot) {
// 	     console.log(snapshot.val())
// 	 });

//Stock AJAX Call

function stockAJAX() {
    var correctedSearch = lookUp(userInput, stockLookUp);
    //Checks user search against the yahoo ticker converter and our stockLookup table.
    currentData = []

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
            //initial framework to change the shade of the color every time a new search for a stock happens
            //these values are not set in stone and can be adjusted
        backgroundColor = "rgba(" + stocksRed + "," + stocksGreen + "," + stocksBlue + ",0.4)"
        borderColor = "rgba(" + stocksRedBorder + "," + stocksGreenBorder + "," + stocksBlueBorder + ",1)"
            //the line color is changed here
        stocksRed = stocksRed + 28;
        stocksGreen = stocksGreen + 40;
        stocksBlue = stocksBlue + 40;
        //the border color is changed here
        stocksRedBorder = stocksRedBorder + 28;
        stocksGreenBorder = stocksGreenBorder + 40;
        stocksBlueBorder = stocksBlueBorder + 40;

		//Loops through the response and pushes price data to the stocksChartData array
        for (var i = 0; i < response.dataset.data.length; i++) {
            stocksChartData.push(response.dataset.data[i][1])
        }

        twoYearAverager(response)
        mainChart.update();


    })
}

//End of Stock AJAX Call

//Quandle commodity AJAX Call
function commodityAJAX() {
    var correctedSearch = lookUp(userInput, commodityLookUp);
    //Checks user search against the yahoo ticker converter and our stockLookup table.

    // if (!correctedSearch && (exchange !== 'NASDAQ' && exchange !== 'NYSE')) {

    //     console.log('Search not found on NASDAQ or NYSE') //This will be reaplced with an error display function

    //     //If not found in stockLookUp table, use the yahoo ticker converter output.
    // } else if (!correctedSearch) {
    //     tickerSymbol = tickerSymbol
    //         //If found in stockLookUp table, change the ticker symbol to be searched.
    // } else {
    //     tickerSymbol = correctedSearch
    // }

    //get cuurent date in the query's desired format
    var today = moment().format('YYYY-MM-DD')

    var queryURL = "https://www.quandl.com/api/v3/datasets/COM/WLD_SILVER.json?&start_date=2015-01-01&end_date=" + today + "&collapse=daily";
    $.ajax({ url: queryURL, method: "GET" }).done(function(response) {

        // //Initializes and clears the price data to be sent to the stockDataObject
        // var commodityChartData = []

        // //Loops through the response and pushes price data to the stocksChartData array
        // for (var i = 0; i < response.dataset.data.length; i++) {
        //     commodityChartData.push(response.dataset.data[i][1])
        // }

        // //This is the object format to be sent to the chart.
        // var commodityDataObject = {
        //     label: response.dataset.dataset_code,
        //     fill: false,
        //     lineTension: 0.1,
        //     backgroundColor: "rgba(75,192,192,0.4)",
        //     borderColor: "rgba(75,192,192,1)",
        //     borderCapStyle: 'butt',
        //     borderDash: [],
        //     borderDashOffset: 0.0,
        //     borderJoinStyle: 'miter',
        //     pointBorderColor: "rgba(75,192,192,1)",
        //     pointBackgroundColor: "#fff",
        //     pointBorderWidth: 1,
        //     pointHoverRadius: 5,
        //     pointHoverBackgroundColor: "rgba(75,192,192,1)",
        //     pointHoverBorderColor: "rgba(220,220,220,1)",
        //     pointHoverBorderWidth: 2,
        //     pointRadius: 1,
        //     pointHitRadius: 10,
        //     data: stocksChartData,
        //     spanGaps: false,
        // }

        // //Pushes dataObject to the viewer array, then updates the chart in the browers.
        // chartViewerArray.push(commodityDataObject)
        // mainChart.update();
        console.log(response);
    })
}
//End of Quandle commodityAJAX Call

// var a = moment();
// var b = moment([2007, 0, 28]);
// console.log(a.diff(b, 'weeks')) 



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


//This will eventually be used to determine which AJAX calls are made, based on what buttons were selected.
function AJAXselector() {
    userInput = $('#query-input').val().trim().toLowerCase();
    console.log(userInput);

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
        console.log('Running currencyAJAX')
    }
    if ($('.selectButton').attr('value') === 'inactive') {
        buttonErrorDisplay('Select a catagory.')
    }
}

$('#twoYearViewButton').on('click', function() {
    mainChart.config.data.labels = twoYearLabels
    mainChart.config.datasets = twoYearViewArray
    mainChart.update();
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

function twoYearAverager(response) {
    var matchDate = response.dataset.data[0][0].substr(0, 7)
    var date
    var total = 0;
    var count = 0;
    for (var i = 0; i < response.dataset.data.length; i++) {
        date = response.dataset.data[i][0].substr(0, 7)
        if (matchDate === date) {
            total += response.dataset.data[i][1]
            count++
            if (i === 24) {
                currentData.unshift((total / count).toFixed(2))
            }
        } else {
            currentData.unshift((total / count).toFixed(2))
            total = 0;
            count = 0;
            if (twoYearLabels.length < currentData.length) {
                twoYearLabels.unshift(matchDate)
                twoYearLabels.unshift(date)
            }
            matchDate = date
        }
    }
    stockDataObject.data = currentData
    twoYearViewArray.push(new stockDataObject(stockLabel, backgroundColor, borderColor, currentData))
    console.log(twoYearViewArray)
}

//END OF REUSABLE FUNCTIONS
