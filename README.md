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
./server <passwords>
```

Should be enough.

### Routing the traffic to Node using Apache2

If you have apache2 installed, you can use
the [example vhost](examples/apache.vhost.conf)

**You need to establish a SSL certificate for your apache proxy:**

Just follow the instructions from the [certbot website](https://certbot.eff.org/)