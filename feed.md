---
title:      t.pitale blog
created_at: 2008-03-9 23:23:49.995233 -04:00
extension: xml
layout: false
dirty: true
filter:
  - haml
---

<?xml version="1.0" encoding="utf-8"?>
%feed{:xmlns=>"http://www.w3.org/2005/Atom"} 
  %title t.pitale
  %link{:href=>"http://t.pitale.com/feed.xml",:rel=>"self"}/
  %link{:href=>"http://t.pitale.com/"}/
  %id http://t.pitale.com/
  %updated= Time.now.xmlschema
  %author
    %name Tony Pitale
    %email tpitale@gmail.com
    
  - posts = @pages.find(:all, :in_directory => 'posts', :sort_by => 'created_at', :reverse => true)
  - posts.each do |post|
    %entry
      %id= post.url+","+post.created_at.to_s
      %title= post.title
      %subtitle= post.subtitle
      %link{:href=>"http://t.pitale.com"+post.url}
      %updated= post.created_at.xmlschema
      %content{:type=>'html'}
        = h(render(post)) unless post.filename == 'index'