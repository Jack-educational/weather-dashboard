
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

    // trim the date only from datetime string and wrap in parentheses
    dateToday = "(" + weatherNow[0].datetime.substring(0, 10) + ")";

    // set the attributes for daily data in the DOM 
    $('#city-name').text(weatherNow[0].city);
    $('#current-date').text(dateToday);
    
    // write the text and the value of the temperature to the DOM
    $('#current-temp').text("Temperature: " + (weatherNow[0].temp.toFixed(2) + " °C"));

    // write the text and the value of the wind speed to the DOM
    $('#current-wind').text("Wind: " + (weatherNow[0].wind + " km/h"));

    // write the text and the value of the humidity to the DOM
    $('#current-humidity').text("Humidity: " + (weatherNow[0].humidity + "%"));

    // empty array to receive the forecast data
    var forecast = [];

    for (let i = 0; i < forecastjson.list.length; i++) {
        const forecastData = [ 
            {
                forecastDate: forecastjson.list[i].dt_txt,                //.substring(0, 10),
                forecastIcon: forecastjson.list[i].weather[0].icon,
                forecastTemp: (forecastjson.list[i].main.temp-273.15).toFixed(2), // convert from kelvin to celsius
                forecastHumidity: forecastjson.list[i].main.humidity,
                forecastWind: forecastjson.list[i].wind.speed
            }
        ]

        // append the forecast data to the forecast array
        forecast.push(forecastData);
    }

    // restructuring the array to get rid of the nested array
    forecast = forecast.map(function (item) {
        return item[0];
    });

    // group the forecast data by date
    var forecastByDate = forecast.reduce(function (r, a) {

        r[a.forecastDate.substring(0, 10)] = r[a.forecastDate.substring(0, 10)] || [];
        r[a.forecastDate.substring(0, 10)].push(a);
        return r;
    }, Object.create(null));

    // console.log(forecastByDate);

    // takes the maximum values for each day
    var forecastByDateMax = Object.keys(forecastByDate).map(function (key) {
        return {
            forecastDate: key,
            forecastIcon: forecastByDate[key][0].forecastIcon,
            forecastTemp: forecastByDate[key].reduce(function (r, a) {
                return Math.max(r, a.forecastTemp);
            }, 0),
            forecastHumidity: forecastByDate[key].reduce(function (r, a) {
                return Math.max(r, a.forecastHumidity);
            }, 0),
            forecastWind: forecastByDate[key].reduce(function (r, a) {
                return Math.max(r, a.forecastWind);
            }, 0)
        };
    });
    console.log(forecastByDateMax);

    // this was originally written out for each day, but I couldn't figure out how to loop through the array to write the data to the DOM until more recently
    for (let i = 0; i < forecastByDateMax.length; i++) {

        let iconUrlvar = ("http://openweathermap.org/img/w/" + forecastByDateMax[i].forecastIcon + ".png")

        $('#day-' + (i + 1) + '-date').text(forecastByDateMax[i].forecastDate);
        $('#day-' + (i + 1) + '-icon').html('<img src="' + iconUrlvar + '" alt="Weather icon">');
        $('#day-' + (i + 1) + '-temp').text("Max temp: " + (forecastByDateMax[i].forecastTemp.toFixed(2) + " °C"));
        $('#day-' + (i + 1) + '-wind').text("Wind: " + (forecastByDateMax[i].forecastWind + " km/h"));
        $('#day-' + (i + 1) + '-humidity').text("Humidity: " + (forecastByDateMax[i].forecastHumidity + "%"));
    }
}

//$('#icon-from-url').html('<img src="' + iconURL + '" alt="Weather icon">');

$(document).ready(function() {
    $("#search-form").submit(function(event) {

        // prevent the form from submitting
        event.preventDefault();

        // check if the input field is empty and warn, otherwise get the city name
        if ($("#search-input").val() === "") {
            alert("Please enter a city name");
        } else {
            let city = $("#search-input").val();
            getCoordinates(city);

            // add the city to the history array
            if (history.indexOf(city) === -1) {
                history.push(city);
                localStorage.setItem("history", JSON.stringify(history));
            }
            console.log(history);
            renderHistory();
        }
    });

    let history = JSON.parse(localStorage.getItem("history")) || [];

    // render the history list into the html page
    function renderHistory() {
        $(".list-group").empty();
        $("#history").append('<ul class="history-buttons">');
        for (let i = 0; i < history.length; i++) {
            $(".history-buttons").append('<li class="list-group-item"><button class="btn btn-light btn-block history-button" type="button" data-city="' + history[i] + '">' + history[i] + '</button></li>');
        };
        $("#history").append('</ul>');
    }
    // add an event listener to the history buttons 
    $(document).on("click", ".history-button", function(event) {
        event.preventDefault();
        let city = $(this).attr("data-city");
        
        getCoordinates(city);
    });
    
    renderHistory();
});

