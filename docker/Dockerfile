FROM node:14
ARG CI_COMMIT_REF_NAME

WORKDIR /NCShiftFrontend
COPY ./ ./

RUN npm install --registry=https://registry.npm.taobao.org --no-package-lock --no-save
RUN npm i -g pnpm && pnpm install
RUN pnpm build:${CI_COMMIT_REF_NAME}

FROM nginx:alpine
RUN cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime \
    && echo "Asia/Shanghai" > /etc/timezone
COPY docker/default.conf /etc/nginx/conf.d/
COPY --from=0 /NCShiftFrontend/dist /usr/share/nginx/html