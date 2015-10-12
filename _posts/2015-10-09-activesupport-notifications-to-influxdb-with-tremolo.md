---
published: true
title: ActiveSupport::Notifications to InfluxDB, with Tremolo
subtitle: 
author: Tony Pitale
created_at: 2015-10-09 21:56:19.107390 -04:00
layout: post
---

If you've ever used stat-tracking software like StatsD and Graphite, you may already have heard of [InfluxDB](https://influxdb.com/). For those who have not, it is a time-series database, useful for tracking data to be aggregated over a period of time. 

I've been using InfluxDB for some time to track a variety of data in my Rails application. InfluxDB caught my eye because it not only tracked data, but _metadata_, too.

To make it easier to use in my Rails applications I wrote a little library called [Tremolo](https://github.com/tpitale/tremolo) which has similar functionality to the Ruby StatsD library.

By way of introduction, I would like to show how I leveraged ActiveSupport::Notifications to send my data to InfluxDB using Tremolo. I'll do this in three parts.

* Basics of Tremolo
* Setting up ActiveSupport::Notifications
* Tie the two together

As a bonus, I'll also give you a glimpse at what the data looks like graphed on my dashboard, which uses [Grafana](http://grafana.org/).

## Intro to Tremolo ##

Tremolo is a library to send data in InfluxDB's wireline protocol over UDP, built using Celluloid. Using it is very straightforward. First, we make ourselves a tracker, pointing it at our InfluxDB instance.

<pre><code class="language-ruby">
Tremolo.supervised_tracker(:tracker, '0.0.0.0', 4444)
</code></pre>

To send InfluxDB some stats, we use our new tracker.

<pre><code class="language-ruby">
tracker = Tremolo.fetch(:tracker)

# increment a stat by 1
tracker.increment('count.series-name')
</code></pre>

Tremolo also supports `derement`, `timing` with an integer for milliseconds, and most importantly for my examples: `time` with a block.

<pre><code class="language-ruby">
tracker = Tremolo.fetch(:tracker)

# increment a stat by 1
tracker.time('timing.series-name') do
  # do something that takes time, like making an API call
  Net::HTTP.get(URI('http://example.com/api/v1/things'))
end
</code></pre>

Now that we've got the basics of Tremolo, let's take a look at what Rails has to offer to make our tracking a bit easier.

## ActiveSupport::Notifications ##

Rails has some very simple, but handy, functionality to allow us to `instrument` our code. Elsewhere, we can `subscribe` to get notifications of when our instrumented code is run. Rails uses this to instrument requests and calls to the database, while also enabling third-party libraries to hook into the system at both ends.

`ActiveSupport::Notifications` has some key features that make it especially well-suited to tie into a stats-tracking library like Tremolo.

1. `instrument` accepts a payload of extra information
2. `instrument` can handle timing a block of code
3. We can `subscribe` to a simple regex pattern to capture similar notifications

Let's take a look at a simple example, making an API call:
**Note:** I'm going to alias ActiveSupport::Notifications as ASN for brevity.

<pre><code class="language-ruby">
ASN.instrument('timing.external_requests', customer_id: customer.id) do
  ApiClient.get("/api/customers/#{customer_id}")
end
</code></pre>

And to subscribe to this:

<pre><code class="language-ruby">
ASN.subscribe('timing.external_requests') do |*args|
  event = ASN::Event.new(*args)

  # event contains lots of data, including:
  event.name # the full name of the instrument, 'timing.external_requests'
  event.duration # timing for the block
  event.payload # extra hash we passed to `instrument`
end
</code></pre>

Straightforward, and powerful. Let's make use of this to build some flexible tracking in our application.

## And Put 'em Together ##

### Subscriptions ###

Let's start by setting up some broad subscriptions using regex patterns:

<pre><code class="language-ruby">
ASN.subscribe(/\Atiming/) do |*args|
  # fill in here
end
</code></pre>

Now, let's fill in some tracking with Tremolo:

<pre><code class="language-ruby">
ASN.subscribe(/\Atiming/) do |*args|
  event = ASN::Event.new(*args)
  tracker = Tremolo.fetch(:tracker)

  tracker.timing(event.name, event.duration, event.payload)
end
</code></pre>

Inside our subscribe block, we make an event from the `args`, then get our `tracker`. Once we have those, we track the `timing` from our event, using the full name and duration, passing the payload as metadata last.

I also like to set up a `count` subscription, like so:

<pre><code class="language-ruby">
ASN.subscribe(/\Atiming/) do |*args|
  event = ASN::Event.new(*args)
  tracker = Tremolo.fetch(:tracker)

  data = event.payload
  value = data.delete(:value) || 1

  tracker.write_point(event.name, {value: value}, data)
end
</code></pre>

There's a little more to this one than our timing. First difference is we want to get a value for the count. If none is provided use 1 as a default. We use `delete` because we don't want this value tracked into the metadata in InfluxDB.

Next we use `write_point` on our `tracker` because we've got our own `value` to track.

### Instrument Our Code ###

Now that we have our subscriptions for both `timing` and `count`, we can start to `instrument` our code throughout. What's great is we just use the code from earlier:

<pre><code class="language-ruby">
ASN.instrument('timing.external_requests', customer_id: customer.id) do
  ApiClient.get("/api/customers/#{customer_id}")
end
</code></pre>

To track to a count series:

<pre><code class="language-ruby">
ASN.instrument('count.external_requests', {customer_id: customer.id})
</code></pre>

## What to Track ##

Here are some examples of the things I instrument in my own applications.

* timing of external API calls
* timing of background work
* counts of calls to deprecated methods
* business statistics like user logins/registrations
* cache misses

Though, if it takes time in code, or is of any importance to your business or the functioning of other code, track it!

## Bonus Round: Grafana ##

InfluxDB is extremely easy to get installed and running. If you're on a Mac `brew install` will get you running, and a simple configuration change will set up a UDP listener.

InfluxDB does not, however, have a UI for anything more than querying databases/series with a SQL-esque query language. This is where Grafana comes in.

![Grafana Dashboard](http://grafana.org/assets/img/features/dashboard_ex.png "Grafana Dashboard")
![Grafana Dashboard](http://grafana.org/assets/img/features/dashboard_ex.png "Grafana Dashboard")

I've found ActiveSupport::Notifications and Tremolo to be a fantastic combo. I hope this article has made it easier for you to get into tracking important data in your own applications.

Read more here about [ActiveSupport::Notifications](http://api.rubyonrails.org/classes/ActiveSupport/Notifications.html) and more about [Tremolo](https://github.com/tpitale/tremolo).

If you're wondering about the name Tremolo, I have a whole series of libraries for integrating stats in a variety of ways, all named for different musical terms. [Legato](https://github.com/tpitale/legato) pulls data from Google Analytics, and [Staccato](https://github.com/tpitale/staccato) sends data to GA using the official tracking API. Check 'em both out!