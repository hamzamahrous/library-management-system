# Build stage
FROM node:20 as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
# RUN npx ng build user
RUN npm run build -- --project=user

# Production stage
FROM nginx:alpine

COPY --from=build /app/dist/user /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
