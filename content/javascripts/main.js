;(function($) {
  $.fn.gistify = function() {
    return this.each(function() {
      this.innerHTML = 'Loading Gist '+this.id;
      $.getJSON("http://gist.github.com/"+ this.id +".json?callback=?", function (gist) {
        $('#'+gist.repo).replaceWith(gist.div);
      });
    });
  }
})(jQuery);

$(document).ready(function(){
  fill_in_gists();
  display_flickr($("div.flickr_badge_image", "#photos"), 0);
});

function display_flickr(divs, at) {
  if(at >= $(divs).length) return;
  
  $($(divs).get(at)).fadeIn(250, function() {
    display_flickr(divs, at++);
  });
}

function fill_in_gists() {
  $('div.gist').gistify();
  $("head").append('<link rel="stylesheet" href="http://gist.github.com/stylesheets/gist/embed.css"/>');
}
