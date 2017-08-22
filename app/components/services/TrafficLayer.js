/**
 * Created by Ljubica on 22.8.2017.
 */
angular.module('trafficApp.home', []).
factory('trafficLayerService', [function() {
    var traffic = {};
    traffic.getTrafficLayer = function(){
        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 13,
            center: {lat: 34.04924594193164, lng: -118.24104309082031}
        });
        var trafficLayer = new google.maps.TrafficLayer();
        console.log(map);
        trafficLayer.setMap(map);
    };
    return traffic;
}]);