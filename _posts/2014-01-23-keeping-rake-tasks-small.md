---
published: true
title: Keeping Rake Tasks Small
subtitle: 
author: Tony Pitale
created_at: 2014-01-23 09:51:12.556562 -05:00
layout: post
---

Just as we want to keep our controller actions "skinny", for the sake of short methods and easy testing, we want to attain a similar level of brevity in our Rake tasks.

I recently read some blog posts about testing Rake tasks, or switching to Thor to make testing feasible. While these posts are not bad ideas, if you have Rake tasks with lots of logic, I disagree with the initial premise for using tasks for this type of code, or in these quantities.

If you've ever found yourself running `script/rails runner -e production 'Klass.do_that_thing'` repeatedly, you probably want a Rake task. The point being, keep all your code in the most easily testable place: a regular, boring, plain old ruby object. If you're test-driving your design, the API for that object should be easily usable, regardless of whether you call if from another object, from the console, or from `script/rails runner`.

Once you've found that sweet, usable API (through testing), then go ahead and make yourself a rake task for it, just to make it a little easier to remember.

<pre><code class="language-ruby">desc "Doing that thing"
task :do_that_thing do
  Klass.do_that_thing
end
</code></pre>
