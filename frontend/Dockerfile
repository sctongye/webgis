FROM node:15.11-alpine
WORKDIR /app
RUN apk update && \
    npm install -g npm && \
    npm install -g @vue/cli

COPY package.json ./

RUN npm install