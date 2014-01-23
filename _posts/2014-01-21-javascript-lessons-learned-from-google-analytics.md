---
published: true
title: Javascript Lessons Learned from Google Analytics
subtitle: 
author: Tony Pitale
created_at: 2014-01-21 11:32:10.621588 -05:00
layout: post
---

Over the years I've occasionally gone spelunking in the Google Analytics tracking javascript. Historically this code has been heavily obfuscated along with the usual minimizing. While it is difficult to tease out, I have learned some interesting things through my efforts.

### undefined ###

In javascript, `undefined` is a variable. If someone less-sane than ourselves was around, they could reassign undefined to an entirely different value. o_0

To be certain that they're really working with undefined, the GA tracking javascript uses `void 0` or `void(0)` to ensure it works with an explicitly undefined `undefined`.

<pre><code class="language-javascript">void(0) == undefined //=> true</code></pre>

### arguments ###

I was only vaguely aware of `arguments` before my exploration, but it's actually quite powerful. It's a local variable that's set for each function when it is called. It contains an array of any arguments passed to the function when it was called, regardless of the arguments that function would normally accept.

<pre><code class="language-javascript">var show_args = function(a,b) {
  console.log(a);
  console.log(b);
  console.log(arguments);
}

show_args(1,2,3,4,5);
</code></pre>

The output from the above should be:

<pre><code class="language-javascript">1
2
[1,2,3,4,5]
</code></pre>

As always, the [Mozilla Developer Network docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions_and_function_scope/arguments) have a ton of fantastic information.

### Access functions in objects with array syntax ###

The usual pattern for calling a function is something like this

<pre><code class="language-javascript">var blah = function() {alert('Blah.');}
blah();
</code></pre>

Or if it's inside an object:

<pre><code class="language-javascript">var obj = {
  blah: function() {alert('Blah.');}
}

obj.blah();
</code></pre>

But, because objects have the ability to access their contents like a hash in Ruby, or an array, we can get a reference to our function using `[]` syntax.

<pre><code class="language-javascript">obj["blah"]();</code></pre>

These may not be new to all of you, but I find them extremely useful in working with my own javascript code. I'm sure I would have found them out eventually, but it really speaks to the value of reading code other than our own. There's always something to learn. Though, I would not recommend you go diving through highly obfuscated javascript. At least not on a regular basis.
