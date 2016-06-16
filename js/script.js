console.log("This is the REAL solarisWeather!")

console.log(navigator.geolocation.getCurrentPosition)

//NOTE : API KEY CHANGED.  apiKey variable contains updated api key.  06-07-16

//Url Components

var apiKey = "6fec34b5cf75de90f7d3add762e6e30b"
var baseUrl = "https://api.forecast.io/forecast/"
var latLong = "/29.7605,-95.3698"
var params = "?callback=?"

var fullUrl = baseUrl + apiKey + latLong + params
var tempContainer = document.querySelector("#tempContainer")

//DOM Nodes
var currentlyButton = document.querySelector(".currently")
var hourlyButton = document.querySelector(".hourly")
var dailyButton = document.querySelector(".daily")

//Data Fetching

var successCallback = function(positionObject) {
    var lat = positionObject.coords.latitude,
        long = positionObject.coords.longitude

    // GOAL: https://api.forecast.io/forecast/2f8bbb054008fb90b18775a618675ef6/37.8267,-122.423
    var fullUrl = baseUrl + "/" + apiKey + '/' + lat + "," + long + params
    console.log(fullUrl)
    
    $.getJSON(fullUrl).then(
        function(resp) {
            console.log(resp)
            tempContainer.innerHTML  = objToHTML(resp)
        })
}

var errorCallback = function(error) {
    console.log(error)
}

var handleJsonData = function(jsonData) {
    var htmlString = ""
    var currentlyObj = jsonData.currently
    for (var prop in currentlyObj) {
        var value = currentlyObj[prop]
        console.log(value)
    }
    htmlString += objToHTML(currentlyObj)
    tempContainer.innerHTML = htmlString
}

//View

var objToHTML = function(jsonData) {
    

    var tempString = ""
    tempString += '<div id="weatherContainer">'  
    tempString += '<canvas id="icon1" width="128" height="128"></canvas>'
    tempString +=    '<p class="temperature"> Temperature: ' + jsonData.currently.temperature + ' °f</p>' 
    tempString +=    '<p class="rainChance"> Rain chance: ' + jsonData.currently.precipProbability + ' %</p>'
    tempString +=    '<p class="summary"> Summary: ' + jsonData.currently.summary + '</p>'
    tempString += '</div>'
    var iconString = jsonData.currently.icon
    
    console.log(jsonData)
    tempContainer.innerHTML = tempString
    skycons(iconString)
}

var dailyToHTML = function(jsonData) { //create html string with data obtained from jsonData object//
    var htmlString = ''
    var daysArray = jsonData.daily.data
        
        htmlString += '<p>' + jsonData.daily.summary + '</p>'

    for (var i = 0; i < 5; i ++) { //Create for loop to obtain multiple days of weather//
        var dayObject = daysArray[i] 
        htmlString += '<div class="day">' //create a div to house your data
        htmlString += '<canvas id="icon1" width="128" height="128"></canvas>'
        htmlString += '<p class="max">' + dayObject.temperatureMax.toPrecision(2) + '&deg; High</p>' ///append the the tempatureMax attribute to the html string//
        htmlString += '<p class="min">' + dayObject.temperatureMin.toPrecision(2) + '&deg; Low</p>'///append the the tempatureMin attribute to the html string//
        htmlString += '</div>' //close div//
    }
    tempContainer.innerHTML = htmlString //change innerHtml of container div to the new string//
     skycons(iconString)
}

var hourlyToHTML = function(jsonData) { //create html string with data obtained from jsonData object//
    var htmlString = ''
    var hoursArray = jsonData.hourly.data
    for (var i = 0; i < 24; i ++) {  //create for loop to obtain multiple hours of weather//
        var hourObject = hoursArray[i]
        htmlString += '<div class="hour">' //create a div to house your data
        // htmlString += '<p class="hour">' + hourObject.
        htmlString += '<p class="hourTime">' + hourObject.time + '</p>'
        htmlString += '<p class="hourTemp">' + hourObject.temperature.toPrecision(2) + '&deg;</p>' ///create Html String displaying with the temperature attribute//
        htmlString += '<p class="hourIcon">' + hourObject.icon + '</p>'
        htmlString += '</div>' //close div//
    }
    tempContainer.innerHTML = htmlString //change innerHtml of container div//
}

//Handlers

var handleForecastTypeClick = function(eventObj) {

    window.location.hash = eventObj.target.className
}

//Router

var hashController = function() {

    if (window.location.hash === '#daily') {
        
        var promise = $.getJSON(fullUrl)
        promise.then(dailyToHTML)
    
    }

    if (window.location.hash === '#hourly'){
        var promise = $.getJSON(fullUrl)
        promise.then(hourlyToHTML)
    }

    if (window.location.hash === '#currently'){
        var promise = $.getJSON(fullUrl)
        promise.then(objToHTML)
    }

}

//Skycons 

var skycons = function(iconString) {
  var formattedIcon = iconString.toUpperCase().replace(/-/g,"_")
  var skycons = new Skycons({"color": "white"});
  // on Android, a nasty hack is needed: {"resizeClear": true}

  // you can add a canvas by it's ID...
  skycons.add("icon1", Skycons[formattedIcon]);

  // ...or by the canvas DOM element itself.
  //skycons.add(document.getElementById("icon2"), Skycons.RAIN);

  // if you're using the Forecast API, you can also supply
  // strings: "partly-cloudy-day" or "rain".

  // start animation!
  skycons.play();

  // you can also halt animation with skycons.pause()

  // want to change the icon? no problem:
  //skycons.set("icon1", Skycons.PARTLY_CLOUDY_NIGHT);

  // want to remove one altogether? no problem:
  //skycons.remove("icon2");
}

//Homepage Loader

navigator.geolocation.getCurrentPosition(successCallback, errorCallback)
window.addEventListener('hashchange', hashController)

currentlyButton.addEventListener('click', handleForecastTypeClick)
hourlyButton.addEventListener('click', handleForecastTypeClick)
dailyButton.addEventListener('click', handleForecastTypeClick)