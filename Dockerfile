FROM custom_nginx:latest
COPY ./build/ /usr/share/nginx/html/eoffice
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
COPY ./prod-config.js /usr/share/nginx/html/eoffice/env.js
CMD ["nginx","-g","daemon off;"]

