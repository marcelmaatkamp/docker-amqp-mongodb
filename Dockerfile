FROM node:4
MAINTAINER m.maatkamp@gmail.com version: 0.1

RUN npm install mongodb amqp-ts 
ADD js/mongodb.js .

CMD ["node", "./mongodb.js"]
