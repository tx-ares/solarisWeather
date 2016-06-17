console.log("This is the REAL solarisWeather!")

console.log(navigator.geolocation.getCurrentPosition)

//NOTE : API KEY CHANGED.  apiKey variable contains updated api key.  06-07-16

//Url Components

var apiKey = "6fec34b5cf75de90f7d3add762e6e30b"
var baseUrl = "https://api.forecast.io/forecast/"
// var latLong = "/29.7605,-95.3698"
var params = "?callback=?"

// var fullUrl = baseUrl + apiKey + latLong + params
var tempContainer = document.querySelector("#tempContainer")

//DOM Nodes
var buttonEl = document.querySelector("button")
var currentlyButton = document.querySelector(".currently")
var hourlyButton = document.querySelector(".hourly")
var dailyButton = document.querySelector(".daily")

//Data Fetching
// var fetchCoords = function(lat, lng) {
//     // console.log("in fetchCoords")
//     // console.log(positionObject)
//     var lat = positionObject.coords.latitude
//      // console.log(positionObject.coords.latitude)
//     var lng = positionObject.coords.longitude
//          // console.log(positionObject.coords.longitude)


//     // GOAL: https://api.forecast.io/forecast/2f8bbb054008fb90b18775a618675ef6/37.8267,-122.423
//     var fullUrl = baseUrl + '/' + apiKey + '/' + lat + "," + lng + params
//     console.log(fullUrl + " <<<< FULL URL")

//     return fullUrl
    
//     var promise = $.getJSON(fullUrl)
        
//         promise.then(function(jsonData) {
//             console.log(jsonData)
//             tempContainer.innerHTML  = currentlyToHTML(jsonData)
//         })
// }



var errorCallback = function(error) {
    console.log(error)
}

var hashToObject = function() {
    var hashRoute = location.hash.substr(1)
    var hashParts = hashRoute.split('/')
    return {
        lat: hashParts[0],
        lng: hashParts[1],
        viewType: hashParts[2]
    }
}

// var handleJsonData = function(jsonData) {
//     var htmlString = ""
//     var currentlyObj = jsonData.currently
//     for (var prop in currentlyObj) {
//         var value = currentlyObj[prop]
//         console.log(value)
//     }
//     htmlString += currentlyToHTML(currentlyObj)
//     tempContainer.innerHTML = htmlString
// }

//View

var currentlyToHTML = function(jsonData) {
    console.log("Currently fired!")
    console.log(jsonData)

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
     console.log("Daily fired!")

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
    console.log("Hourly fired!")

    var htmlString = ''
    var hoursArray = jsonData.hourly.data
    for (var i = 0; i < 24; i ++) {  
        var hourObject = hoursArray[i]
        htmlString += '<div class="hour">' 
        htmlString += '<p class="hourTime">' + hourObject.time + '</p>'
        htmlString += '<p class="hourTemp">' + hourObject.temperature.toPrecision(2) + '&deg;</p>' ///create Html String displaying with the temperature attribute//
        htmlString += '<p class="hourIcon">' + hourObject.icon + '</p>'
        htmlString += '</div>' 
    }
    tempContainer.innerHTML = htmlString //change innerHtml of container div//
}

//Handlers

var handleForecastTypeClick = function(eventObj) {
    console.log(" <<<<<< In in handleForeCastTypeClick")
    window.location.hash = eventObj.target.className
}

//Router

var router = function() {

    if (!location.hash) {
    navigator.geolocation.getCurrentPosition(fetchCoords, errorCallback)    
    }

    var hashData = hashToObject()
    var promise = fetchCoords(hashData.lat,hashData.lng)

    if (window.location.hash === '#daily') {
        
        // var promise = $.getJSON(fullUrl)
        promise.then(dailyToHTML)
    
    }

    if (window.location.hash === '#hourly'){
        // var promise = $.getJSON(fullUrl)
        promise.then(hourlyToHTML)
    }

    if (window.location.hash === '#currently'){
        // console.log(fullUrl)
        // var promise = $.getJSON(fullUrl)
        promise.then(currentlyToHTML)
    }

}

var fetchCoords = function(lat,lng) {
    console.log(lat)
    console.log(lng)
    var url = baseUrl + apiKey + '/' + lat + ',' + lng
    var promise = $.getJSON(url)
    return promise
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


// navigator.geolocation.getCurrentPosition(fetchCoords, errorCallback)
window.addEventListener('hashchange', router)

var handleViewSwitch = function(eventObject) {
    var buttonEl = eventObject.target
    console.log(buttonEl)
    var viewType = buttonEl.value
    if (!viewType) {
        return 
    }
    var hashData = hashToObject()
    location.hash = hashData.lat + '/' + hashData.lng + '/' + viewType
}

buttonEl.addEventListener('click, handleViewSwitch')

// currentlyButton.addEventListener('click', handleForecastTypeClick)
// hourlyButton.addEventListener('click', handleForecastTypeClick)
// dailyButton.addEventListener('click', handleForecastTypeClick)

//Homepage Loader
// location.hash = 'currently'
router()