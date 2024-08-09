FROM node:latest

WORKDIR /app/
COPY package.json ./

RUN npm install -g pm2

RUN npm install

COPY ./output/server_build/ /app

EXPOSE 3093

CMD ["pm2-runtime", "Valetax.js"]
