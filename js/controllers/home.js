'use strict';

angular.module('rss-client')
.controller('homeCtrl', function($scope){
	// modify this so the message changes depending on whether it is user's first access
	$scope.welcomeMessage = (JSON.parse(localStorage.getItem('feeds'))) ?
		"Welcome back!" :
		"Welcome to the RSS-Client Reader!\nPlease feel at home to explore the app.";
});