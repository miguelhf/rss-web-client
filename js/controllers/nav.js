'use strict';

angular.module('rss-client')
.controller('navCtrl', function($scope, items, feed_storage){
	$scope.add_feed		= function(){
		feed_storage.add_feed($scope.url);
		$scope.url = "";
	}

});