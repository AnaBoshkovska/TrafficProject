/**
 * Created by Ljubica on 22.8.2017.
 */
angular.module('trafficApp').factory('skopjePulseService', ['$http', function ($http) {
    var data = {};


    data.getSensors = function(){
        $http({
            method: 'GET',
            url: 'https://skopjepulse.mk/rest/sensor'
        }).then(function successCallback(response) {
            data.sensors = response.data;
            data.sensors.forEach(function(sensor){
                if(sensor.position !== null && sensor.position != undefined){
                    pos = sensor.position.split(',');
                    var latp = pos[0];
                    var lngp = pos[1];
                    latp = Math.round( latp * 10 ) / 10;
                    lngp = Math.round( lngp * 10 ) / 10;
                    if(latp === 42 && lngp === 21.4)
                        data.sensorId = sensor.sensorId;
                }
            });
            data.getData(data.sensorId);
        }, function errorCallback(response) {
            console.log(response);
        });
    };
    data.getData = function(sensorId){
        var now = new Date();
        now.setHours(now.getHours() - 1);
        $http({
            method: 'GET',
            url: 'https://skopjepulse.mk/rest/dataRaw?sensorId='+ sensorId + '&from=' + now.toISOString() + '&to=' + new Date().toISOString()
        }).then(function successCallback(response) {
            data.aq = airQuality(response.data);
            console.log(data.aq);
        }, function errorCallback(response) {
            console.log(response);
        });

    };
    function airQuality(data) {
        var aq = {};
        data.forEach(function(record){
            if(aq[record.type] === undefined){
                aq[record.type] = {};
                aq[record.type].value = 0;
                aq[record.type].count = 0;
            }
            aq[record.type].value += parseInt(record.value);
            aq[record.type].count ++;
        });
        for(key in aq){
            aq[key].avg = aq[key].value / aq[key].count;
        }
        return aq;
    }


    return data;
}]);