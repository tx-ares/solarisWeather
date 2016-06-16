console.log("Do a barrel roll!")

// --------------- Global Variables -----------------//

var apiKey = "2f8bbb054008fb90b18775a618675ef6"
var baseUrl = "https://api.forecast.io/forecast/"
// var latLong = "/29.7605,-95.3698"
var jsonp = "?callback=?"
var fullUrl = baseUrl + apiKey + latLong + jsonp
var tempContainer = document.querySelector("#tempContainer")

var currentlyButton = document.querySelector(".currently")
var hourlyButton = document.querySelector(".hourly")
var dailyButton = document.querySelector(".daily")

// -----------------  Getting data and Routing ------------------ //

var successCallback = function(positionObject) {
    var lat = positionObject.coords.latitude,
        long = positionObject.coords.longitude

    // GOAL: https://api.forecast.io/forecast/2f8bbb054008fb90b18775a618675ef6/37.8267,-122.423
    var fullUrl = baseUrl + "/" + apiKey + '/' + lat + "," + long + jsonp
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

//---------------- View Templates -------------------//

var objToHTML = function(jsonObj) {
    var tempString = ""
    tempString += '<div id="weatherContainer">'  
    tempString +=    '<p class="temperature"> Temperature: ' + jsonObj.currently.temperature + ' °f</p>' 
    tempString +=    '<p class="rainChance"> Rain chance: ' + jsonObj.currently.precipProbability + ' %</p>'
    tempString +=    '<p class="summary"> Summary: ' + jsonObj.currently.summary + '</p>'
    tempString += '</div>'
    console.log(jsonObj)
    tempContainer.innerHTML = tempString
    // return tempString
}

//------------Where I left off, trying to loop through the days in 'data' array of jsonObj-------//
var dailyToHTML = function(jsonObj) {
    var tempString = ""
    var weekArray = jsonData.daily.temperature

    for (var i=0 ; i < weekArray.length; i++) {
    var dayObj = weekArray[i]
    // tempString += '<div id="weatherContainer">'
    tempString += '<div class="day">'  
    tempString +=    '<p class="summary"> Summary: ' + jsonObj.daily.summary + '</p>'
    tempString += '</div>'
}
    console.log(tempString)
    tempContainer.innerHTML = tempString
    // return tempString
}

var hourlyToHTML = function(jsonObj) {
    var tempString = ''
    tempString += '<div id="weatherContainer">'  
    tempString +=    '<p class="temperature"> Temperature: ' + jsonObj.currently.temperature + '!!! °f</p>' 
    tempString +=    '<p class="rainChance"> Rain chance: ' + jsonObj.currently.precipProbability + ' %</p>'
    tempString +=    '<p class="summary"> Summary: ' + jsonObj.currently.summary + '</p>'
    tempString += '</div>'
    console.log(jsonObj)
    tempContainer.innerHTML = '<img src="images/orangeLoaderGif.gif"'
    tempContainer.innerHTML = tempString
    // return tempString
}

var handleForecastTypeClick = function(eventObj) {
	console.log(eventObj)
	console.log(eventObj.target)
	console.log(eventObj.target.className)
	console.log('this works!')

	window.location.hash = eventObj.target.className
}

var hashController = function() {
	console.log('hashController') 	
	console.log(window.location.hash)
	if (window.location.hash === '#daily') {
		
		var promise = $.getJSON(fullUrl)
		promise.then(dailyToHTML)
	
		// tempContainer.innerHTML = dailyToHTML 
	}

	else if (window.location.hash === '#hourly'){

		var promise = $.getJSON(fullUrl)
		promise.then(hourlyToHTML)
		// tempContainer.innerHTML = '<h1>Hourly</h1>'
	}

	else {

		var promise = $.getJSON(fullUrl)
		promise.then(objToHTML)
		// tempContainer.innerHTML	= '<h1>Currently</h1>'
	}

}

// var forecastPromise = $.getJSON(fullUrl) +
// forecastPromise.then(handleJsonData)

// -----------------  Setting it off! ------------------ //

navigator.geolocation.getCurrentPosition(successCallback, errorCallback)

window.addEventListener('hashchange', hashController)

currentlyButton.addEventListener('click', handleForecastTypeClick)
hourlyButton.addEventListener('click', handleForecastTypeClick)
dailyButton.addEventListener('click', handleForecastTypeClick)