FROM node:22-alpine

WORKDIR /app

COPY . .

ENV PORT=3000

ARG PORT=${PORT}

EXPOSE ${PORT}

RUN npm ci --only=production

RUN npm run build

CMD ["npm", "start"]