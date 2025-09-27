FROM node:alpine

WORKDIR /property

COPY . .

RUN npm i

RUN npm run build

CMD ["npm", "run", "start:dist"]