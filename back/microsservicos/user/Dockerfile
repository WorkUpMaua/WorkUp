FROM node:alpine

WORKDIR /user

COPY . .

RUN npm i

RUN npm run build

CMD ["npm", "run", "start:dist"]