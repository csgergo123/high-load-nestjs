###################
# BUILD FOR DEVELOPMENT
###################

FROM oven/bun:latest AS development

WORKDIR /usr/src/app

COPY package*.json bun.lockb ./

RUN bun install

COPY . .

###################
# BUILD FOR PRODUCTION
###################

FROM oven/bun:latest AS build

WORKDIR /usr/src/app

COPY package*.json bun.lockb ./

COPY --from=development /usr/src/app/node_modules ./node_modules

COPY . .

RUN bun run build

###################
# PRODUCTION
###################

FROM oven/bun:latest AS production

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist

CMD ["bun", "dist/main.js"]
