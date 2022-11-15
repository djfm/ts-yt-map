# ts-yt-map

![Continuous Integration](https://github.com/djfm/ts-yt-map/actions/workflows/ci.yaml/badge.svg)

A tool to extract recommendations from YouTube.

## Principle

It's a client / server architecture.

The server centralizes the recommendations crawled from YouTube, and any number of
clients can be spawned to crawl YouTube.

Each client will:

- ask the server for a YouTube video URL to crawl
- crawl it (main info) as well as its channel and the first 10 recommendations
- send the result to the server
- iterate, using a brand new browser session such that history doesn't play a role

The most compute intensive operations are performed by the clients, so it's OK to have one server
and many clients (hundreds or thousands probably work fine).

We don't know yet what we will do with the dataset exactly, this is a basis for research.

## Prerequisites

- a linux machine or something that runs `bash`
- the latest `docker` with `docker compose`

## Installing docker

`docker` and `docker compose` are the easiest way to run either the server or the clients.

A script named [setup-ubuntu](setup-ubuntu) is provided to install docker on a brand new `Ubuntu Jammy` machine.

Otherwise follow the [official instructions](https://docs.docker.com/), upon which the script is heavily inspired.

## Starting a server

You'll need the node server itself, and another server that understands virtual hosts
and SSL to do the SSL termination and forward the traffic to node.

I describe how to do that with `apache` because I'm more familiar with it, but a similar result
could be obtained with `nginx` for instance.

### Starting the node server, using docker

If you have `docker compose`, running:

```bash
./server <password>
```

should be enough.

### Routing the traffic to Node using Apache2 and SSL

It is recommended to secure the connection with SSL.

Since having SSL certificates in node apps is usually a pain in the ass, I'm using `Apache2` for the SSL termination, and it uses `mod_proxy` to forward the requests to node.

If you have `apache2` installed, you can use
the [example vhost](examples/yt.vhost.conf), adapting what's necessary (a priori only the `ServerName`) to route the traffic to node.

You'll need to enable two `apache` modules:

```bash
sudo a2enmod proxy
sudo a2enmod remoteip
sudo systemctl reload apache2
```


### Accessing the database interface

There is [another vhost](examples/adminer.vhost.conf) to expose the database administration interface, it uses `Basic Auth` to protect access to the services exposed.

In this one you'll have to modify `ServerName` and `ServerAdmin`.

**Quick reminder on how to add a user for `Basic Auth`**

```bash
sudo htpasswd -c /etc/apache2/.htpasswd <user>
```
### Configuring `apache`

Just copy the 2 vhosts you have just adapted to `/etc/apache2/sites-available`, then run `sudo a2ensite` on each one,

then **enable SSL on both of them** by following the instructions from the [certbot website](https://certbot.eff.org/).

## Running the client

**Customize the seed for this client:**

Edit `seed_video` in config/production-docker.yaml and `client_name`.
A client is identified with its name and IP address (IP as determined by server).
The seed video is associated to the client at its creation and never changes.

**Start the client(s)**

Still assuming you have `docker compose` installed,
just run:

```bash
./client <url> <password> [project_id=1] [concurrency=4]
```

## Get first-level recommendations from a list of URLs

### Create a "project"

First start the server somewhere with `./server some_password`

Then from any computer run:

```bash
node dist/bin/createProject.js https://server.com some_password data/urls.sample.txt
```

Then answer the questions. Project name must be unique.

It should display something like this:

```bash
Server: https://server.com
Password: some_password
{"level":50,"time":1668524728301,"pid":2938054,"hostname":"maison","msg":"Loading config from test.yaml by default. This may be a mistake."}
Project name: test project again
Project description: a test project
Successfully created project Project {
  id: 2,
  name: 'test project again',
  type: 'first level recommendations',
  description: 'a test project',
  createdAt: '2022-11-15T15:05:44.615Z',
  updatedAt: '2022-11-15T15:05:44.615Z'
}
```

### Start the client with the project id

Once the project is created, you can start clients to scrape only the first level recommendations with:

```
./client server.com some_password 2
```

Where `2` is the `id` of the project you've just created.

The recommendations will be stored in the `video` table as usual, with `project_id` set to the project you've used.
You can parallelize the scraping across many machines if the list of URLs is long.

In the `video` table, videos are unique for a given project, i.e. there is a unique index on `project_id` and `url`.

