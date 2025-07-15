FROM node:20-alpine

WORKDIR /app

COPY . .

RUN npm install --only=production

EXPOSE 4000

CMD ["npm", "run", "start"]



