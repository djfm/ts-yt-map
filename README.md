# ts-yt-map

A tool to extract recommendations from YouTube.

## Prerequisites

- a linux machine or something that runs `bash`
- the latest `docker` with `docker-compose`

## Usage

## Starting a server

### Node server, using docker

If you have `docker compose` running:

```bash
./server <password>
```

should be enough.

### Routing the traffic to Node using Apache2 and SSL

It is recommended to secure the connection with SSL.

Since having SSL certificates in node apps is usually a pain in the ass, I'm using `Apache2` for the SSL termination, and it uses `mod_proxy` to forward the requests to node.

If you have apache2 installed, you can use
the [example vhost](examples/apache.vhost.conf), adapting what's necessary (a priori only the `ServerName`) to route traffic to node.

### Accessing the database interface

There is [another vhost](examples/adminer.vhost.conf) to expose the database administration interface, it uses `Basic Auth` to protect access to the services exposed.

In this one you'll have to modify `ServerName` and `ServerAdmin`.

**Quick reminder on how to add a user for `Basic Auth`**

```bash
sudo htpasswd -c /etc/apache2/.htpasswd <user>
```
### Configuring `apache`

Just copy the 2 adapted vhosts to `/etc/apache2/sites-available`, then run `sudo a2ensite` on each one,

Then enable SSL on both of them by following the instructions from the [certbot website](https://certbot.eff.org/).

### Starting a client

Still assuming you have `docker compose`,
just run:

```bash
./client <url> <password> [concurrency=4]
```