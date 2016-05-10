FROM node:latest

MAINTAINER Ioannis Noukakis

COPY musicien /opt/dockermusic

WORKDIR /opt/dockermusic

RUN npm install node-uuid

ENTRYPOINT ["node", "/opt/dockermusic/instrument.js"]
