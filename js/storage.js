angular.module('rss-client')
.factory('feed_storage', function($http, $q){
	function feed_element() {
		this.title			= "";
		this.url			= "";
		this.description	= "";
		this.entries		= [];
	}

	function storable_item() {
		this.id			= "";
		this.title		= "";
		this.date		= "";
		this.author		= "";
		this.summary	= "";
		this.read		= false;
		this.faved		= false;
	}

	var feed_storage = {
		load: function() {
			var json = JSON.parse(localStorage.getItem('feeds'));
//			console.log("inside fetch_all, returning:" + json);
			return json;
		},

		fetch_item: function(url, success, error) {
			console.log("feed_storage.fetch_item -- entering");
			$http.get(url).then(success, error);
		},

		handle_response: function(data){
			console.log("feed_storage.handle_response -- entering");
			var feed = feed_storage.parse_xml(data);
			var deferred = $q.defer();
			feed_storage.update_feed(feed);
			deferred.resolve("nada");

			return deferred.promise;
		},

		bring_urls: function(url_collection, promise) {
			console.log("feed_storage.fetch_urls -- entering");
			var url = url_collection.pop();
			if (url_collection[0]) {
				console.log("feed_storage.fetch_urls -- entering with url="+url);
				$http.get(url)
					.then(function(response){feed_storage.handle_response(response.data);})
					.then(function(){feed_storage.bring_urls(url_collection, promise);});
			} else {
				console.log("feed_storage.fetch_urls -- entering for the last time with url="+url);
				return $http.get(url)
					.then(function(response){feed_storage.handle_response(response.data);})
					.then(function(){promise.resolve("");});
			}

		},

		fetch_urls: function(url_collection) {
			var deferred = $q.defer();
			feed_storage.bring_urls(url_collection, deferred);
			return deferred.promise;
		},


		parse_xml: function(xml) {
			function clean(string){
				return string.substring(string.indexOf("[CDATA[")+7, string.indexOf("]]"));
			}

			console.log("feed_storage.parse_xml -- entering");// with xml="+xml);
			var rss_xml = jQuery.parseXML(xml),
			$rss_xml = $( rss_xml );
			var feed_elem = new feed_element();
			feed_elem.title			= clean($rss_xml.find("title").html());
			console.log("feed_storage.parse_xml -- feed_elem.title="+feed_elem.title);
			feed_elem.url			= clean($rss_xml.find("link").html());
			console.log("feed_storage.parse_xml -- feed_elem.url="+feed_elem.url);
			feed_elem.description	= clean($rss_xml.find("description").html());
			console.log("feed_storage.parse_xml -- feed_elem.description="+feed_elem.description);

			$rss_xml.find("item").each(function(){
				console.log("feed_storage.parse_xml -- into the loop");
				var xml_item	= $(this);

				var item 		= new storable_item();
				item.id			= clean(xml_item.find("guid").html());
				console.log("feed_storage.parse_xml -- item.id="+item.id);
				item.title		= clean(xml_item.find("title").html());
				console.log("feed_storage.parse_xml -- item.title="+item.title);
				item.date		= new Date(clean(xml_item.find("pubDate").html()));
				console.log("feed_storage.parse_xml -- item.date="+item.date);
				if (xml_item.find("author").html())
					item.author		= clean(xml_item.find("author").html());
				else item.author = "autor desconocido";
				console.log("feed_storage.parse_xml -- item.author="+item.author);
				item.summary	= clean(xml_item.find("description").html());
				console.log("feed_storage.parse_xml -- item.summary="+item.summary.substring(0, 100	));

				feed_elem.entries.push(item);
			});
			return feed_elem;

		},

		update_feed: function(feed_elem) {
			console.log("feed_storage.update_feed -- entering with feed_elem.url="+feed_elem.url);
			//console.log("feed_storage.update_feed -- localStorage.getItem('feeds')="+localStorage.getItem('feeds'));
			var feeds = JSON.parse(localStorage.getItem('feeds'));
			var feed_found = false, i=0, feed;

			if (!feeds) feeds = [];
			if (!feeds[0]) feeds.push(feed_elem);
			else {
				console.log("feed_storage.update_feed -- feeds.length != 0");
				while ((!feed_found) && (i<feeds.length)) {
					feed		= feeds[i];
					feed_found	= (feed.url == feed_elem.url);
					i++;
				}
				console.log("feed_storage.update_feed -- feeds[0].url="+feeds[0].url);
				console.log("feed_storage.update_feed -- feed_found="+feed_found);

				if (!feed_found) {
					feeds.push(feed_elem);
					console.log("feed_storage.update_feed -- pushing feed="+feed_elem.url);
				} else {
					for (var j=0, entry_found, entry; entry = feed_elem.entries[j]; j++) {
						entry_found = false;
						for (var k=0, stored_entry; stored_entry = feed.entries[k]; k++) {
							entry_found = (stored_entry.id == entry.id);
							if (entry_found) {
								console.log("feed_storage.update_feed -- into the loops with"+
									" entry.read="+entry.read+
									" stored_entry.read="+stored_entry.read+
									" entry.faved="+entry.faved+
									" stored_entry.faved="+stored_entry.faved);
								entry.read		= stored_entry.read;
								entry.faved		= stored_entry.faved;
								stored_entry	= entry;
								break;
							}
						}
						if (!entry_found) feed.entries.push(entry);
					}
				}
			}	
			localStorage.setItem('feeds', JSON.stringify(feeds));
		},

		update_entry: function(item) {
			var feeds = JSON.parse(localStorage.getItem('feeds'));
			var feed_found = false, i=0, feed;

			while ((!feed_found) && (i<feeds.length)) {
				feed		= feeds[i];
				feed_found	= (feed.url == item.fURL);
				i++;
			}
			console.log("feed_storage.update_entry -- feeds[0].url="+feeds[0].url);
			console.log("feed_storage.update_entry -- feed_found="+feed_found);

			var entry_found = false;
			for (var j=0, entry; entry = feed.entries[j]; j++) {
				entry_found = (item.id == entry.id);
				if (entry_found) {
					console.log("feed_storage.update_entry -- into the loops with"+
						" entry.read="+entry.read+
						" item.read="+item.read+
						" entry.faved="+entry.faved+
						" item.faved="+item.faved);
					entry.read		= item.read;
					entry.faved		= item.faved;
					break;
				}
			}

			localStorage.setItem('feeds', JSON.stringify(feeds));
		},

		add_feed: function(url) {
			var urls = JSON.parse(localStorage.getItem('urls'));
			if (!urls) urls = [];
			urls.push(url);
			localStorage.setItem('urls', JSON.stringify(urls));
		}





/*			for (var i=0, feed, feed_found=false; feed=feeds[i]; i++) {
				console.log("feed_storage.update_feed -- into the loop with feed_elem.url="+feed_elem.url+" and feed.url="+feed.url);
				if (feed.url == feed_elem.url) {
					console.log("feed_storage.update_feed -- into the loop with feed_elem.url="+feed_elem.url);
					angular.forEach(feed_elem.entries, function(entry){
						console.log("feed_storage.update_feed -- into angular.for.if.forEach with entry.title="+entry.title+" and entry.id="+entry.id);
						angular.forEach(feed.entries, function(stored_entry) {
							if (entry.id == stored_entry.id) {
								console.log("feed_storage.update_feed -- into for.if.forEach.if with"+
								" entry.read="+entry.read+
								" feed.entries[id].read="+feed.entries[id].read+
								" entry.faved="+entry.faved+
								" feed.entries[id].faved="+feed.entries[id].faved);
								entry.read		= stored_entry.read;
								entry.faved		= stored_entry.faved;
								stored_entry	= entry;
							}
						});
						
					});
					feed_found = true;
				}
			}
			console.log("feed_storage.update_feed -- out of the loop with found="+found);
			if (!feed_found) feeds.push(feed_elem);
			localStorage.setItem('feeds', JSON.stringify(feeds));
			console.log("feed_storage.update_feed -- exiting with localStorage.getItem('feeds')="+localStorage.getItem('feeds').substring(0, 300));
		}*/
	}
	return feed_storage;
});