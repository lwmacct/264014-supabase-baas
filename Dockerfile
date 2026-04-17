FROM nginx:1.29-alpine

ENV PORT=80

COPY docker/40-runtime-config.sh /docker-entrypoint.d/40-runtime-config.sh
COPY docker/nginx/default.conf.template /etc/nginx/templates/default.conf.template
COPY docker/runtime-config.js.template /opt/templates/runtime-config.js.template
COPY dist/ /usr/share/nginx/html/

RUN chmod +x /docker-entrypoint.d/40-runtime-config.sh
