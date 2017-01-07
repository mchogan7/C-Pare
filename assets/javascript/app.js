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

var stocksColor = [0, 155, 210] //defines the initial values of the stocks colors [red, green, blue]
var stocksBorder = [0, 105, 160]

var commodityColor = [255, 255, 100] //defines the initial values of the commodity colors [red, green, blue]
var commodityBorder = [90, 138, 0] //defines the initial values of the commodity borders colors [red, green, blue]
var currencyColor = [86, 250, 233] //defines the initial values of the currency colors [red, green, blue]
var currencyBorder = [36, 200, 183] //defines the initial values of the currency borders colors [red, green, blue]
var stocksSearchCounter = 0 //sets initial value for counting stock searches, needed to know when to change border dash
var commoditySearchCounter = 0 //sets initial value for counting commodity searches, needed to know when to change border dash
var currencySearchCounter = 0 //sets initial value for counting currency searches, needed to know when to change border dash
var cryptoSearchCounter = 0
var type
var currentData = []
var stockLabel
var fullName //Full name of entry. Used in table.
var colorTracker = []

//prototype Object constructor. Lets us create objects globally, and avoid duplicates.
//Object also contains functions for the table data.
function stockDataObject(label, backgroundColor, borderColor, dashEffect, data, fullName) {
    this.label = label
    this.fill = false,
        this.lineTension = 0.1,
        this.backgroundColor = backgroundColor,
        this.borderColor = borderColor,
        this.borderCapStyle = 'butt',
        this.borderDash = dashEffect,
        this.borderDashOffset = 0.0,
        this.borderJoinStyle = 'miter',
        this.pointBorderColor = borderColor,
        this.category = type,
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
        this.high = Math.max(...this.data),
        this.fullName = fullName,
        this.percColor = function() {
            if (this.percentChange() < 0) {
                return 'rgba(234,46,77, 1)'
            } else {
                return 'rgba(36,200,183, 1)'
            }
        };
}

var commodityLookUp = [{
    targetWord: "DEXUSAL",
    queryWord: ["australian dollar"]
}]

//Fill in the commodityLookUp objects with what you want to add ot the database.
//Be sure to change category to the correct one.
//The run the FireBaseAdd function.
//fireBaseAdd();

function fireBaseAdd() {
    for (var i = 0; i < commodityLookUp.length; i++) {
        for (var j = 0; j < commodityLookUp[i].queryWord.length; j++) {
            database.ref('lookUpTable/' + commodityLookUp[i].queryWord[j]).set({
                target: commodityLookUp[i].targetWord,
                category: "currency"
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

        // defines the type of search, so it is known which colors are needed to reset if it is time to reset
        type = "stocks";
        stocksSearchCounter++;

        //resets the search count after ten, basically once through solid lines, then once through dash lines, then repeat
        if (stocksSearchCounter > 10) {
            stocksSearchCounter = 1;
            resetColors(type)
        }

        chartColor(stocksColor, stocksBorder, type, stocksSearchCounter);
        twoYearAverager(response)
        oneYearAverager(response)
        threeMonthAverager(response)
        oneWeekViewer(response)
        mainChart.update();
        newTable(twoYearViewArray);
    })
}

//End of Stock AJAX Call

//commodityAJAX function
function commodityAJAX() {

    //get cuurent date in the query's desired format
    var today = moment().endOf('month').subtract(1, 'months').format('YYYY-MM-DD')
    var dateStart = moment().endOf('month').subtract(2, 'years').format('YYYY-MM-DD')

    var queryURL = "https://www.quandl.com/api/v3/datasets/COM/" + symbol + ".json?&start_date=" + dateStart + "&end_date=" + today + "&collapse=daily&api_key=EDWEb1oyzs8FrfoFyG1u";
    $.ajax({ url: queryURL, method: "GET" }).done(function(response) {
        stockLabel = response.dataset.dataset_code

        // defines the type of search, so it is known which colors are needed to reset if it is time to reset
        type = "commodity";
        commoditySearchCounter++;

        //resets the search count after ten, basically once through solid lines, then once through dash lines, then repeat
        if (commoditySearchCounter > 10) {
            commoditySearchCounter = 1;
            resetColors(type)
        }

        chartColor(commodityColor, commodityBorder, type, commoditySearchCounter);
        twoYearAverager(response)
        oneYearAverager(response)
        threeMonthAverager(response)
        oneWeekViewer(response)
        mainChart.update();
        newTable(twoYearViewArray);
    })
}

function currencyAJAX() {
    // var correctedSearch = lookUp(userInput, commodityLookUp);

    //get cuurent date in the query's desired format
    var today = moment().endOf('month').subtract(1, 'months').format('YYYY-MM-DD')
    var dateStart = moment().endOf('month').subtract(2, 'years').format('YYYY-MM-DD')

    var queryURL = "https://www.quandl.com/api/v3/datasets/FRED/" + symbol + ".json?&start_date=" + dateStart + "&end_date=" + today + "&collapse=daily&api_key=EDWEb1oyzs8FrfoFyG1u";
    $.ajax({ url: queryURL, method: "GET" }).done(function(response) {
        stockLabel = response.dataset.dataset_code

        // defines the type of search, so it is known which colors are needed to reset if it is time to reset
        type = "currency";
        currencySearchCounter++;

        //resets the search count after ten, basically once through solid lines, then once through dash lines, then repeat
        if (currencySearchCounter > 10) {
            currencySearchCounter = 1;
            resetColors(type)
        }

        chartColor(currencyColor, currencyBorder, type, currencySearchCounter);
        twoYearAverager(response)
        oneYearAverager(response)
        threeMonthAverager(response)
        oneWeekViewer(response)
        mainChart.update();
        newTable(twoYearViewArray);
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
                type: 'logarithmic',
                ticks: {
                    callback: function(label, index) {
                        if (index % 5 === 0) {
                            return label.toFixed(2)
                        } else {
                            return ''
                        }
                    },
                    beginAtZero: true
                }
            }]
        },
        maintainAspectRatio: false,
        responsive: true
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
                    type: 'logarithmic',
                    ticks: {
                        callback: function(label, index) {
                            if (index % 5 === 0) {
                                return label.toFixed(2)
                            } else {
                                return ''
                            }
                        },
                        maxTicksLimit: 4,
                        beginAtZero: true
                    }
                }]
            },
            maintainAspectRatio: false,
            responsive: true
        }
    });
}

//Renders table based on the view array that is called as an argument
function newTable(specificArray) {
    $(".comparisonInfo").empty();
    for (var i = 0; i < specificArray.length; i++) {
        // var removeComparisonButton = $('<button>').addClass(specificArray[i].label);
        // removeComparisonButton.id = specificArray[i].label;
        // removeComparisonButton.addEventListener("click", function(e) {
        //     alert("Button Id: " + this.id);
        // });
        $(".comparisonInfo").append("<tr class = '" + specificArray[i].label + "'>" +
            "<td><div class='tableShrink'>" + specificArray[i].label + "</div></td>" +
            "<td><div class='tableShrink'>" + specificArray[i].high + "</td>" +
            "<td><div class='tableShrink'>" + specificArray[i].low + "</td>" +
            "<td style='color:" + specificArray[i].percColor() + "'><div class='tableShrink'>" + specificArray[i].percentChange() + "</div</td>" +
            "<td>" + "<div class= 'tableShrink removeButton' value='" + specificArray[i].label + "'>&times</div>" + "</td>" +
            "</tr>");
    }
}

//Function removes the chartDataObject from the chart and table.
$(document).on('click', '.removeButton', function() {
        //Gets the dataObject label as stored it the button of its row.
        var removeThis = $(this).attr('value')
        var goBackColor = 1
            //Targets and removes class with the same value.
         $('.' + removeThis + ' > td > div').text('');
         $('.' + removeThis + ' > td > div').css('height', '0px')
        	 setTimeout(function() {
        	 	$('.' + removeThis).remove();
        	 }, 300)

        //Loops through and deletes any DataObjects with matching value.
        for (var i = 0; i < twoYearViewArray.length; i++) {
            if (twoYearViewArray[i].label === removeThis) {

                //Decrements the searchCounter to reset the color sequence.
                //This has to come first to reference the object before deletion.
                if (twoYearViewArray[i].category === 'stocks') {
                    //stocksSearchCounter--;
                    
                    
                   // var index = colorTracker.indexOf(twoYearViewArray[i].borderColor)
                   // colorTracker.splice(index, 1)
                   // console.log(colorTracker)
                    
                }
                if (twoYearViewArray[i].category === 'currency') {
                    // currencySearchCounter--

                    // if (currencySearchCounter > 0){
                    // currencySearchCounter--

                    // currencyBorder[0] = Math.floor(parseInt(Math.floor(parseInt(currencyBorder[0])) / 1.25));
                    // currencyBorder[1] = Math.floor(parseInt(Math.floor(parseInt(currencyBorder[1])) / 1.25));
                    // currencyBorder[2] = Math.floor(parseInt(Math.floor(parseInt(currencyBorder[2])) / 1.25));

                    // }
                }

                if (twoYearViewArray[i].category === 'commodity') {
                    // commoditySearchCounter--

                    // if (commoditySearchCounter > 0){
                    // commoditySearchCounter--

                    // commodityBorder[0] = Math.floor(parseInt(Math.floor(parseInt(commodityBorder[0])) / 1.25));
                    // commodityBorder[1] = Math.floor(parseInt(Math.floor(parseInt(commodityBorder[1])) / 1.25));
                    // commodityBorder[2] = Math.floor(parseInt(Math.floor(parseInt(commodityBorder[2])) / 1.25));

                    // }
                }
                //Removes the matching object from all arrays.
                twoYearViewArray.splice(i, 1);
                oneYearViewArray.splice(i, 1);
                threeMonthViewArray.splice(i, 1);
                oneWeekViewArray.splice(i, 1);
                mainChart.update();
            }


        }
    })
    //END OF CHART GLOBAL SETTINGS

//UI AND DOM SECTION:

//On click and key press functions for the submit button.
$('#compare').on('click', function() {
        AJAXselector();
        $('#autoComplete').html("")
        duplicateArray = []
    })
    //Enter key runs the AJAXselector
$(document).on('keypress', function(e) {
    if (e.which === 13) {
        AJAXselector();
        $('#autoComplete').html("")
        duplicateArray = []
    }
})

//Clears input box of initial text.
$('#query-input').on('click', function() {
    if ($(this).val() === "What would you like to compare?") {
        $(this).val("")
        $(this).css('color', 'black')
    }
})

//Timeline view buttons.
$('#twoYearViewButton').on('click', function() {
    mainChart.destroy();
    newChart(twoYearLabels, twoYearViewArray);
    newTable(twoYearViewArray);
    $('.tabSlider').css('margin-left', '0%')
    $('.selectButton').removeClass('buttonSelected')
    $(this).addClass('buttonSelected')
})

$('#yearViewButton').on('click', function() {
    mainChart.destroy();
    newChart(oneYearLabels, oneYearViewArray);
    newTable(oneYearViewArray);
    $('.tabSlider').css('margin-left', '25%')
    $('.selectButton').removeClass('buttonSelected')
    $(this).addClass('buttonSelected')
})

$('#threeMonthsViewButton').on('click', function() {
    mainChart.destroy();
    newChart(threeMonthLabels, threeMonthViewArray);
    newTable(threeMonthViewArray);
    $('.tabSlider').css('margin-left', '50%')
    $('.selectButton').removeClass('buttonSelected')
    $(this).addClass('buttonSelected')
})

$('#weekViewButton').on('click', function() {
        mainChart.destroy();
        newChart(oneWeekLabels, oneWeekViewArray);
        newTable(oneWeekViewArray);
        $('.tabSlider').css('margin-left', '75%')
        $('.selectButton').removeClass('buttonSelected')
        $(this).addClass('buttonSelected')
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
            matchDate = date
        }
    }
    console.log(twoYearViewArray)

    twoYearViewArray.push(new stockDataObject(stockLabel, backgroundColor, borderColor, dashEffect, currentData, fullName))
}

//Displays only half of the twoYearAverager result.
function oneYearAverager(response) {
    var yearData = []
    for (var i = 11; i < currentData.length; i++) {
        yearData.push(currentData[i])
    }
    oneYearViewArray.push(new stockDataObject(stockLabel, backgroundColor, borderColor, dashEffect, yearData, fullName))
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
            matchDate = activeDate
        }
        i++
    }
    threeMonthViewArray.push(new stockDataObject(stockLabel, backgroundColor, borderColor, dashEffect, currentData, fullName))
}


//Displays last 7 entires.
function oneWeekViewer(response) {
    var labelDate
    currentData = []
    for (var i = 0; i < 7; i++) {
        currentData.unshift(response.dataset.data[i][1])
            //Generates labels for the week view.
        if (oneWeekLabels.length < 7) {
            labelDate = response.dataset.data[i][0]
            oneWeekLabels.unshift(moment(labelDate).format('MM/DD/YY'))
        }
    }

    oneWeekViewArray.push(new stockDataObject(stockLabel, backgroundColor, borderColor, dashEffect, currentData, fullName))
}

function dateLabelCreator() {
    //generates 2 year labelss
    for (var i = 1; i < 24; i++) {
        twoYearLabels.unshift(moment().endOf('month').subtract(i, 'months').format('MMM YY'))
    }

    //generates 1 year labels
    for (var i = 1; i <= 12; i++) {
        oneYearLabels.unshift(moment().endOf('month').subtract(i, 'months').format('MMM YY'))
    }

    for (var i = 1; i <= 13; i++) {
        threeMonthLabels.unshift(moment().endOf('month').subtract(i, 'weeks').format('MM/DD/YY'))
    }
}
dateLabelCreator()


//function that defines the colors of the chart
function chartColor(color, border, type, searchCounter) {
    //initial framework to change the shade of the color every time a new search for a stock happens
    //these values are not set in stone and can be adjusted
    
    

    var multiplier = 1.3;

    backgroundColor = "rgba(" + color[0] + "," + color[1] + "," + color[2] + ",0.4)"
    borderColor = "rgba(" + border[0] + "," + border[1] + "," + border[2] + ",1)"

    
        //the line color is changed here
        // color[0] = parseInt(color[0]) + 28;
        // color[1] = parseInt(color[1]) + 40;
        // color[2] = parseInt(color[2]) + 40;
        //the border color is changed here
    border[0] = Math.floor(parseInt(border[0]) * multiplier);
    border[1] = Math.floor(parseInt(border[1]) * multiplier);
    border[2] = Math.floor(parseInt(border[2]) * multiplier);

    

    // if (colorTracker.length > 0){
    //     for(i=0; i < border.length; i++){
    //         console.log(border[i])
    //         console.log(colorTracker[i])
    //         for(j=0; j < colorTracker.length; j++){    
    //            if (border[i] !== colorTracker[i]){
    //                 borderColor = border[i]
    //                 colorTracker.push(border[i])
    //                 return
    //             }
    //     }

    //     }

    // }
    // else {
    //    borderColor = border[0]
    //    colorTracker.push(border[0])
    // }

    // //colorTracker.push(border)
    // console.log(colorTracker)
    // console.log(searchCounter)




    //after five searches of the same type it changes from a solid line to a dashed line
    //after ten searches it goes back to solid
    //the problem is search 1 and search 11 of the same type will both be same color and solid line
    //same as search 6 and search 16 will be same color and dashed
    //it's a minor issue that may never get seen bc that's a lot of searches and we have the delete function
    //but it is an issue

    //just a minor note: if you make the dashEffect a global variable and change it, it changes every single
    //line in the chart to that dashEffect. I think bc the value is not passed and saved, 
    //instead the dataobject is just referencing it. The way I have it coded now works, but is not elegant.

    //if the search counter is 0-5, then it's a solid line
    if (searchCounter < 5) {

        dashEffect = [0, 0]

    }
    //resets the colors after five searches to the original colors
    else if (searchCounter === 5) {
        resetColors(type)
    }
    //if it's searches 6-10 then it goes to a dash line
    else if (searchCounter > 5 && searchCounter <= 10) {

        dashEffect = [5, 10]
    }

};

//function that resets the colors of the lines
function resetColors(type) {

    //resets the colors based on the type of search
    if (type === "stocks") {
        stocksBorder = [0, 105, 160];
    } else if (type === "commodity") {
        commodityBorder = [90, 138, 0];
    } else if (type === "currency") {
        currencyBorder = [36, 200, 183];
    }


} //end of resetColors Function

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
                revealChart();
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

function cryptocurrencyAJAX() {

    var priceURL = "https://www.cryptocompare.com/api/data/histoday/?e=CCCAGG&fsym=" + symbol + "&limit=690&tsym=USD"
    $.ajax({ url: priceURL, method: "GET" }).done(function(response) {
        console.log(response)

        type = "cryptocurrency";
        currencySearchCounter++;

        chartColor(currencyColor, currencyBorder, type, currencySearchCounter);
        //Janky Two Year Averager

        function CCtwoYear() {
            var count = 0;
            var total = 0;
            var month = Math.floor(response.Data.length / 23)
            currentData = []
            
            for (var i = 0; i < response.Data.length; i++) {
                total += response.Data[i].close
                count++

                if (count === month) {
                    currentData.push((total / count).toFixed(2))
                    count = 0
                    total = 0
                }
            }
        }
        CCtwoYear()
        twoYearViewArray.push(new stockDataObject(symbol, backgroundColor, borderColor, dashEffect, currentData))


        //Janky one Year Averager
        function CConeYear() {
            var count = 0;
            var total = 0;
            var month = Math.floor((response.Data.length / 12) / 2)
            var start = Math.floor(response.Data.length / 2)

            currentData = []
            console.log(month)
            for (var i = start; i < response.Data.length; i++) {
                total += response.Data[i].close
                count++
                if (count === month) {
                    currentData.push((total / count).toFixed(2))
                    count = 0
                    total = 0
                }
            }
        }

        CConeYear()
        oneYearViewArray.push(new stockDataObject(symbol, backgroundColor, borderColor, dashEffect, currentData))

        //Janky three Month Averager
        function CCthreeMonth() {
            var count = 0;
            var total = 0;

            currentData = []

            for (var i = response.Data.length - 91; i < response.Data.length; i++) {
                total += response.Data[i].close
                count++
                if (count === 7) {
                    currentData.push((total / count).toFixed(2))
                    count = 0
                    total = 0
                }
            }
        }
        CCthreeMonth()
        threeMonthViewArray.push(new stockDataObject(symbol, backgroundColor, borderColor, dashEffect, currentData))

        function CConeWeek() {
            currentData = []

            for (var i = response.Data.length - 7; i < response.Data.length; i++) {
                    currentData.push(response.Data[i].close).toFixed(2)
                }
            }
        
        CConeWeek()
        oneWeekViewArray.push(new stockDataObject(symbol, backgroundColor, borderColor, dashEffect, currentData))

		newTable(twoYearViewArray);
        mainChart.update();
    })
}

function revealChart() {
    $('.hideContainer').addClass('reveal')
    $('.logo').addClass('logoShrink')
    $('header').addClass('headerShrink')
    $('.title').css('opacity', '0')
    setTimeout(function() {
        $('.title').css('display', 'none')
        $('.hideContainer').addClass('autoHeight')
    }, 2000);

}

titleLoad();

function titleLoad() {
    setTimeout(function() {
        $('.title').css('opacity', '1')
    }, 1000);
}
//END OF REUSABLE FUNCTIONS
