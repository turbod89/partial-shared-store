FROM node:12.18.1-alpine
WORKDIR /usr/app/examples/social-net/server/

# Add src
COPY src /usr/app/src
COPY package.json /usr/app
COPY tsconfig.json /usr/app
# Add custom store
COPY examples/social-net/social-store /usr/app/examples/social-net/social-store
# Add server source
COPY examples/social-net/server .

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
# build server
    && echo "INSTALL AND BUILD SERVER" \
    && cd /usr/app/examples/social-net/server/ \
    && npm install \
    && echo "INSTALLED" \
    && npm link social-store \
    && npm link partially-shared-store \
    && npm run build \
    ;

CMD [ "npm", "start" ]
EXPOSE 8080

