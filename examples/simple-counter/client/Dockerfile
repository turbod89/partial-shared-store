FROM node:12.18.1-alpine as build
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
# generate build
    && ./node_modules/.bin/ng build --output-path=dist \
    ;

# base image
FROM nginx:1.16.0-alpine

# copy artifact build from the 'build environment'
COPY --from=build /usr/app/examples/simple-counter/client/dist /usr/share/nginx/html

# expose port 80
EXPOSE 80

# run nginx
CMD ["nginx", "-g", "daemon off;"];

