'use strict';

angular.module('rss-client', ['ngRoute', 'ngSanitize'])

.config(function($routeProvider){
	$routeProvider
		.when('/',{
			templateUrl: 'views/home.html',
			controller: 'homeCtrl',
		})
		.when('/list/:id',{
			templateUrl: 'views/list.html',
			controller: 'listCtrl',
		})
/*		.when('/read',{
			templateUrl: 'views/list.html',
			controller: 'listCtrl',
		})
		.when('/unread',{
			templateUrl: 'views/list.html',
			controller: 'listCtrl',
		})
		.when('/faved',{
			templateUrl: 'views/list.html',
			controller: 'listCtrl',
		})
*/		.when('/selected/:index',{
			templateUrl: 'views/selected.html',
			controller: 'selectedCtrl',
		})
		.otherwise({
        	redirectTo: '/'
      	});
});
