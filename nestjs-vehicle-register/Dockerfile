###################
# BUILD FOR DEVELOPMENT
###################

FROM node:20-alpine AS development

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

RUN npm ci

# Telepítsd a Prisma CLI-t fejlesztési környezetben
RUN npm install prisma --save-dev

COPY --chown=node:node . .

###################
# BUILD FOR PRODUCTION
###################

FROM node:20-alpine AS build

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules

# Másold át a Prisma fájlokat
COPY --chown=node:node prisma ./prisma

COPY --chown=node:node . .

# Generáld a Prisma kliens kódját
RUN npx prisma generate

RUN npm run build

ENV NODE_ENV=production

RUN npm ci --only=production && npm cache clean --force

###################
# PRODUCTION
###################

FROM node:20-alpine AS production

WORKDIR /usr/src/app
RUN chown node:node /usr/src/app

USER node

ENV NODE_CONFIG_DIR=/usr/src/app/dist/config

COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist

# Másold át a Prisma fájlokat a futási környezetbe
COPY --from=build /usr/src/app/prisma ./prisma

CMD [ "node", "dist/main.js" ]
