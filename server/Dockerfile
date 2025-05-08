FROM bitnami/node:22
WORKDIR /code
COPY package*.json .
RUN npm ci
COPY . .
ENV PORT=3333
ARG PORT=${PORT}
EXPOSE ${PORT}
RUN npm run build
CMD ["npm", "run", "start"]