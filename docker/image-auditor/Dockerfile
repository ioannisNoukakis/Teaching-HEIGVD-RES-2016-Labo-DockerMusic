FROM node:latest

MAINTAINER Ioannis Noukakis

COPY listener /opt/dockermusic

WORKDIR /opt/dockermusic

RUN npm install dateformat

ENTRYPOINT ["node", "/opt/dockermusic/listener.js"]
