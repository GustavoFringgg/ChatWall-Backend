FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run swagger:production
EXPOSE 3000

CMD ["npm", "run", "start:production"]
