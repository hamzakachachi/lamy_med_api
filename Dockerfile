FROM node:19-alpine

WORKDIR /lamy_med_api
COPY package.json .
RUN npm install
COPY . .
EXPOSE 8080
CMD npm start