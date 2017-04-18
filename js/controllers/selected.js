'use strict';

angular.module('rss-client')
.controller('selectedCtrl', function($scope, items, $location, $routeParams){
	if (items.selected){
		items.fetch_item(items.selected.id,
			function(response){
				console.log("selectedCtrl -- success! got this: "+response.data);
				$scope.content = response.data;
			},
			function(error){
				console.log("items.refresh -- error! got this:"+JSON.stringify(error));
		});
	} else $location.path('/list/all');
	$scope.article 				= items.selected;
	$scope.toggle_state			= 'unread'; 
	$scope.toggle_fav			= function() {items.toggle_fav(items.selected);}
	$scope.toggle_read			= function() {
		items.toggle_read(items.selected);
		if ($scope.toggle_state	== 'read') $scope.toggle_state = 'unread';
		else $scope.toggle_state = 'read';
	}
	$scope.previous				= function() {items.previous(); $scope.article=items.selected;}
	$scope.next					= function() {items.next(); $scope.article=items.selected;}
});