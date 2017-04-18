'use strict';

angular.module('rss-client')
.controller('listCtrl', function($scope, items, feed_storage, $routeParams, $location){
	items.filter($routeParams.id);
	$scope.list 		= items.filtered;
	$scope.select_item	= function(index) {
		items.select(index);
		$location.path('/selected/'+index);
	}
	$scope.refresh		= function(){
		var urls = JSON.parse(localStorage.getItem('urls'));
		feed_storage.fetch_urls(urls)
		.then(function() {
			items.load();
			items.filter($routeParams.id);
			$scope.list = items.filtered;
		});
	}
});