var currentDate = moment().format('MM/DD/YYYY');
var currentDateArea = $(document).find(".date");
var currentDateString = moment().format('MMDDYYYY');
var cities = [];
var cityList = $("#prior-search-list");

// Get stored highscores from localStorage
// Parsing the JSON string to an object
var storedCities = JSON.parse(localStorage.getItem("cities"));

// If highscores were retrieved from localStorage, update the highscores array to it
if (storedCities !== null) {
    cities = storedCities;
}

$("#find-city").on("click", function (event) {

    // event.preventDefault() can be used to prevent an event's default behavior.
    // Here, it prevents the submit button from trying to submit a form when clicked
    event.preventDefault();
    // console.log("clicked-city");
    // alert("find city");

    // Here we grab the text from the input box
    var city = $("#city-input").val();

    saveCity(city);
    console.log(city)
    citySearch(city);

})

$("#prior-search-list").on("click", '.li_item', function () {
    //If the scores are not currently visible, show them.
    // debugger;
    // alert("Got here!")
    var city = $(this).attr("data-city");

    citySearch(city);
    // debugger;
    console.log(city)
    // if (viewHighScores === false) {
    //     highScoreArea.removeAttribute("hidden");
    //     viewHighScores = true;
    //     //If the scores are currently visible, hide them.
    // } else if (viewHighScores === true) {
    //     highScoreArea.setAttribute("hidden", "false");
    //     viewHighScores = false;
    // }

});

function citySearch(city) {
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

            // Log the queryURL
            console.log(queryURL);

            // Log the resulting object
            console.log(response);











            var weather = response.weather;

            for (var i = 0; i < weather.length; i++) {

                var txtWeatherCond = weather[i].description
                var iconWeather = " <img src=https://openweathermap.org/img/wn/" + weather[i].icon + ".png>"

                console.log("weather:", txtWeatherCond)

                // https://openweathermap.org/img/wn/02n.png
                // <img style="-webkit-user-select: none;max-width: 100%;margin: auto;" src="https://openweathermap.org/img/wn/02n.png">
            };

            // <div class="city">city</div>
            // <div class="date">date</div>
            // <div class="weather-cond">weather-cond</div>
            // <div class="temp">temp</div>
            // <div class="humidity">humidity</div>
            // <div class="wind">wind</div>
            // <div class="uvi">uvi</div>

            // Transfer content to HTML
            $(".city").html("<h4>" + response.name + " (" + currentDate + ")" + iconWeather + "</h4>");
            // $(".date").text("Date: " + currentDate);
            // $(".weather-cond").html("Weather Conditions: " + txtWeatherCond + " " + iconWeather);
            $(".wind").text("Wind Speed: " + response.wind.speed);
            $(".humidity").text("Humidity: " + response.main.humidity);
            $(".temp").text("Temperature:" + response.main.temp);

            // Converts the temp to Kelvin with the below formula
            var tempF = (response.main.temp - 273.15) * 1.80 + 32;
            $(".tempF").text("Temperature: " + tempF);

            // Log the data in the console as well
            console.log("Wind Speed: " + response.wind.speed);
            console.log("Humidity: " + response.main.humidity);
            console.log("Temperature: " + response.main.temp);

            var lon = response.coord.lon
            var lat = response.coord.lat

            console.log("lon:", lon)
            console.log("lat:", lat)


            var queryUVI = "https://api.openweathermap.org/data/2.5/uvi?appid=" + APIKey + "&lat=" + lat + "&lon=" + lon

            console.log(queryUVI)
            $.ajax({
                url: queryUVI,
                method: "GET"
            })

                .then(function (response2) {

                    // Log the resulting object
                    console.log("UVI RESPONSE:", response2);
                    $(".uvi").text("UVI:" + response2.value);

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

                    // console.log(response3)
                    // Log the resulting object

                    console.log("FORECAST:", forecast);
                    console.log("FORECAST2:", forecast2);

                    $(".dayforecast").empty();

                    // $(".uvi").text("UVI:" + response2.value);
                    "2020-02-14 00:00:00"
                    var data = forecast;
                    var res = alasql('SELECT (day + min_time) dt_txt FROM (SELECT day, min(time) min_time FROM (SELECT SUBSTRING(dt_txt,1,10) day,SUBSTRING(dt_txt,11,length(dt_txt)) time  FROM ?) X '
                        + 'GROUP BY  day) Y ', [data]);

                    var res1 = alasql('SELECT data.* \
                        FROM ? res JOIN ? data USING dt_txt', [res, data]);

                    // document.getElementById("res").textContent = JSON.stringify(res);

                    for (var i = 0; i < res1.length; i++) {


                        // var txtWeatherCond = forecast[i].weather[0].main;
                        debugger;

                        // var iconLink = " <img src=https://openweathermap.org/img/wn/" + forecast[i].weather[0].icon + ".png>"
                        var txtNum = ".forecast-" + i
                        var forecastArea = $(document).find(txtNum);
                        // forecastArea.attr("class", "dayforecast")
                        var div = $("<div>");
                        var img = $("<img>");
                        var divtemp = $("<div>");
                        var divhumidity = $("<div>");
                        var divspace = $("<div>");
                        var txtDate = res1[i].dt_txt;

                        img.attr("src", "https://openweathermap.org/img/wn/" + res1[i].weather[0].icon + ".png")
                        // console.log("https://openweathermap.org/img/wn/" + forecast[i].weather[0].icon + ".png>");
                        // debugger;
                        //(0K − 273.15) × 9/5 + 32 
                        divtemp.text("Temp: " + parseInt((res1[i].main.temp - 273.15) * (9 / 5) + 32) + "F");
                        debugger;
                        divhumidity.text("Humidity: " + res1[i].main.humidity);
                        // console.log(forecast[i].main.humidity)

                        // debugger;
                        // console.log(txtWeatherCond)
                        // var iconWeather = " <img src=https://openweathermap.org/img/wn/" + weather[i].icon + ".png>"
                        // debugger;
                        // console.log("forecast weather:", txtWeatherCond, txtDate.substring(0, 10), txtNum);

                        console.log(txtDate.substr(0, 10))
                        console.log(txtDate.substr(5, 2))
                        console.log(txtDate.substr(8, 2))

                        console.log(txtDate.substr(0, 4))

                        // $(txtNum).text();
                        div.text(txtDate.substr(5, 2) + "/" + txtDate.substr(8, 2) + "/" + txtDate.substr(0, 4));
                        debugger;
                        forecastArea.append(div, img, divtemp, divhumidity, divspace);

                        debugger;

                        // https://openweathermap.org/img/wn/02n.png
                        // <img style="-webkit-user-select: none;max-width: 100%;margin: auto;" src="https://openweathermap.org/img/wn/02n.png">



                    };

                })

                ;

        })

        .catch((e) => console.log('Exception: ', e));


    // api.openweathermap.org/data/2.5/forecast?id={city ID}&appid={your api key}

};



function saveCity(city) {

    event.preventDefault()




    var cityText = {
        city: city
    };
    // console.log("city text:", cityText)

    // Return from function early if submitted initials is blank
    if (cityText === "") {
        return;
    }
    // localStorage.setItem('city', cityText);
    cities.push(cityText);

    // Render a new li for each high score stored locally
    for (var i = 0; i < cities.length; i++) {


        // console.log("cities array:", cities[i].city)

        var c = cities[i].city;

        // console.log(c)

        var li = $("<li>");
        li.attr('class', 'li_item')
        li.text(c);
        li.attr("data-city", c);

        cityList.append(li);

    };
    // // Add new highscore to initials array, clear the input
    // highscore.push(initialsText);
    // initialsInput.value = "";
    // highscore.hidden = "";
    // // Store updated initials in localStorage, re-render the list
    // storeHighScore();
    // renderHighScore();

};


