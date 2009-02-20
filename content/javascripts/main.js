$(document).ready(function(){
  display_flickr();
});

function display_flickr(obj) {
  if(obj==undefined) obj = $("div.flickr_badge_image:first")
  $(obj).fadeIn(250, function() {
    display_flickr($(this).next());
  });
}
