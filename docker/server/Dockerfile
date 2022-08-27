FROM node:18

COPY . /root/yt_rec_graph
WORKDIR /root/yt_rec_graph
RUN yarn
RUN npm install pm2 -g
RUN pm2 install typescript

EXPOSE 38472/tcp
