FROM bitnami/node:22
WORKDIR /code
COPY . .
ENV PORT=3333
ARG PORT=${PORT}
EXPOSE ${PORT}
RUN npm install
RUN npm run build
CMD ["npm", "run", "start"]