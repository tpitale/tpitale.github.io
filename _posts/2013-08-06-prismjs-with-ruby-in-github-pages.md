---
published: true
title: Prism.js with Ruby in Github Pages
subtitle: 
author: Tony Pitale
created_at: 2013-08-06 16:58:11.934932 -04:00
layout: post
---

After quite a long time, and quite a few blog posts using gists for embedding
code samples with highlighting and the rest, I'm giving something else a try.

I've added prism.js and a ruby language extension by [Sam Flores](https://github.com/samflores).

Here's the quick and dirty way to add prism.js to your own blog (or in my
case, Github Pages).

* Add [prism.js and prism.css](http://prismjs.com/download.html)
* Add [prism.ruby.js](https://github.com/samflores/prism-langs/blob/master/prism.ruby.js)
* Link to both in your layout

And then just write some code inside &lt;pre&gt;&lt;code&gt; tags!

<pre><code class="language-ruby">class Cow
  def says
    puts 'moo'
  end
end

Cow.new.says #=> moo</code></pre>

Simple as that! I'm gonna give it a try for a little while. Let me know how
you think it looks, and how the code reads for you. Thanks!
