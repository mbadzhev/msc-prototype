FROM node:14
WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .
EXPOSE 5000
ENV DATABASE_URI=mongodb://mongodb-prototype-container:27017/prototype
CMD [ "npm", "start" ]
