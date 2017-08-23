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
.controller('HomeController', ['$scope', 'trafficLayerService', 'html2CanvasService', 'skopjePulseService', function($scope, trafficLayerService, html2CanvasService, skopjePulseService) {
	$scope.getTrafficLayer = function(){
		trafficLayerService.getTrafficLayer("map");
	}
	$scope.getCanvas = function(){
		html2CanvasService.html2canvas("map");
		skopjePulseService.getSensors();
	}
}]);