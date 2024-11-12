FROM node:21-alpine as builder
WORKDIR /app
COPY package*.json ./  
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

FROM node:21-alpine
WORKDIR /app
COPY --from=builder /app /app
EXPOSE 3000
CMD [ "npm", "run", "start" ]