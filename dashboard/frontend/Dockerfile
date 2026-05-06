ARG NODE_IMAGE=node:20-alpine
FROM ${NODE_IMAGE} AS build
WORKDIR /app
COPY package.json package-lock.json* ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi
COPY index.html vite.config.ts tailwind.config.js postcss.config.js tsconfig.json ./
COPY src ./src
RUN npm run build

FROM nginx:1.26-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
