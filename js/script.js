
// define api key as a constant
const apiKey = "b3930907c375f537a22fe584b3d8c57d"

// store api key in localStorage for later use
localStorage.setItem(apiKey, "b3930907c375f537a22fe584b3d8c57d");



function getCoordinates (city) {
    let geocodingBaseURI = "https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=5&appid=" + apiKey;
    let lat = "";
    let lon = "";

    $.ajax({
        url: geocodingBaseURI,
        type: 'GET',
        dataType: 'json',
        success: function(data) {
            lat = data[0].lat;
            lon = data[0].lon;
            getWeather(lat, lon);
            // console.log(lat);
            // console.log(lon);
        },
        error: function(error) {
            console.log(error);
        }
    });
}

function getWeather(lat, lon) {
    let forecastBaseURI = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey;
    $.ajax({
        url: forecastBaseURI,
        type: 'GET',
        dataType: 'json',
        success: function(data) {
            var forecastjson = data;
            // console.log(forecastjson);
            displayWeather(forecastjson);
        },
        error: function(error) {
            console.log(error);
        }
    });
}




function displayWeather(forecastjson) {

    // store todays weather data 

    const weatherNow = [ 
        {
            city: forecastjson.city.name,
            datetime: forecastjson.list[0].dt_txt,
            icon: forecastjson.list[0].weather[0].icon,
            temp: (forecastjson.list[0].main.temp)-273.15, // convert from kelvin to celsius
            humidity: forecastjson.list[0].main.humidity,
            wind: forecastjson.list[0].wind.speed
        }

    ]

    // fetch the weather icon using the code from json data
    var iconURL = "http://openweathermap.org/img/w/" + weatherNow[0].icon + ".png";

    // write the img tag with the src attribute to the DOM
    $('#icon-from-url').html('<img src="' + iconURL + '" alt="Weather icon">');

    // // setting src attribute for the weather icon image in the DOM
    // $('#icon-from-url').attr('src', iconURL);

    // trim the date only from datetime string and wrap in parentheses
    dateToday = "(" + weatherNow[0].datetime.substring(0, 10) + ")";

    // set the attributes for daily data in the DOM 
    $('#city-name').text(weatherNow[0].city);
    $('#current-date').text(dateToday);
    
    // write the text and the value of the temperature to the DOM
    $('#current-temp').text("Temperature: " + (weatherNow[0].temp.toFixed(2) + " °C"));

    // write the text and the value of the wind speed to the DOM
    $('#current-wind').text("Wind :" + (weatherNow[0].wind + " km/h"));

    // write the text and the value of the humidity to the DOM
    $('#current-humidity').text("Humidity: " + (weatherNow[0].humidity + "%"));


    // print the first entry of the array to the console
    console.log("City name: " + weatherNow[0].city);
    console.log("Date: " + weatherNow[0].datetime);
    console.log("Weather Icon: " + weatherNow[0].icon);
    console.log("Temperature: " + weatherNow[0].temp.toFixed(2) + " °C");
    console.log("Humidity: " + weatherNow[0].humidity + "%");
    console.log("Wind speed: " + weatherNow[0].wind + " km/h");
}

$(document).ready(function() {
    $("#search-form").submit(function(event) {
        event.preventDefault();
        let city = $("#search-input").val();
        getCoordinates(city);
    });

    $(".history-button").click(function(event) {
        event.preventDefault();
        let city = $(this).attr("data-city");
        getCoordinates(city);
    });
});





// console.log("City name: " + city);
// console.log("Date: " + toString(forecastjson.list[0].dt_txt));
// console.log("Weather Icon: " + (forecastjson.list[0].weather[0].icon));
// console.log("Temperature :" + toString(forecastjson.list[0].main.temp));
// console.log("Humidity: " + toString(forecastjson.list[0].main.humidity));
// console.log("Wind speed: " + toString(forecastjson.list[0].wind.speed));

