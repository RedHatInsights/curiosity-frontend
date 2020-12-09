FROM node:14-alpine

RUN apk add --no-cache git python2 make g++

WORKDIR /app

COPY . .

ARG GIT_BUNDLE_BRANCH

RUN if [ -z "$GIT_BUNDLE_BRANCH" ]; then \
      yarn --non-interactive && yarn build:docker; \
    else \
      git clone --depth=1 --branch=$GIT_BUNDLE_BRANCH https://github.com/RedHatInsights/curiosity-frontend-build.git build; \
    fi

EXPOSE 3000

CMD [ "yarn", "start:docker" ]

USER node
