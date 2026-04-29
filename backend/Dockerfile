<<<<<<< HEAD
FROM node:20-bookworm-slim
=======
FROM node:20-alpine
>>>>>>> 349b834 (new update)

WORKDIR /app

COPY package*.json ./
<<<<<<< HEAD
RUN npm install --omit=dev

COPY src ./src

EXPOSE 3001
=======
RUN npm ci --omit=dev

COPY . .

EXPOSE 3001

>>>>>>> 349b834 (new update)
CMD ["npm", "start"]
