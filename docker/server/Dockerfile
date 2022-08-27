FROM node:18

COPY . /root/yt_rec_graph
WORKDIR /root/yt_rec_graph
RUN yarn
RUN pm2 install typescript

EXPOSE 38472/tcp
EXPOSE 38478/tcp
