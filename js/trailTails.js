$(document).ready(function () {
    //geolocation function
    var x = document.getElementById("demo");
    function getLocation() {
        console.log('test');
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

    $(".geo-locate").on("click", function (event) {
        event.preventDefault();
        getLocation()
    });

    //set lat & long by pulling from document and setting our API key with queryurl 
    var lat = localStorage.getItem("lat");
    var long = localStorage.getItem("long");
    var weatherAPIKey = "2aefe10b8806f4469247d8807ad2c892";
    var weatherURL = "http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + long + "&APPID=" + weatherAPIKey;

    //weather call data
    $.ajax({
        url: weatherURL,
        method: "GET",
    }).then(function (response) {


        console.log(weatherURL);
        console.log(response);

        var city = response.name;
        console.log(city);
    });

    // var googleAPIKey = "AIzaSyDgnPiMdXHt3aXEFx3G186VqL346N7uXoU";
    // var googleURL = "https://maps.googleapis.com/maps/api/js?key=" + googleAPIKey + "&callback=initMap";
    
    // $.ajax({
    //     url: googleURL,
    //     method: "GET",
    // }).then(function (response) {
    //     function geocodeAddress(geocoder) {
    //         var address = $('.location').val();
    //         console.log(address)
    //         geocoder.geocode({ 'address': address }, function (results) {
    //             console.log(results);
    //         });
    //     };


    // });

    
    // function geocodeAddress(geocoder) {
    //     var address = $('.location').val();
    //     console.log(address)
    //     geocoder.geocode({ 'address': address }, function (results) {
    //         console.log(results);
    //     });
    // };

    function choices() {
        maxDistance = $("#radius").find("option:selected").val();
        minLength = $("minTrailLength").find("option:selected").val();
        //var minStars = 
        console.log(maxDistance);
        //geocodeAddress(geocoder);
    };

    // Hiking API

    var maxDistance = " ";
    var minLength = " ";
    var minStars = " ";
    var hikeAPIKey = "200712211-0e0047c0b205b2d2705a464dd36eccec";
    var hikeURL = "https://www.hikingproject.com/data/get-trails?lat=" + lat + "&lon=" + long + "&minLength=" + minLength + "&maxDistance=" + maxDistance + "&minStars=" + minStars + "&key=" + hikeAPIKey;
    console.log(hikeURL);

    function hike() {
        $.ajax({
            url: hikeURL,
            method: "GET",
            dataType: "JSON",
        }).then(function (response) {
            var i= 0; 
            console.log(response.trails.length);

            for(trail in response.trails) {
                i++;
                                //Img 
                //imgSqSmall, imgSmall, imgSmallMed,imgMedium.
                function createTrailList() {
                    // create html content for current weather
                    var card = $("<div class='card'>");
                    var cardBody = $("<div class='card-body'>");
                    var title = $("<h3 class='card-title'>").text(response.trails[i].name);
                    var summary = $("<p class='card-text'>").text(response.trails[i].summary);
                    var stars = $("<p class='card-text'>").text("Stars: " + response.trails[i].stars);
                    var trailLength = $("<p class='card-text'>").text("Trail Length: " + response.trails[i].length + " miles");
                    var condition = $("<p class='card-text'>").text("Trail condition: " + response.trails[i].conditionStatus);
                    var src = response.trails[i].imgMedium;
                    var img = $("<img>").attr("src", src);
                    // merge and add to page
                    title.append(img);
                    cardBody.append(title, summary, stars, trailLength, condition);
                    card.append(cardBody);
                    $("#trailList").append(card);
                }
                createTrailList();



            }
        });
    };

    $(".submit").on("click", function (event) {
        event.preventDefault();
        choices();
        hike();

    })
});
//googlemaps location getter
// var map;
// function initMap() {
// var mapCenter = new google.maps.LatLng(47.6145, -122.3418); //Google map Coordinates
// map = new google.maps.Map($("#map")[0], {
// 		center: mapCenter,
// 		zoom: 8
// 	  });
// }

// $("#find_btn").click(function (){
// 	if ("geolocation" in navigator){
// 			navigator.geolocation.getCurrentPosition(function(position){ 
// 					infoWindow = new google.maps.InfoWindow({map: map});
// 					var pos = {lat: position.coords.latitude, lng: position.coords.longitude};
// 					infoWindow.setPosition(pos);
// 					infoWindow.setContent("Found your location <br />Lat : "+position.coords.latitude+" </br>Lang :"+ position.coords.longitude);
// 					map.panTo(pos);
// 				});
// 		}else{
// 			console.log("Browser doesn't support geolocation!");
// 	}
// });