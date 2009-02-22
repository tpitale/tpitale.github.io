$(document).ready(function(){
  display_flickr($("div.flickr_badge_image", "#photos"), 0);
});

function display_flickr(divs, at) {
  if(at >= $(divs).length) return;
  
  $($(divs).get(at)).fadeIn(250, function() {
    display_flickr(divs, at++);
  });
}
