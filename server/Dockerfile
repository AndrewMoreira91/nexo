FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ENV PORT=3333
EXPOSE 3333
RUN npm run build
CMD ["npm", "start"]