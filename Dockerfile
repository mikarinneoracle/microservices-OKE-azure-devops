FROM node:16.16.0
COPY ./node/ .
RUN npm install
CMD [ "node", "server.js" ]