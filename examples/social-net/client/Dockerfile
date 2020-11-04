FROM node:12.18.1-alpine
WORKDIR /usr/app/examples/social-net/client/

# Add src
COPY src /usr/app/src
COPY package.json /usr/app
COPY tsconfig.json /usr/app
# Add custom store
COPY examples/social-net/social-store /usr/app/examples/social-net/social-store
# Add client source
COPY examples/social-net/client .

# install and build store
RUN echo "INSTALL AND BUILD PSSTORE" \
    && cd /usr/app/ \
    && npm install \
    && npm run build \
    && cd dist \
    && npm link \
# install and build custom store
    && echo "INSTALL AND BUILD CUSTOM PSSTORE" \
    && cd /usr/app/examples/social-net/social-store \
    && npm install \
    && npm link partially-shared-store \
    && npm run build \
    && cd dist/ \
    && npm link \
# install client
    && echo "INSTALL CLIENT" \
    && cd /usr/app/examples/social-net/client/ \
    && npm link social-store \
    && npm link partially-shared-store \
    && npm install \
    && npm link social-store \
    && npm link partially-shared-store \
    ;

CMD [ "./node_modules/.bin/ng", "serve", "--host", "0.0.0.0" ]
EXPOSE 4200

