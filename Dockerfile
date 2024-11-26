FROM node:16.16.0
COPY ./node/ .
CMD [ "node", "server.js" ]