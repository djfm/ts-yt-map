FROM node:latest

RUN apt update
RUN apt upgrade -y
RUN apt install libnss3 \
                libatk1.0-0 \
                libatk-bridge2.0-0 \
                libcups2 \
                libdrm2 \
                libxkbcommon0 \
                libxcomposite1 \
                libxdamage1 \
                libxfixes3 \
                libxrandr2 \
                libgbm1 \
                libasound2 \
                lsb-release \
                -y

RUN lsb_release -a

COPY . /root/yt_rec_graph
WORKDIR /root/yt_rec_graph
RUN yarn
EXPOSE 38472/tcp
EXPOSE 38478/tcp
EXPOSE 38479/tcp
