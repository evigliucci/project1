

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

//set lat & long by pulling from document and setting our API key with queryurl 
var lat = localStorage.getItem("lat");
var long = localStorage.getItem("long");
var APIKey = "2aefe10b8806f4469247d8807ad2c892";
var queryURL = "http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + long + "&APPID=" + APIKey;

//weather call data
$.ajax({
    url: queryURL,
    method: "GET",
}).then(function (response) {


    console.log(queryURL);
    console.log(response);

    var city = response.name;
    console.log(city);


});
$(document).ready(function() {
// Hiking API
var APIKey = "200712211-0e0047c0b205b2d2705a464dd36eccec";
var queryURL = "https://www.hikingproject.com/data/get-trails?lat=" + lat + "&lon=" + long + "&maxDistance=10&key=" + APIKey;

console.log(queryURL);


  function hike(){
  $.ajax({
      url: queryURL,
      method: "GET",
      dataType: "JSON",
    }).then(function(response) {
      console.log(response);
    });
  };

  hike();


})
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