/*
  *  Google Feeds API
  *  Blog Feeds, using jQuery Library 
*/ 

(function($){
	
	'use strict';
	
	//make sure the Google AJAX API script is loaded
	if (!window.google)  {
   		//alert('You must include the Google AJAX Feed API script');
    	return;
	}   
	
	//Load the Google Feed API if not already loaded 
	if (!google.feeds) google.load("feeds", "1");

	$.fn.blogFeed = function(options){
		
		// Create some defaults, extending them with any options that were provided
		var settings = $.extend( {
			'maxWords'		: 55,
			'feedPath'		: 'blog',
			'feedQuantity'	: 3,
			'feedImage'		: 0
		},options);
		
		var imgBox = "";
		
		function getImage(entryContent){
			//Check for image 
			//this is based on UVM blog rss, where images are included in entry.content (Not in MediaGroup)
			if($("img", entryContent).attr("src")){
				imgBox = '<img src="'
				+ $("img", entryContent).attr("src") 
				+ '" style="max-width: 40%;" class="imageleft" />';	
			}else{
				imgBox = "";
			}
		}
		
		function trimWords(theString, maxWords) {
			
			if (theString.match(/\[...\]$/))
			{
				//If a Feed Excerpt ( ends with [...]) leave as-is
				return theString;		
			}
			else {
				// Display the content without the HTML tags, and limit to 55 words
				return $(theString).text().split(/\s+/,maxWords).join(" ") + ' [...]';
			}
		}
		
		return this.each(function() {
			var $this = $(this);	
				
			function initialize() {
					// Create a feed instance that will grab the feed
					var feed = new google.feeds.Feed(settings.feedPath);
					
					// Set the number of feed entries
					feed.setNumEntries(settings.feedQuantity);
				   
					// Calling load sends the request off (It requires a callback function)
					feed.load(function(result) {
				 		
						var outputHtml = "";
						
						if (!result.error) {
							var container = ""; 
						   	for (var i = 0; i < result.feed.entries.length; i++) {  
								var entry = result.feed.entries[i];  
								var d = new Date(entry.publishedDate); //e.g. Wed Nov 28 2012 12:14:25 GMT-0500 (Eastern Standard Time)
				
								var pubDate = "";
								if (!isNaN(d.getMonth())){
									pubDate = (d.getMonth()+1) + '-' + d.getDate() + '-' + d.getFullYear();// Format as: MM-DD-YYYY (e.g. 11-28-2012)
								} 
								else {
									return false;
								}
								
								if(settings.feedImage === 1){
									getImage(entry.content);
								}
									
								outputHtml += '<article class="clearfix">'
											+ '<h4><a href="' + entry.link + '" target="_blank" >' +  entry.title + '</a></h4>' 
											+  imgBox
											+ '<p><span class="feed-date" style="color: #999">' + pubDate  + '</span> ' +  trimWords(entry.content, settings.maxWords) + ' '
											+ '<a class="feed-more" href="' + entry.link + '" target="_blank" >Read more &raquo;</a></p>'  
											+ '</article>';
						}  
						} 
						else {  
							alert("Error fetching feeds!")
							outputHtml += '<p><a target="_blank" href="' + settings.feedPath + '" >Check out our blog »</a></p>';  
						}  
					  
						$this.html(outputHtml);       
		   			});
				}
		  
				//load callback function
				google.setOnLoadCallback(initialize);

		});	
	};
	
})( jQuery );