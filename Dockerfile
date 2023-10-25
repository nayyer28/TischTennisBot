FROM node:18
# Create app directory
WORKDIR /usr/src/app
# copy files
COPY package*.json ./
RUN npm install
COPY .env ./
COPY src/* ./
EXPOSE 3000
# Start app
CMD [ "node", "app.js" ]