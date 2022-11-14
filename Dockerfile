FROM node:latest

RUN apt-get update \
  && apt-get install -y wget gnupg \
  && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
  && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
  && apt update \
  && apt install -y google-chrome-stable \
                    fonts-ipafont-gothic \
                    fonts-wqy-zenhei \
                    fonts-thai-tlwg \
                    fonts-kacst \
                    fonts-freefont-ttf libxss1 \
                    bash --no-install-recommends
COPY . /root/yt_rec_graph
WORKDIR /root/yt_rec_graph
RUN yarn
EXPOSE 38472/tcp
EXPOSE 38478/tcp
EXPOSE 38479/tcp
