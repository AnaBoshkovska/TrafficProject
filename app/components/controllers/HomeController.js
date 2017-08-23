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
	$scope.getTrafficLayer = function(){
		trafficLayerService.getTrafficLayer("map");
	}
	$scope.getCanvas = function(){
		html2CanvasService.html2canvas("map").then(function (response) {
			console.log(response);
			skopjePulseService.getSensors();
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
		}, function (error){
			console.log(error);
		});

	}
	$scope.scrollToDiv = function(){
		$('html, body').animate({
			scrollTop: $('#showMap').offset().top - 20
		}, 'fast');
	}
}]);