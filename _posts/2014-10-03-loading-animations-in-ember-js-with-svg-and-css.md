---
published: true
title: Loading Animations in Ember.js with SVG and CSS
subtitle: 
author: Tony Pitale
created_at: 2014-10-03 12:11:35.592942 -04:00
layout: post
---

From a usability perspective, it's rare for "put a spinner on it" to be the right option. But, it can be a useful technique in some instances.

One such example is communicating network activity in an Ember.js application to users. Ember data uses jQuery's AJAX functionality, which has some really wonderful hooks into the operations it performs.

There are two types of triggers: local and global. For my purposes, I used the global triggers on `ajaxSend` and `ajaxComplete`. jQuery's recommendation is to bind these to $(document). You can read more on [local triggers in their docs](http://api.jquery.com/Ajax_Events/).

<pre><code class="language-javascript">
$(document).bind("ajaxSend", show_loader_function);
$(document).bind("ajaxComplete", hide_loader_function);
</code></pre>

I use these triggers to show/hide (or fadeIn/fadeOut) an SVG loading "spinner", placed discretely in the header.

The [original source for that SVG is here](http://codepen.io/aurer/pen/jEGbA/?editors=110). Unfortunately, I found that there was something delaying the start of the animation embedded in the SVG. So, I turned to CSS3 (with SCSS, naturally) to generate a smoother animation. Compass has a simple mixin use creating a named keyframe and including it in the selector.

The jQuery AJAX triggers, SVG, and animation SCSS ended up looking like this when complete:

### Triggers ###

<pre><code class="language-javascript">APP.show_loader = function() {
     $('.header .loader').fadeIn(50);
}

APP.hide_loader = function() {
     $('.header .loader').fadeOut(100);
}

$(document).bind("ajaxSend", APP.show_loader).bind("ajaxComplete", APP.hide_loader);
</code></pre>

### SVG ###

<pre><code class="language-markup">
&lt;div class="loader" title="loading"&gt;
  &lt;svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="30px" height="30px" viewBox="0 0 50 50" style="enable-background:new 0 0 30 30;" xml:space="preserve"&gt;
    &lt;path fill="#000" d="M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z"&gt;&lt;/path&gt;
  &lt;/svg&gt;
&lt;/div&gt;
</code></pre>

### CSS Animation ###

<pre><code class="language-css">@include keyframes(spin) { // uses compass for keyframe mixin
  100% { transform: rotate(360deg); }
}

.loader {
  svg {
    display: inline-block;

    @include animation(spin 0.6s infinite);
    @include animation-timing-function(linear);

    path {
      fill: #FFFFFF;
    }
  }
}
</code></pre>

This combination of jQuery's global AJAX triggers and SVG+CSS animations is flexible. It is easy to adjust the size of the SVG, and the rotation speed and color of the animation with CSS. It's also more performant than the common animated gif spinner (fewer requests, smaller size). A better way to "put a spinner on it."

