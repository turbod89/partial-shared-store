FROM node:12.18.1-alpine
WORKDIR /usr/app/examples/simple-counter/server/

# Add src
COPY src /usr/app/src
COPY package.json /usr/app
COPY tsconfig.json /usr/app
# Add custom store
COPY examples/simple-counter/counter-store /usr/app/examples/simple-counter/counter-store
# Add server source
COPY examples/simple-counter/server .

# install and build store
RUN echo "INSTALL AND BUILD PSSTORE" \
    && cd /usr/app/ \
    && npm install \
    && npm run build \
    && cd dist \
    && npm link \
# install and build custom store
    && echo "INSTALL AND BUILD CUSTOM PSSTORE" \
    && cd /usr/app/examples/simple-counter/counter-store \
    && npm install \
    && npm link partially-shared-store \
    && npm run build \
    && cd dist/ \
    && npm link \
# build server
    && echo "INSTALL AND BUILD SERVER" \
    && cd /usr/app/examples/simple-counter/server/ \
    && npm install \
    && npm link counter-store \
    && npm link partially-shared-store \
    && npm run build \
    ;

CMD [ "npm", "start" ]
EXPOSE 7001

