$(document).ready(function(){
  // $("#header").localScroll();
  display_flickr();
});

function display_flickr(obj) {
  if(obj==undefined) obj = $("div.flickr_badge_image:first")
  $(obj).fadeIn(500, function() {
    display_flickr($(this).next());
  });
}