$(document).ready(function() {
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
        var openWeatherURL = "http://api.openweathermap.org/data/2.5/weather?lat=" + locationLat + "&lon=" + locationLong + "&appid=" + cityAPIKey;

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
        geocoder.geocode({'address': address}, function(results, status) {
            if (status === 'OK') {  
                localStorage.setItem("searchLat", results[0].geometry.location.lat());
                localStorage.setItem("searchLong", results[0].geometry.location.lng());
            };            
        });
        setTimeout(function(){ choices(); }, 3000);
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
        }).then(function(response) {
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
        var hikeBtn = $("<button class='btn btn-primary stretched-link'>View Trail</button>");
        var trailId = $("<p class=" + response.trails[i].id + ">");
        //console.log(trailId)
        var src = response.trails[i].imgMedium;
        var img = $("<div class='card-img'>").css("background-image", "url('" + src + "')");

        // merge and add to page
        cardBody.append(title, trailLength, stars, condition, hikeBtn, trailId);
        card.append(img, cardBody);
        $("#trailList").append(card);
    }
    
    
    //weather call data
    function callWeather() {
        var weatherAPIKey = "bdc52f64afd883566cab72d748eec127";
        var forecastURL = "http://api.openweathermap.org/data/2.5/weather?lat=" + traillat + "&lon=" + traillong + "&APPID=" + weatherAPIKey;
        var traillat = "";
        var traillong = "";
        $.ajax({
            url: forecastURL,
            method: "GET",
            dataType: "JSON",
        }).then(function(data) {
            //console.log(forecastURL);
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

    function getSingleTrail(currentId) {
        var trailIdURL = 'https://www.hikingproject.com/data/get-trails-by-id?ids=' + currentId + '&key=' + hike.apiKey;

        $.ajax({
            url: trailIdURL,
            method: "GET",
            dataType: "JSON",
        }).then(function(trailResponse) {
            //Build UI content
            $('#selectedTrail').append(JSON.stringify(trailResponse));

            var trailCard = $("<div class='card'>");
            var trailCardBody = $("<div class='card-body'>");
            var trailTitle = $("<h3 class='card-title'>").text(trailResponse.trails.name);
            var trailSummary = $("<p class='card-text'>").text(trailResponse.trails.summary);
            var singleTrailLength = $("<p class='card-text'>").text("Trail Length: " + trailResponse.trails.length + " miles");
            var trailCondition = $("<p class='card-text'>").text("Trail condition: " + trailResponse.trails.conditionStatus);
            var trailDifficulty = $("<p class='card-text'>").text("Trail Difficulty: " + trailResponse.trails.difficulty);

            var trailSrc = trailResponse.trails.imgMedium;
            var trailImg = $("<div class='card-img'>").css("background-image", "url('" + trailSrc + "')");

            // merge and add to page
            trailCardBody.append(trailTitle, singleTrailLength, trailCondition, trailSummary, trailDifficulty);
            trailCard.append(trailImg, trailCardBody);
            $("#selectedTrail").append(trailCard);
        });
    }
    //gets googlemaps lat and long from hike location
    // function gmapslatlong() {
    //     var gmapslat = response.trails[i].latitude;
    //     var gmapslong = response.trails[i].longitude;

    // };

    $('.avgRating .fa-star').on('click', function() {
        //remove class of checked
        $('.avgRating .fa-star').removeClass('checked');
        //add class of checked to item and previous sibling items 
        $(this).addClass('checked');
        $(this).prevAll().addClass('checked');
        //get count value from index
        hike.minStars = parseInt($(this).attr('value'));
    });
    //Geo-locate button
    $(".geo-locate").on("click", function(event) {
        event.preventDefault();
        getLocation();
        setTimeout(function(){showCity(); }, 3000);
    });

    //
    $(".submit").on("click", function(event) {
        event.preventDefault();
        geocodeAddress();
        
    });

    //click function on trail card
    $(document).on("click", '.stretched-link', function(event) {
        event.preventDefault(event);
        var currentId = $(this).next().attr('class');
        getSingleTrail(currentId);
        //callWeather();
        //gmapslatlong();
    });
});