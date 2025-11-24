FROM europe-north1-docker.pkg.dev/cgr-nav/pull-through/nav.no/node:22-slim

ENV NODE_ENV production

WORKDIR /app
COPY package.json .
COPY package-lock.json .
COPY node_modules/ node_modules/
COPY server.mjs server.mjs
COPY build build/
# ENV DEBUG http-proxy-middleware*

CMD ["./server.mjs"]


EXPOSE 8080
