---
title: Blog
created_at: 2008-03-9 23:23:49.995233 -04:00
layout: default
---
- posts = @pages.find(:all, :in_directory => 'posts', :sort_by => 'created_at', :reverse => true)
- posts.each do |post|
  = render(post)