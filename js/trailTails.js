$(document).ready(function () {
    //set lat & long by pulling from document and setting our API key with queryurl 
    //need to update lat and long to trailhead location
    var locationLat = "";
    var locationLong = "";
    var searchLat = "";
    var searchLong = "";

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
        localStorage.setItem("locationLat", position.coords.latitude);
        localStorage.setItem("locationLong", position.coords.longitude);

    };

    //Displays city in input field
    function showCity() {
        locationLat = localStorage.getItem("locationLat");
        locationLong = localStorage.getItem("locationLong");
        var cityAPIKey = "bdc52f64afd883566cab72d748eec127";
        var openWeatherURL = "https://api.openweathermap.org/data/2.5/weather?lat=" + locationLat + "&lon=" + locationLong + "&appid=" + cityAPIKey;

        $.ajax({
            url: openWeatherURL,
            method: "GET",
        }).then(function (response) {
            var city = response.name;
            $(".location").val(city);
        });
    };
    //set lat & long by pulling from document and setting our API key with queryurl 


    function geocodeAddress() {
        var geocoder = new google.maps.Geocoder();
        var address = $('.location').val();
        geocoder.geocode({ 'address': address }, function (results, status) {
            if (status === 'OK') {
                localStorage.setItem("searchLat", results[0].geometry.location.lat());
                localStorage.setItem("searchLong", results[0].geometry.location.lng());
            };
        });
        setTimeout(function () { choices(); }, 0);
        //if code doesn't work you can set timeout to 0 (if you have that fast internet)
    };

    function choices() {
        hike.maxDistance = parseInt($("#radius").find("option:selected").val());
        hike.minLength = parseInt($("#minTrailLength").find("option:selected").val());
        hikingTrails();

    };

    // Hiking API
    function hikingTrails() {
        searchLat = localStorage.getItem("searchLat");
        searchLong = localStorage.getItem("searchLong");
        console.log("searchLat", searchLat);
        console.log("searchLat", searchLong);

        var hikeURL = "https://www.hikingproject.com/data/get-trails?lat=" + searchLat + "&lon=" + searchLong + "&minLength=" + hike.minLength + "&maxDistance=" + hike.maxDistance + "&minStars=" + hike.minStars + "&key=" + hike.apiKey;

        $.ajax({
            url: hikeURL,
            method: "GET",
            dataType: "JSON",
        }).then(function (response) {
            var i = 0;

            $("#trailList").empty();
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
        var hikeBtn = $("<button class='btn btn-primary stretched-link'>View Trail</button>");
        var trailId = $("<p class=" + response.trails[i].id + ">");
        //console.log(trailId)
        var src = response.trails[i].imgMedium;
        var img = $("<div class='card-img'>").css("background-image", "url('" + src + "')");

        // merge and add to page
        cardBody.append(title, trailLength, stars, condition, hikeBtn, trailId);
        card.append(img, cardBody);
        $("#trailList").append(card);
        $('html, body').animate({
            scrollTop: ($('#trailList').offset().top)
        }, 500);
    }


    //create single trail card
    function getSingleTrail(currentId) {
        
        var trailIdURL = 'https://www.hikingproject.com/data/get-trails-by-id?ids=' + currentId + '&key=' + hike.apiKey;

        $.ajax({
            url: trailIdURL,
            method: "GET",
            dataType: "JSON",
        }).then(function (trailResponse) {
            $("#selectedTrail").empty().show();
            console.log(trailResponse);
            //Build UI content
            var trailCard = $("<div class='card'>");
            var trailCardBody = $("<div class='card-body'>");
            var trailTitle = $("<h3 class='card-title'>").text(trailResponse.trails[0].name);
            var trailSummary = $("<p class='card-text'>").text(trailResponse.trails[0].summary);
            var singleTrailLength = $("<p class='card-text'>").text("Trail Length: " + trailResponse.trails[0].length + " miles");
            var trailCondition = $("<p class='card-text'>").text("Trail condition: " + trailResponse.trails[0].conditionStatus);
            //var trailDifficulty = $("<p class='card-text'>").text("Trail Difficulty: " + trailResponse.trails[0].difficulty);
            var trailDetails = $("<p class='card-text'>").text("Trail condition: " + trailResponse.trails[0].conditionDetails);
            var traillat = trailResponse.trails[0].latitude;
            var traillong = trailResponse.trails[0].longitude;
            var trailSrc = trailResponse.trails[0].imgMedium;
            var trailImg = $("<div class='card-img'>").css("background-image", "url('" + trailSrc + "')");

            // merge and add to page
            trailCardBody.append(trailTitle, singleTrailLength, trailCondition, trailSummary, trailDetails);

            trailCard.append(trailImg, trailCardBody);
            $("#selectedTrail").append(trailCard);
            $('html, body').animate({
                scrollTop: ($('#selectedTrail').offset().top)
            }, 500);
            callWeather(traillat, traillong);
            
        });
        
    }

    //weather call data
    function callWeather(traillat, traillong) {
        var weatherAPIKey = "bdc52f64afd883566cab72d748eec127";
        var forecastURL = "https://api.openweathermap.org/data/2.5/weather?lat=" + traillat + "&lon=" + traillong + "&APPID=" + weatherAPIKey;

        $.ajax({
            url: forecastURL,
            method: "GET",
            dataType: "JSON",
        }).then(function (data) {
            $("#currentWeather").empty();
            console.log(data);
            //create html content for current weather
            var title = $("<h3 class='card-title'>").text("Current Weather");
            var card = $("<div>").addClass("card");
            var description = $("<p>").addClass("card-text").text("Description: " + data.weather[0].description);
            var wind = $("<p>").addClass("card-text").text("Wind Speed: " + data.wind.speed + " MPH");
            var humid = $("<p>").addClass("card-text").text("Humidity: " + data.main.humidity + "%");
            var temp = $("<p>").addClass("card-text").text("Temperature: " + data.main.temp + " °K");
            var mintemp = $("<p>").addClass("card-text").text("Min Temperature: " + data.main.temp_min + " °K");
            var maxtemp = $("<p>").addClass("card-text").text("Max Temperature: " + data.main.temp_max + " °K");
            var cardBody = $("<div>").addClass("card-body");


            //merge and add to page
            cardBody.append(title, description, temp, mintemp, maxtemp, humid, wind);
            card.append(cardBody);
            $("#currentWeather").append(card);
        });
    }

    //gets googlemaps lat and long from hike location
    // function gmapslatlong() {
    //     var gmapslat = response.trails[i].latitude;
    //     var gmapslong = response.trails[i].longitude;

    // };

    $('.avgRating .fa-star').on('click', function () {
        //remove class of checked
        $('.avgRating .fa-star').removeClass('checked');
        //add class of checked to item and previous sibling items 
        $(this).addClass('checked');
        $(this).prevAll().addClass('checked');
        //get count value from index
        hike.minStars = parseInt($(this).attr('value'));
    });
    //Geo-locate button
    $(".geo-locate").on("click", function (event) {
        event.preventDefault();
        getLocation();
        //again you can adjust the timeout if the page isn't loading correctly
        setTimeout(function () { showCity(); }, 0);
    });

    //
    $(".submit").on("click", function (event) {
        event.preventDefault();
        geocodeAddress();
        

    });

    //click function on trail card
    $(document).on("click", '.stretched-link', function (event) {
        event.preventDefault(event);
        var currentId = $(this).next().attr('class');
        getSingleTrail(currentId);
        
    });
});