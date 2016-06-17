
console.log("This is the REAL solarisWeather!")

//NOTE : API KEY CHANGED.  apiKey variable contains updated api key.  06-07-16

//Url Components
var apiKey = "6fec34b5cf75de90f7d3add762e6e30b"
var baseUrl = "https://api.forecast.io/forecast/"
var params = "?callback=?"


//DOM Nodes
var containerEl = document.querySelector("#tempContainer")
var currentlyButton = document.querySelector(".currently")
var hourlyButton = document.querySelector(".hourly")
var dailyButton = document.querySelector(".daily")


//Location Reader
function locationReader(geolocation) {
    console.log(geolocation)
    location.hash = geolocation.coords.latitude + '/' + geolocation.coords.longitude + '/currently'
}


//Data Fetching
var errorCallback = function(error) {
    console.log(error)
}

var hashToObject = function() {
    var hashRoute = location.hash.substr(1)
    console.log(hashRoute)
    var hashParts = hashRoute.split('/')
    return {
        lat: hashParts[0],
        lng: hashParts[1],
        viewType: hashParts[2]
    }
}


//Views
var currentlyToHTML = function(jsonData) {
    console.log(jsonData)
    console.log(jsonData.currently)
    var htmlString = ""
    htmlString += '<div id="weatherContainer">'  
    htmlString += '<canvas id="icon1" width="128" height="128"></canvas>'
    htmlString +=    '<p class="temperature"> Temperature: ' + jsonData.currently.temperature + ' °f</p>' 
    htmlString +=    '<p class="rainChance"> Rain chance: ' + jsonData.currently.precipProbability + ' %</p>'
    htmlString +=    '<p class="summary"> Summary: ' + jsonData.currently.summary + '</p>'
    htmlString += '</div>'
    var iconString = jsonData.currently.icon
    
    // console.log(jsonData)
    containerEl.innerHTML = htmlString
    skycons(iconString)
}

var dailyToHTML = function(jsonData) { 
    var iconString = jsonData.currently.icon
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
        
        skycons(iconString)
    }
    containerEl.innerHTML = htmlString //change innerHtml of container div to the new string//
     
}

var hourlyToHTML = function(jsonData) { 
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
        var iconString = jsonData.currently.icon
        skycons(iconString)
    }
    containerEl.innerHTML = htmlString //change innerHtml of container div//
}


//Router
var router = function() {
console.log('router activated.')

    if (!location.hash) {
        console.log("Blank hash detected, finding one...")
        navigator.geolocation.getCurrentPosition(locationReader,errorCallback)
        return 
    }
    var hashData = hashToObject()
    console.log(hashData)
    var weatherPromise = fetchData(hashData.lat,hashData.lng)

    if (hashData.viewType === 'daily') {
        console.log("Daily view rendered!")
        weatherPromise.then(dailyToHTML)
    }

    if (hashData.viewType === 'hourly'){
        console.log("Hourly view rendered!")
        weatherPromise.then(hourlyToHTML)
    }

    if (hashData.viewType === 'currently'){
        console.log("Currently view rendered!")
        weatherPromise.then(currentlyToHTML)
    }

}

var fetchData = function(lat,lng) {
    console.log('Promise contructed!')
    var url = baseUrl + apiKey + '/' + lat + ',' + lng
    var promise = $.getJSON(url)
    return promise
}


//Handlers
var handleForecastTypeClick = function(eventObj) {
    var viewType = eventObj.target.className
    console.log(viewType)
    if (!viewType) {
        return 
    }
    var hashData = hashToObject()
    console.log(hashData)
    location.hash = hashData.lat + '/' + hashData.lng + '/' + viewType
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


currentlyButton.addEventListener('click', handleForecastTypeClick)
hourlyButton.addEventListener('click', handleForecastTypeClick)
dailyButton.addEventListener('click', handleForecastTypeClick)


//Homepage Loader
window.addEventListener('hashchange', router)
router()