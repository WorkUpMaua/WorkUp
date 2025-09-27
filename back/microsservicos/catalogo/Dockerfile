FROM node:alpine

WORKDIR /catalogo

COPY . .

RUN npm i

RUN npm run build

CMD ["npm", "run", "start:dist"]