FROM node:10.15.0-alpine
EXPOSE 3001

WORKDIR /app

COPY ../package.json /app
COPY ../package-lock.json /app

RUN npm install

COPY .. /app

RUN npm run build

CMD ./start.sh