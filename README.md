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

Still assuming you have `docker compose` installed,
just run:

```bash
./client <url> <password> [concurrency=4]
```

If you wanna contribute your resources to our server feel free to spawn a client with:

```bash
./client https://yt.fmdj.fr <password> 8
```

I will work on providing a read-only access to the database for those interested.

## Random useful things

```bash
docker run -i --rm postgres cat /usr/share/postgresql/postgresql.conf.sample > my-postgres.conf
```

```bash
docker compose run --rm postgres-test cat /var/lib/postgresql/data/pg_hba.conf > my-pg_hba.conf
```
