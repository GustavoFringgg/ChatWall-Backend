FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY . .
ENV NODE_ENV=production

RUN npm run swagger:production
EXPOSE 3000

CMD ["npm", "run", "start"]
