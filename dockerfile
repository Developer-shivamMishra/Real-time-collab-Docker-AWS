# build the frontend(dist folder)
#copy the dist folder to the server/public folder


FROM node:20-alpine AS cleint-builder

COPY ./client /app

WORKDIR /app

RUN npm install

RUN npm run build


#build the server

FROM node:20-alpine


COPY  ./server /app

WORKDIR /app
RUN npm install

COPY --from=cleint-builder /app/dist ./public



CMD ["node", "server.js"]