FROM node
MAINTAINER m.maatkamp@gmail.com version: 0.1

RUN npm install mongodb amqp node-gyp bson
ADD js data

ENTRYPOINT      ["node", "data/mongodb.js"]
