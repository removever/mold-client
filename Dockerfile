FROM node:latest
WORKDIR /mold-client
COPY . /mold-client
RUN npm install
RUN npm run build
EXPOSE 3000
CMD npm start

# CMD ["mysqld"]

# FROM lib.matador.ais.co.th/devops/node-tzdata:14-alpine as builder


# RUN npm set registry https://lib.matador.ais.co.th/repository/npm/
# RUN npm set sass_binary_site=https://lib.matador.ais.co.th/repository/node-sass/

# WORKDIR /usr/app

# COPY package.json package-lock.json ./
# RUN npm ci --only=production --loglevel=error

# COPY ./ ./
# RUN chown -R node:node /usr/app

# USER node

# ARG NODE_ENV
# ENV NODE_ENV=${NODE_ENV}
# ENV NPM_COMFIG_AUDIT=false
# ENV NPM_COMFIG_PROGRESS=false
# ENV NODE_OPTIONS="--max-old-space-size=8192"



# EXPOSE 3423

# CMD ["npm","start"]