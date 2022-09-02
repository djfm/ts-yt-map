FROM ubuntu:latest
RUN apt update
RUN apt install -y postgresql-client
RUN echo 'postgres:5432:yt_rec_graph:postgres:hello' > .pgpass
RUN chmod 600 .pgpass
RUN cat .pgpass
ENV PGPASSFILE=.pgpass
