'use strict';

// Defining Angular app model with all other dependent modules
var trafficApp = angular.module('trafficApp',['ngRoute', 'base64', 'ngMaterial', 'chart.js','angular-svg-round-progressbar',"angular-screenshot"]);

trafficApp.config(function($routeProvider, $locationProvider, $httpProvider, $base64, ChartJsProvider, $mdIconProvider) {

	// Declaration of the default route if neither of the controllers
	// is supporting the request path
	$routeProvider.otherwise({ redirectTo: '/'});

	// Settings for http communications
	$httpProvider.defaults.useXDomain = true;
	delete $httpProvider.defaults.headers.common['X-Requested-With'];
	var auth = $base64.encode("LjubicaKoceva:trafficlayer");
	$httpProvider.defaults.headers.common['Authorization'] = 'Basic ' + auth;
	ChartJsProvider.setOptions({ colors : [ '#803690', '#00ADF9', '#DCDCDC', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'] });
	$mdIconProvider.fontSet('md', 'material-icons');
	// disabling # in Angular urls
	// $locationProvider.html5Mode({
	// 		enabled: true,
	//      requireBase: false
	// });
});
