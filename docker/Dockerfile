FROM node:18 AS build
WORKDIR /app
COPY . .
RUN npm install && npm run build --prod

FROM nginx:alpine
COPY --from=build /app/www /usr/share/nginx/html
