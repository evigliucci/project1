$(document).ready(function () {
    //set lat & long by pulling from document and setting our API key with queryurl 
    //need to update lat and long to trailhead location
    var lat = localStorage.getItem("lat");
    var long = localStorage.getItem("long");
    var weatherAPIKey = "2aefe10b8806f4469247d8807ad2c892";
    var weatherURL = "http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + long + "&APPID=" + weatherAPIKey;

    var hike = {
        maxDistance: 10,
        minLength: 0,
        minStars: parseInt($('.avgRating .checked').length),
        apiKey: "200712211-0e0047c0b205b2d2705a464dd36eccec"
    }

    //geolocation function
    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.watchPosition(showPosition);
        } else {
            demo.innerHTML = "Geolocation is not supported by this browser.";
        }
    }

    function showPosition(position) {
        localStorage.setItem("lat", position.coords.latitude);
        localStorage.setItem("long", position.coords.longitude);
    };

    function choices() {
        hike.maxDistance = parseInt($("#radius").find("option:selected").val());
        hike.minLength = parseInt($("#minTrailLength").find("option:selected").val());
    };

    // Hiking API
    function hikingTrails() {
        var hikeURL = "https://www.hikingproject.com/data/get-trails?lat=" + lat + "&lon=" + long + "&minLength=" + hike.minLength + "&maxDistance=" + hike.maxDistance + "&minStars=" + hike.minStars + "&key=" + hike.apiKey;

        $.ajax({
            url: hikeURL,
            method: "GET",
            dataType: "JSON",
        }).then(function (response) {
            var i = 0;

            for (trail in response.trails) {
                i++;
                createTrailList(response, i);
            }
        });
    };

    function createTrailList(response, i) {
        var card = $("<div class='card'>");
        var cardBody = $("<div class='card-body'>");
        var title = $("<h3 class='card-title'>").text(response.trails[i].name);
        // var summary = $("<p class='card-text'>").text(response.trails[i].summary);
        var stars = $("<p class='card-text'>").text("Stars: " + response.trails[i].stars);
        var trailLength = $("<p class='card-text'>").text("Trail Length: " + response.trails[i].length + " miles");
        var condition = $("<p class='card-text'>").text("Trail condition: " + response.trails[i].conditionStatus);
        var hikeBtn = $("<a href='#' class='btn btn-primary stretched-link'>Let's Hike</a>")
        var src = response.trails[i].imgMedium;
        var img = $("<div class='card-img'>").css("background-image", "url('" + src + "')");
        var viewTrailBtn = ("<button>View Trail</button>");

        // merge and add to page
        cardBody.append(title, trailLength, stars, condition, hikeBtn);
        card.append(img, cardBody);
        $("#trailList").append(card);
    }


    //weather call data
    function calllWeather() {
        $.ajax({
            url: weatherURL,
            method: "GET",
        }).then(function (data) {
            //create html content for current weather
            var title = $("<h3>").addClass("card-title").text(data.name + " (" + new Date().toLocaleDateString() + ")");
            var card = $("<div>").addClass("card");
            var wind = $("<p>").addClass("card-text").text("Wind Speed: " + data.wind.speed + " MPH");
            var humid = $("<p>").addClass("card-text").text("Humidity: " + data.main.humidity + "%");
            var temp = $("<p>").addClass("card-text").text("Temperature: " + data.main.temp + " °F");
            var cardBody = $("<div>").addClass("card-body");
            var img = $("<img>").attr("src", "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png");

            //merge and add to page
            title.append(img);
            cardBody.append(title, temp, humid, wind);
            card.append(cardBody);
            $("#currentWeather").append(card);
        });
    }

    //gets googlemaps lat and long from hike location
    function gmapslatlong() {
        var gmapslat = response.trails[i].latitude;
        var gmapslong = response.trails[i].longitude;
        
    };

    $('.avgRating .fa-star').on('click', function () {
    //remove class of checked
    $('.avgRating .fa-star').removeClass('checked');
    //add class of checked to item and previous sibling items 
    $(this).addClass('checked');
    $(this).prevAll().addClass('checked');
    //get count value from index
    hike.minStars = parseInt($(this).attr('value'));
});

$(".geo-locate").on("click", function (event) {
    event.preventDefault();
    getLocation()
});

$(".submit").on("click", function (event) {
    event.preventDefault();
    choices();
    hikingTrails();
});

//click function on trail card
$(".stretched-link").on("click", function () {
    calllWeather();
    gmapslatlong();
});

    

});
