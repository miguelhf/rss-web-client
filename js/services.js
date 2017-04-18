
function item_element(entry, fTitle, fURL) {
  this.read		= false;
  this.faved	= false;
  this.selected	= false;
  this.fTitle	= fTitle;
  this.fURL		= fURL;

  angular.extend(this, entry);
}

item_element.prototype.$$hashKey = function() {
  return this.id;
}

angular.module('rss-client')
.factory('items', ['feed_storage', function(feed_storage){
	var items = {
		all:				[],
		filtered:			[],
		selected:			null,
		index:				null, 
		read_count: 		0,
		faved_count: 		0,

		select: function(index) {
			console.log("items.select -- calling with index="+index);
			if (items.selected) items.selected.selected = false;
			items.index = index;
			console.log("items.select -- calling with items.filtered[index].title="+items.filtered[index].title);
			items.selected = items.filtered[index];
			console.log("items.select -- the selected item has title "+items.selected.title);
			items.selected.selected = true;
			this.mark_as_read(items.selected);
		},

		has_previous: function() {
			return items.index > 0;
		},

		has_next: function() {
			return items.index < items.filtered.length-1;
		},

		previous: function() {
			if (items.has_previous())
				items.select(items.index-1);
		},

		next: function() {
			console.log("items.next -- items.has_next() returns "+items.has_next());
			console.log("items.next -- items.filtered["+items.index+"] = "+items.filtered[items.index]);
			console.log("items.next -- items.filtered["+items.index+1+"] = "+items.filtered[items.index+1]);
			if (items.has_next())
				items.select(items.index+1);			
		},

		mark_all_as_read: function() {
			for (var i=0, item; item=items.filtered[i]; i++) {
				this.mark_as_read(item);
				feed_storage.update_entry(item);
			}
		},

		mark_as_read: function(item) {
			if (!item.read) {
				item.read = true;
				this.read_count++;
				feed_storage.update_entry(item);
			}
		},

		toggle_read: function(item) {
			if (item.read) this.read_count--;
			else this.read_count++;
			item.read = !item.read;
			feed_storage.update_entry(item);
		},

		toggle_fav: function(item) {
//			console.log("items.toggle_fav -- enter -- item.title="+item.title+"\nand item.faved="+item.faved);
			item.faved = !item.faved;
			feed_storage.update_entry(item);
//			console.log("items.toggle_fav -- exit -- item.title="+item.title+"\nand item.faved="+item.faved);
		},

		fetch_item: function(url, success, error) {
			console.log("items.fetch_item -- entering");
			feed_storage.fetch_item(url, success, error);
		},

		load: function() {
			console.log("items.load -- entering");
			var feeds = feed_storage.load();

			items.all			= [];
			items.read_count	= 0;
			items.faved_count	= 0;

			angular.forEach(feeds, function(feed){
				angular.forEach(feed.entries, function(entry){
					var item = new item_element(entry, feed.title, feed.url);
					console.log("items.load -- into the loop with item.title="+item.title);
					items.all.push(item);
					if (item.read) items.read_count++;
					if (item.faved) items.faved_count++; 
//					console.log("item: "+item.title+"\ndate: "+item.date+"\nsummary: "+item.summary);
				});
			});

			items.all.sort(function(ent1, ent2) {return (new Date(ent2.date) - new Date(ent1.date));});

			items.filtered = items.all;
//			console.log("inside items.fetch -- returning: "+items.all[0].title);
		},

		fetch_feeds: function() {
			console.log("items.fetch_feeds -- entering");
			var urls = JSON.parse(localStorage.getItem('urls'));
			return feed_storage.fetch_urls(urls);
		},

		filter: function(param) {
			console.log("items.filter -- entering");
//			console.log("entering the filter");
			switch (param) {
				case 'all':
					items.filtered = items.all;
					console.log("items.filter -- all caption");
//					console.log("filtering by all:"+items.filtered);
					break;
				case 'faved':
					items.filtered = items.all.filter(function(item) {return item['faved'];});
//					console.log("filtering by faved -- items.filtered[0].title="+items.filtered[0].title);
					break;
				case 'read':
					items.filtered = items.all.filter(function(item) {return item['read'];});
//					console.log("filtering by read:"+items.filtered);
					break;
				case 'unread':
					items.filtered = items.all.filter(function(item) {return !item['read'];});
//					console.log("filtering by unread -- items.filtered[0].title="+items.filtered[0].title);
					break;
				default:
					items.filtered = [];
			}
//			return items.filtered;
//			console.log("exiting filter -- items.filtered[0].title="+items.filtered[0].title);
		},
	}

	items.load();

	return items;
}]);
