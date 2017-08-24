// HomeController.js
// For distribution, all controllers
// are concatanated into single app.js file
// by using Gulp

'use strict';

angular.module('trafficApp')

// Routing configuration for this module
.config(['$routeProvider',function($routeprovider){
	$routeprovider.when('/', {
		controller: 'HomeController',
		templateUrl: 'components/views/homeView.html'
	});
}])
// Controller definition for this module
.controller('HomeController', ['$scope', 'trafficLayerService', 'html2CanvasService', 'skopjePulseService', 'rgbQuantService', function($scope, trafficLayerService, html2CanvasService, skopjePulseService, rgbQuantService) {
	$scope.showData = false;
	$scope.showProgress = false;
	$scope.getTrafficLayer = function(){
		trafficLayerService.getTrafficLayer("map");
	}
	$scope.getCanvas = function(){
		$scope.showProgress = true;
		html2CanvasService.html2canvas("map").then(function (response) {
			console.log(response);
			var pix = rgbQuantService.pixels;
			var labels = [];
			var data = [];
			for(var key in pix){
				labels.push(key);
				data.push(pix[key]);
			}
			$scope.labels = ['Traffic delays', 'No traffic delays', 'Medium amount of traffic', 'Long traffic delays'];
			$scope.data = data;
			$scope.colors = ['#FF0000', '#00FF00', '#FFA500', '#9F1414']
			$scope.showData = true;
			$('html, body').animate({
				scrollTop: $('#showData').offset().top - 20
			}, 'fast');
			$scope.showProgress = false;
		}, function (error){
			console.log(error);
		});
		skopjePulseService.getSensors().then(function(data){
			skopjePulseService.getData(data).then(function(airData){
				console.log(airData);
				var humidity = airData["humidity"].avg;
				var pm10 = airData["pm10"].avg;
				var pm25 = airData["pm25"].avg;
				var temperature = airData["temperature"].avg;

				var pm10Color;
				if(pm10<26)
					pm10Color = "#00ff00";
				if(pm10>25 && pm10<51)
					pm10Color = "#99cc00";
				if(pm10>50 && pm10<91)
					pm10Color = "#fcd827";
				if(pm10>90 && pm10<181)
					pm10Color = "#efa003";
				if(pm10>180)
					pm10Color = "#f44336";

				var pm25Color;
				if(pm25<16)
					pm25Color = '#00FF00';
				if(pm25>15 && pm25<31)
					pm25Color = '#99CC00';
				if(pm25>30 && pm25<56)
					pm25Color = '#FCD827';
				if(pm25>55 && pm25<111)
					pm25Color = '#EFA003';
				if(pm25>110)
					pm25Color = '#F44336';

				var tempColor;
				if(temperature<16)
					tempColor = '#00FF00';
				if(temperature>15 && temperature<26)
					tempColor = '#99CC00';
				if(temperature>25 && temperature<31)
					tempColor = '#FCD827';
				if(temperature>30 && temperature<41)
					tempColor = '#EFA003';
				if(temperature>40)
					tempColor = '#F44336';

				$scope.pm10 = Math.round( pm10 * 10 ) / 10;
				$scope.pm25 = Math.round( pm25 * 10 ) / 10;;
				$scope.pm10Color = pm10Color;
				$scope.pm25Color = pm25Color;
				$scope.temp = Math.round( temperature * 10 ) / 10;
				$scope.tempColor = tempColor;
			}, function (error) {
				console.log(error);
			});
		}, function(error){
			console.log(error);
		});


	}
	$scope.scrollToDiv = function(){
		$('html, body').animate({
			scrollTop: $('#showMap').offset().top - 20
		}, 'fast');
	}
}]);