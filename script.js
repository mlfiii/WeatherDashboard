var currentDate = moment().format('MMMM DD, YYYY');
var currentDateArea = $(document).find(".date");
var currentDateString = moment().format('MMDDYYYY');

$("#find-city").on("click", function (event) {

    // event.preventDefault() can be used to prevent an event's default behavior.
    // Here, it prevents the submit button from trying to submit a form when clicked
    event.preventDefault();
    // console.log("clicked-city");
    // alert("find city");

    // Here we grab the text from the input box
    var city = $("#city-input").val();
    console.log(city)
    citySearch(city);

})


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
            $(".city").html("<h1>" + response.name + " Weather Details</h1>");
            $(".date").text("Date: " + currentDate);
            $(".weather-cond").html("Weather Conditions: " + txtWeatherCond + " " + iconWeather);
            $(".wind").text("Wind Speed: " + response.wind.speed);
            $(".humidity").text("Humidity: " + response.main.humidity);
            $(".temp").text("Temperature (F) " + response.main.temp);

            // Converts the temp to Kelvin with the below formula
            var tempF = (response.main.temp - 273.15) * 1.80 + 32;
            $(".tempF").text("Temperature (Kelvin) " + tempF);

            // Log the data in the console as well
            console.log("Wind Speed: " + response.wind.speed);
            console.log("Humidity: " + response.main.humidity);
            console.log("Temperature (F): " + response.main.temp);

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

        });

};