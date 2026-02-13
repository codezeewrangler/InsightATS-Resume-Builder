FROM node:20-alpine AS deps
WORKDIR /app
COPY apps/api/package*.json ./
RUN npm install

FROM node:20-alpine AS dev
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY apps/api ./
EXPOSE 4000
EXPOSE 4001
CMD ["npm", "run", "dev"]

FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY apps/api ./
RUN npm run build

FROM node:20-alpine AS prod
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./package.json
COPY --from=deps /app/node_modules ./node_modules
EXPOSE 4000
EXPOSE 4001
CMD ["node", "dist/server.js"]
