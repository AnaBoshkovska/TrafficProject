/**
 * Created by Ljubica on 22.8.2017.
 */
angular.module('trafficApp').
factory('trafficLayerService', [function() {
    var traffic = {};
    traffic.getTrafficLayer = function(selector){
        var map = new google.maps.Map(document.getElementById(selector), {
            zoom: 13,
            center: {lat: 34.04924594193164, lng: -118.24104309082031}
        });
        traffic.map = map;
        var trafficLayer = new google.maps.TrafficLayer();
        trafficLayer.setMap(map);
        traffic.setCurrentLocation(map);
    };
    traffic.setCurrentLocation = function(map){
        var lat;
        var lng;
        infoWindow = new google.maps.InfoWindow;
        // Try HTML5 geolocation.
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                var pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                lat = pos.lat;
                lng = pos.lng;
                lat = Math.round( lat * 10 ) / 10;
                lng = Math.round( lng * 10 ) / 10;
                if(lat != undefined && lng != undefined)
                {
                    traffic.lat = lat;
                    traffic.lng = lng;
                }
                map.setCenter(pos);
            }, function() {
                handleLocationError(true, infoWindow, map.getCenter());
            });
        } else {
            // Browser doesn't support Geolocation
            handleLocationError(false, infoWindow, map.getCenter());
        }
    };

    function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
            'Error: The Geolocation service failed.' :
            'Error: Your browser doesn\'t support geolocation.');
        infoWindow.open(map);
    }
    return traffic;
}]);