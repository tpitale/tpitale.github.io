---
layout: default
---
<div id="post">
  # {{ page.title }} #
  ## {{ page.subtitle }} ##
  <span class="date"> {{ page.created_at | date: '%Y-%m-%d' }} </span>

  {{ content }}

  <div id="disqus_thread">
</div>

<script type="text/javascript" src="http://disqus.com/forums/tpitale/embed.js"></script>
<noscript>
  [View the discussion thread.](http://tpitale.disqus.com/?url=ref)
  <a href="http://disqus.com" class="dsq-brlink">
    blog comments powered by <span class="logo-disqus">Disqus</span>
  </a>
</noscript>