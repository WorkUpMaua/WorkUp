FROM node:alpine

WORKDIR /disponibilidade

COPY . .

RUN npm i

RUN npm run build

CMD ["npm", "run", "start:dist"]