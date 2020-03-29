$(document).ready(function() {
    //set lat & long by pulling from document and setting our API key with queryurl 
    var lat = localStorage.getItem("lat");
    var long = localStorage.getItem("long");
    var weatherAPIKey = "2aefe10b8806f4469247d8807ad2c892";
    var weatherURL = "http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + long + "&APPID=" + weatherAPIKey;

    var maxDistance = "";
    var minLength = "";
    var minStars = "";
    var hikeAPIKey = "200712211-0e0047c0b205b2d2705a464dd36eccec";
    var hikeURL = "https://www.hikingproject.com/data/get-trails?lat=" + lat + "&lon=" + long + "&minLength=" + minLength + "&maxDistance=" + maxDistance + "&minStars=" + minStars + "&key=" + hikeAPIKey;

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
        maxDistance = $("#radius").find("option:selected").val();
        minLength = $("minTrailLength").find("option:selected").val();
    };

    // Hiking API
    function hike() {
        $.ajax({
            url: hikeURL,
            method: "GET",
            dataType: "JSON",
        }).then(function(response) {
            var i = 0;

            for (trail in response.trails) {
                i++;
                createTrailList(response, i);
            }
        });
    };

    function createTrailList(response, i) {
        // create html content for current weather
        var card = $("<div class='card'>");
        var cardBody = $("<div class='card-body'>");
        var title = $("<h3 class='card-title'>").text(response.trails[i].name);
        var summary = $("<p class='card-text'>").text(response.trails[i].summary);
        var stars = $("<p class='card-text'>").text("Stars: " + response.trails[i].stars);
        var trailLength = $("<p class='card-text'>").text("Trail Length: " + response.trails[i].length + " miles");
        var condition = $("<p class='card-text'>").text("Trail condition: " + response.trails[i].conditionStatus);
        var src = response.trails[i].imgMedium;
        var img = $("<div class='card-img'>").css("background-image", "url('" + src + "')");

        // merge and add to page
        cardBody.append(title, summary, stars, trailLength, condition);
        card.append(img, cardBody);
        $("#trailList").append(card);
    }

    //weather call data
    function calllWeather() {
        $.ajax({
            url: weatherURL,
            method: "GET",
        }).then(function(response) {
            var city = response.name;
        });
    }


    $(".geo-locate").on("click", function(event) {
        event.preventDefault();
        getLocation()
    });

    $(".submit").on("click", function(event) {
        event.preventDefault();
        choices();
        hike();
    });

});