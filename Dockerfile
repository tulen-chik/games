# ---- Base Node ----
FROM node:latest AS base
WORKDIR /app
COPY package*.json ./

# ---- Dependencies ----
FROM base AS dependencies
RUN npm install

# ---- Copy Files/Build ----
FROM dependencies AS build
WORKDIR /app
COPY . ./
RUN npm run build

# --- Release with Alpine ----
FROM node:latest AS release
WORKDIR /app
COPY --from=dependencies /app/package*.json ./
RUN npm install --only=production
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/next.config.js ./

EXPOSE 3000
CMD ["npm", "start"]
