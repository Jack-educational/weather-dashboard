// let it use jquery


const apiKey = "b3930907c375f537a22fe584b3d8c57d"

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
            console.log(lat);
            console.log(lon);
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
            forecastjson = data.list;
            console.log(forecastjson);
        },
        error: function(error) {
            console.log(error);
        }

    });
}

$(document).ready(function() {
    $("#search-form").submit(function(event) {
        event.preventDefault();
        let city = $("#search-input").val();
        getCoordinates(city);
    });
});

// take the value of the text box and pass it to the getCoordinates function
