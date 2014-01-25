;(function($) {
	$.fn.gistify = function() {
		return this.each(function() {
			var $link = $(this);
			var href = $(this).attr('href');

			var gist_id = /https?:\/\/gist\.github\.com\/?[a-z]*\/(\d+)/.exec(href);

			if (gist_id) {
				$link.before('<div id="embedded-gist-'+gist_id[1]+'">');
				$.getJSON(href+'.json?callback=?', function(data) {
					var stylesheet_needed = true;
					$('head link[rel=stylesheet]').each(function() {
						if (this.href == data.stylesheet) { stylesheet_needed = false; }
					})
					
					if (stylesheet_needed) {$('head').append('<link rel="stylesheet" href="' + data.stylesheet + '" />');}
					$('div#embedded-gist-'+gist_id[1]).replaceWith(data.div);
				});
			}
		});
	}
})(jQuery);

// ;(function($) {
// 	$.fn.flickr_in_sequence = function() {
// 		var i = 0;
// 		return this.each(function() {
// 			i++;
// 			var badge = this;
// 			var display_flickr = function(){$(badge).fadeIn(250);};
// 			setTimeout(display_flickr, 500*i);			
// 		});
// 	}
// })(jQuery);

var photo_scroller = function(){
		if ($('div.flickr_badge_image').length == 0) return;

		var interval = window.setInterval(function(){
				$('div.flickr_badge_image:first').animate({
					'margin-left': '-75px'
				}, 500, function(){
					$('.photos .photos-container').append(this);
					$(this).css("margin-left", 0);
				});
		}, 2000);
}

var project_scroller = function(){
		if ($('.projects a').length == 0) return;
		
		var interval = window.setInterval(function(){
				$('.projects a:first').animate({
						'margin-left': '-320px'
				}, 500, function(){
						$('.projects .projects-container').append(this);
						$(this).css("margin-left", 0);
				});
		}, 5000);
}

$(document).ready(function(){
	$('a.gist-link').gistify();
	// photo_scroller();
	// project_scroller();
});
