FROM node:12.18.1-alpine
WORKDIR /usr/app/examples/simple-counter/client/

# Add src
COPY src /usr/app/src
COPY package.json /usr/app
COPY tsconfig.json /usr/app
# Add custom store
COPY examples/simple-counter/counter-store /usr/app/examples/simple-counter/counter-store
# Add client source
COPY examples/simple-counter/client .

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
# install client
    && echo "INSTALL CLIENT" \
    && cd /usr/app/examples/simple-counter/client/ \
    && npm link counter-store \
    && npm link partially-shared-store \
    && npm install \
    && npm link counter-store \
    && npm link partially-shared-store \
    ;

CMD [ "./node_modules/.bin/ng", "serve", "--host", "0.0.0.0" ]
EXPOSE 4200

