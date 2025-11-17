FROM node:latest

WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y netcat-traditional

COPY package*.json ./

RUN npm install --ignore-scripts

COPY . .

EXPOSE 3000

CMD ["npm", "run", "start:dev"]