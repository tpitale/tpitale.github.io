---
extension: xml
layout: false
dirty: true
filter:
  - haml
---
<?xml version="1.0" encoding="UTF-8"?>
%urlset{:xmlns=>"http://www.sitemaps.org/schemas/sitemap/0.9"}
  %url
    %loc http://t.pitale.com/
    %lastmod= Time.now.xmlschema
    %changefreq daily
    %priority 1.0    
  %url
    %loc http://t.pitale.com/posts/
    %lastmod= Time.now.xmlschema
    %changefreq daily
    %priority 1.0
  %url
    %loc http://t.pitale.com/feed.xml
    %lastmod= Time.now.xmlschema
    %changefreq daily
    %priority 1.0
  
  - posts = @pages.find(:limit => :all, :in_directory => 'posts', :sort_by => 'created_at', :reverse => true)
  - posts.each do |post|
    %url
      %loc= "http://t.pitale.com"+post.url
      %lastmod= post.created_at.xmlschema
      %changefreq never
      %priority 0.8