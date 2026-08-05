FROM node:26-alpine as build

WORKDIR /app

ARG VITE_API_URL=http://localhost:8000/api
ARG VITE_IMAGE_URL=http://localhost:8000

ENV VITE_API_URL=$VITE_API_URL
ENV VITE_IMAGE_URL=$VITE_IMAGE_URL

COPY package*.json ./

RUN npm install
COPY . .

RUN npm run build


FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]


