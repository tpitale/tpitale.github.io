---
title: t.pitale
created_at: 2008-03-11 23:23:49.995233 -04:00
layout: default
---
<div id="blog">
  <div class="wrap">
    <div class="col">
      <!-- List of Blog Posts -->
      {% assign posts = site.posts %}
      {% for post in posts limit:15 offset:1 %}
        * [{{post.title}}]({{post.url}})
      {% endfor %}
    </div>
    <div class="block">
      <!-- Latest Post -->
      {% for post in posts limit:1 %}
        {{include post.md}}
      {% endfor %}
      
      <div class="allposts">
        [Blog Archive](/blog.html)
        <b>or</b>
        [Feed](http://feeds.feedburner.com/tpitale)
        <img src='/images/feed.png' />
      </div>
    </div>
  </div>
</div>

<!-- Sampling of flickr images -->
<div id="photos">
  <div class="wrap">
    <script type="text/javascript" src="http://www.flickr.com/badge_code_v2.gne?count=10&display=random&size=s&layout=x&source=user_set&user=41783324%40N00&set=72157605236285647"></script>
    <script type="text/javascript" src="http://www.flickr.com/badge_code_v2.gne?count=10&display=random&size=s&layout=x&source=user_set&user=41783324%40N00&set=72157602176622405"></script>
    <script type="text/javascript" src="http://www.flickr.com/badge_code_v2.gne?count=10&display=latest&size=s&layout=x&source=user_set&user=41783324%40N00&set=72157600262586911"></script>
    <br class="clearleft" />
  </div>
</div>

<!-- Portfolio Links, w/images, to my projects -->
<div id="projects">
  <div class="wrap">
    <div class="col">
      <ul>
        <li>
          [Garb](http://github.com/vigetlabs/garb)
          Ruby Wrapper for the Google Analytics Data Export API
        </li>
        <li>
          = link_to("Mongolytics", 'http://github.com/tpitale/mongolytics')
          Rails Request and Session Analytics Stored in MongoDB
        </li>
        <li>
          = link_to("SimplestAuth", 'http://github.com/vigetlabs/simplest_auth')
          Very Simple Authentication for Rails using BCrypt, developed at Viget
        </li>
        <li>
          = link_to("net/simple", 'http://github.com/tpitale/net-simple')
          Simple wrapper around net/ssh and net/scp, inspired by Capistrano
        </li>
        <li>
          = link_to("Information Schema", 'http://github.com/tpitale/information_schema')
          Collection of DataMapper Resource Classes to access PostgreSQL Information Schema Views
        </li>
        <li>
          = link_to("ICS Winepos", 'http://github.com/tpitale/vznweb')
          Winepos Site, a Webby Project for Innovative Computer Solutions
        </li>
        <li>
          = link_to("GA Debug", 'http://github.com/tpitale/ga-debug')
          Script to Debug Google Analytics in Development with console logs and a popup message box
        </li>
      </ul>
    </div>

    <div class="block">
      <a href="http://wineistasty.com" target="_blank" class="tasty">
        ### Tasty ###
        <span>Ruby/Rails with PostgreSQL, DataMapper, and MongoDB</span>
      </a>
      <a href="http://winepos.com" target="_blank" class="winepos">
        ### ICS Winepos Site ###
        <span>Implementation using Webby, some design work, deployment</span>
      </a>
      %a{:href => 'http://a.ppend.to', :target => '_blank', :class => 'append'}
        / %img{:src => '/images/append.png'}
        %h3 Append
        %span 2009 Rails Rumble Entry; Team Scatapult
      %a{:href => 'http://focusapp.com', :target => '_blank', :class => 'focus'}
        / %img{:src => '/images/focus.png'}
        %h3 Focus
        %span Under Development with Ruby, Merb, jQuery, and PostgreSQL
      %br.clearleft/
    </div>
  </div>
</div>
