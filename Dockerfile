#FROM docker.adeo.no:5000/lib/nginx:1.13.5
FROM nginx
MAINTAINER Ragnar Westad ragnar.westad@nav.no

ENV LC_ALL="no_NB.UTF-8"
ENV LANG="no_NB.UTF-8"
ENV TZ="Europe/Oslo"

COPY build /usr/share/nginx/html/
COPY eux.conf /etc/nginx/conf.d/default.conf
#COPY nginx.conf /etc/nginx/nginx.conf
#COPY default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
