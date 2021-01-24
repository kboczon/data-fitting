FROM node:15.5.1-alpine3.10 as react_build 
WORKDIR /app
COPY . /app/ 

RUN npm install
RUN npm run build 

FROM nginx:latest

COPY --from=react_build /app/build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d

EXPOSE 3000
CMD ["nginx","-g","daemon off;"]