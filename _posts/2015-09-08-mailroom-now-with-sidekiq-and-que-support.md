---
published: true
title: MailRoom, Now With Sidekiq and Que Support
subtitle: 
author: Tony Pitale
created_at: 2015-09-08 21:52:09.305086 -04:00
layout: post
---

Before today, MailRoom primarily delivered mail messages from IMAP via a POST request to an API you configure. Now, thanks to the work of [Douwe Maan](https://github.com/douwem) (for a [GitLab feature](https://gitlab.com/gitlab-org/gitlab-ce/merge_requests/1173)), there are delivery methods for enqueuing work into redis or postgresql to be handled by your own Sidekiq or Que workers!

Along with these brand new strategies, we have lots of bug fixes and new features in MailRoom:

* Mailboxes can be [configured to DELETE](https://github.com/tpitale/mail_room#configuration) a message after receiving it.
* The mailbox will be checked immediately upon startup for any unread messages.
* All IOErrors will be handled, not just EOFErrors.
* Brand new configuration, due to expanded options for Sidekiq and Que delivery.

Configuration new looks more like this:

<pre><code class="language-ruby">
:mailboxes:
  -
    :email: "user1@gmail.com"
    :password: "password"
    :name: "inbox"
    :search_command: 'NEW'
    :delivery_method: que
    :delivery_options:
      :host: localhost
      :port: 5432
      :database: mail_room_development
      :username: username
      :password: password
      :queue: default
      :priority: 5
      :job_class: EmailParseJob
</code></pre>

The `delivery_options` section is new, and holds all options specific to the chosen delivery method. Check out the [README for Sidekiq](https://github.com/tpitale/mail_room/blob/master/README.md#sidekiq) and [Que](https://github.com/tpitale/mail_room/blob/master/README.md#que) to see all the new options.

All existing configuration will continue to work for the foreseeable future, so have no fear when upgrading to the latest version.

I hope this makes using MailRoom even easier. Please help me in thanking Douwe Maan for his excellent work on the Sidekiq delivery method! I'm very excited to see [GitLab using MailRoom](https://gitlab.com/gitlab-org/gitlab-ce/blob/master/Gemfile#L272).

If you have any questions or requests, please [open an issue](https://github.com/tpitale/mail_room/issues), or chat with me [on Twitter](https://twitter.com/tpitale).
