# build
# docker build -t node-test .
# run interactive
# docker run -it --rm -p 4000:4000 --name test-node 'node-test'

FROM node:6.9.2-alpine

RUN apk add --no-cache openssl python build-base && \
wget -O /usr/local/bin/dumb-init https://github.com/Yelp/dumb-init/releases/download/v1.1.2/dumb-init_1.1.2_amd64 && \
chmod +x /usr/local/bin/dumb-init && \
apk del openssl

EXPOSE 4000

WORKDIR /app

RUN npm install --loglevel error --global yarn pty64

ADD ./package.json ./
ADD ./yarn.lock ./
ADD ./server/package.json ./server/package.json
ADD ./server/yarn.lock ./server/yarn.lock

RUN \
cd server && yarn && cd .. && pty64 -- yarn && \
tar -czf /tmp/app.tar.gz . && \
yarn cache clean && \
rm -rf ./* /root/.npm /root/.node-gyp /root/.gnupg

ADD . ./

RUN \
tar -zxvf /tmp/app.tar.gz 1>/dev/null && \
pty64 -- yarn run lint && \
pty64 -- yarn run build && \
rm -rf ./node_modules

CMD /usr/local/bin/dumb-init -- node ./server/index.js
