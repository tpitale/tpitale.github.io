---
published: true
title: Aliasing Fields on Ecto Associations in Absinthe for GraphQL
subtitle:
author: Tony Pitale
created_at: 2019-02-01 11:10:24.786042 -06:00
layout: post
---

How do we maintain the consistency of our GraphQL APIs over time, while the underlying data structures change? This is a common question we face building software on the web. We have mobile and react applications, or third party consumers, that rely upon the structure and data provided our APIs. The truth of our data storage may be much different than the API presents. Let’s adapt a few common scenarios using features available from Absinthe in Elixir/Phoenix/Ecto.

One technique for handling this is to continue presenting the original field, but using data from another source. I would refer to this as “aliasing” or mapping one field’s data into another. The fundamental idea in Absinthe is that the name of the field presented in the API is not required to be the key for the source of data we use.

I’ll cover two scenarios of database refactorings I went through recently, while keeping the API backward compatible:

1. Renaming a column
2. Moving a column into another table

## Renaming a Column ##

This is a simple example to get us warmed up, but we’ll use this technique in combination with another in our next example.

We’ll start with a table and a column (example from Postgres):

<pre><code class="language-sql">
CREATE TABLE firmware_versions (
  id SERIAL,
  semantic_version_number text
);

CREATE TABLE devices (
  id SERIAL,
  firmware_version_id integer REFERENCES firmware_versions(id),
  desired_firmware_version_id integer REFERENCES firmware_versions(id)
);
</code></pre>

And the Absinthe object type would look something like (I’ve omitted data loaders and resolvers):

<pre><code class="language-elixir">
@desc "Firmware version"
object :firmware_version do
  @desc "Database ID of the firmware version"
  field(:id, :integer)

  @desc "Firmware version expressed as a semantic version number"
  field(:semantic_version_number, :string)
end

@desc "A network-connected device"
object :device do
  …
  @desc "Current firmware version of the device"
  field(:firmware_version, :firmware_version, resolve: dataloader(Device))

  @desc “Firmware version we are attempting to update to"
  field(:desired_firmware_version, :firmware_version, resolve: dataloader(Device))
end
</code></pre>

### Changing the object_type ###

What happens when we change the column name from `desired_firmware_version_id` to `requested_firmware_version_id`? This is an admittedly contrived example, meant to highlight a point. Aside from the normal database migration to alter the table, we need only make a straightforward change in our GraphQL type for the device to maintain the interface for our users.

<pre><code class="language-elixir">
field(:requested_firmware_version, :firmware_version, resolve: dataloader(Device), name: "desired_firmware_version")
</code></pre>

Two changes are required. To start, we update the first argument in `field` to match the new name of the column (in this case, an association). Then, we add the option for `name` and pass in a string (binary) to match the previous column’s name in the API.

If you are planning to deprecate the old field name over time, add the `deprecate` option available on `field` and pass it a string with the reason for the deprecation. Absinthe will handle the rest.

## Moving to a New Table ##

What happens if we make a more drastic change to the structure of our data by adding a relation to the mix? Whether this is a new table or an existing table that better suits our data, our structures may change in more substantial ways. In this example, we’ll start from the same initial structure of the `devices` table from above. Instead, we’ll add a new table rather than renaming our column.

<pre><code class="language-sql">
CREATE TABLE firmware_update_requests (
  id SERIAL,
  pending boolean DEFAULT true,
  device_id integer REFERENCES devices(id),
  firmware_version_id integer REFERENCES firmware_versions(id)
);

CREATE UNIQUE INDEX pending_request_index ON firmware_update_requests(device_id, pending);
</code></pre>

This change will necessitate more changes than our previous example, but fundamentally, the technique is the same.

### Add an Ecto Virtual Field and Association ###

To make it work, we just need to get the data from this new table’s `firmware_version_id` into a place on the device record where our alias Absinthe `field` can get to it.

We’ll use a combination of two Ecto features: we’ll make space for the `firmware_version_id` using a `virtual` field in the schema and add our association without defining a field (since we already did it in the virtual field).

<pre><code class="language-elixir">
# in MyApp.Device module
schema :devices do
  # snip …
  field(:requested_firmware_version_id, :integer, virtual: true)
  belongs_to(:requested_firmware_version, MyApp.FirmwareVersion, define_field: false)
end
</code></pre>

This creates a place for us to join data into the device, and allows us to look it up as an association.

### Update the Absinthe Resolver ###

Now, we can change our query to load this data. For Absinthe, we do this in the resolver:

<pre><code class="language-elixir">
defp with_pending_request(query \\ MyApp.Device) do
  from(
    d in query,
    left_join: r in MyApp.FirmwareUpdateRequest,
    on: d.id == r.device_id,
    on: r.pending == true,
    select: %{d | requested_firmware_version_id: r.firmware_version_id}
  )
end
</code></pre>

Let’s break this down. We'll start with the `query` argument. This is an `Ecto.Query` for records from `MyApp.Device`. Next, we `left_join` our `firmware_update_request` record on the matching `device_id` and we restrict it to `pending` requests so that we only join, at most, a single record for each device.

Lastly, my favorite bit, is the `select`. It merges the `firmware_version_id` into the new virtual field we added to the `MyApp.Device` schema. And with that data in place, we can use our previous change to the Absinthe object type `field` for the `name` option and everything will work.

## All Together Now ###

With all of these changes: using the resolver to load the firmware version from the `firmware_update_request` association into an Ecto virtual field and aliasing the field in Absinthe we have successfully mapped a column from an associated table into place on the original field in our GraphQL API. Thus, we have retained the external structure and data of our API while modifying the underlying data store.

While this is how I solved this particular problem it is, of course, not the only way to solve this problem. Other solutions might involve resolver callbacks (coming in the next version of Absinthe) or simply a custom resolver that returns a properly formed map. Whatever path you choose, I hope this provides you some new info on both Absinthe and Ecto and their function.

This post was original published on the [Power the People](https://tech.offgrid-electric.com/aliasing-fields-on-ecto-associations-in-absinthe-for-graphql-abcaad92b9b4) blog.
