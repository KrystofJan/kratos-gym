FROM node:21.2.0

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV PORT=7000
ENV PGHOST="localhost"
ENV PGDATABASE="kratos-dev"
ENV PGUSER="postgres"
ENV PGPASSWORD="postgres"

EXPOSE 7000

CMD ["npm", "run", "dev"]
