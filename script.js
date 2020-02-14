var currentDate = moment().format('MM/DD/YYYY');
var currentDateArea = $(document).find(".date");
var currentDateString = moment().format('MMDDYYYY');
var cities = [];
var cityList = $("#prior-search-list");


var storedCities = JSON.parse(localStorage.getItem("cities"));
var currentCity = window.localStorage.getItem('last_city')



// If highscores were retrieved from localStorage, update the highscores array to it
if (storedCities !== null) {
    cities = storedCities;
}

citySearch(currentCity);

$("#find-city").on("click", function (event) {

    // Here, it prevents the submit button from trying to submit a form when clicked
    event.preventDefault();

    // Here we grab the text from the input box
    var city = $("#city-input").val();

    //Save the city text to list 
    saveCity(city);

    //Start the search
    citySearch(city);


})

$("#prior-search-list").on("click", '.li_item', function () {
    //If the scores are not currently visible, show them.

    var city = $(this).attr("data-city");

    //When the text is clicked, initiate the city search
    citySearch(city);


});

//Used to search for a city
function citySearch(city) {

    // Return from function early if submitted initials is blank
    if (city === "") {
        return;
    }

    // This is our API key
    var APIKey = "4cc21abac77ff1659707203c7c342f15";

    // Here we are building the URL we need to query the database
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?" +
        "q=" + city + "&units=imperial&appid=" + APIKey;


    // Here we run our AJAX call to the OpenWeatherMap API
    $.ajax({
        url: queryURL,
        method: "GET"
    })
        // We store all of the retrieved data inside of an object called "response"
        .then(function (response) {


            var weather = response.weather;

            for (var i = 0; i < weather.length; i++) {

                var txtWeatherCond = weather[i].description
                var iconWeather = " <img src=https://openweathermap.org/img/wn/" + weather[i].icon + ".png>"

            };


            // Transfer content to HTML
            $(".city").html("<h4>" + response.name + " (" + currentDate + ")" + iconWeather + "</h4>");
            $(".wind").html("<strong>Wind Speed:</strong>  " + response.wind.speed);
            $(".humidity").html("<strong>Humidity:</strong> " + response.main.humidity);
            $(".temp").html("<strong>Temperature:</strong>  " + response.main.temp);

            // Converts the temp to Kelvin with the below formula
            var tempF = (response.main.temp - 273.15) * 1.80 + 32;
            $(".tempF").html("<strong>Temperature:<strong>  " + tempF);

            var lon = response.coord.lon
            var lat = response.coord.lat

            var queryUVI = "https://api.openweathermap.org/data/2.5/uvi?appid=" + APIKey + "&lat=" + lat + "&lon=" + lon

            $.ajax({
                url: queryUVI,
                method: "GET"
            })

                .then(function (response2) {

                    $(".uvi").html("<strong>UVI:</strong>  " + response2.value);

                });


            var cityID = response.id


            var queryForecast = "https://api.openweathermap.org/data/2.5/forecast?id=" + cityID + "&appid=" + APIKey + "&cnt=40"
            $.ajax({

                url: queryForecast,
                method: "GET"
            })

                .then(function (response3) {

                    var forecast = response3.list;
                    var forecast2 = response3


                    $(".dayforecast").empty();

                    var data = forecast;
                    var res = alasql('SELECT (day + min_time) dt_txt FROM (SELECT day, min(time) min_time FROM (SELECT SUBSTRING(dt_txt,1,10) day,SUBSTRING(dt_txt,11,length(dt_txt)) time  FROM ?) X '
                        + 'GROUP BY  day) Y ', [data]);

                    var res1 = alasql('SELECT data.* \
                        FROM ? res JOIN ? data USING dt_txt', [res, data]);


                    for (var i = 0; i < res1.length; i++) {


                        var txtNum = ".forecast-" + i
                        var forecastArea = $(document).find(txtNum);

                        var div = $("<div>");
                        var img = $("<img>");
                        var divtemp = $("<div>");
                        var divhumidity = $("<div>");
                        var divspace = $("<div>");
                        var txtDate = res1[i].dt_txt;

                        img.attr("src", "https://openweathermap.org/img/wn/" + res1[i].weather[0].icon + ".png")


                        divtemp.text("Temp: " + parseInt((res1[i].main.temp - 273.15) * (9 / 5) + 32) + "F");

                        divhumidity.text("Humidity: " + res1[i].main.humidity);


                        div.text(txtDate.substr(5, 2) + "/" + txtDate.substr(8, 2) + "/" + txtDate.substr(0, 4));

                        forecastArea.append(div, img, divtemp, divhumidity, divspace);
                        $("#forecast_area").removeAttr("hidden")



                    };

                })

                ;

        })

        .catch((e) => {

            // Return from function early if submitted initials is blank
            if (city === "") {
                return;
            }


            alert(`The unknown error has occurred: ${e.responseText}`);
            return;
        }



            // alert("")
        );

};


//Saves the city text to the
function saveCity(city) {

    event.preventDefault();

    var cityText = {
        city: city
    };

    window.localStorage.setItem('last_city', city);


    // Return from function early if submitted initials is blank
    if (cityText === "") {
        return;
    }

    cities.push(cityText);


    //Empty the list so it can be repopulated.
    $("#prior-search-list").empty();

    // Render a new li for each high score stored locally
    for (var i = 0; i < cities.length; i++) {


        var c = cities[i].city;


        var li = $("<li>");
        li.attr('class', 'li_item')
        li.text(c);
        li.attr("data-city", c);

        cityList.append(li);

    };

};


