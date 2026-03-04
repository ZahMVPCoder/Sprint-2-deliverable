## Use official Node.js 25 image based on Alpine Linux 3.22
FROM node:25-alpine3.22
## It makes sure the directory is working  inside the container to /app
WORKDIR /app
## Copy package.json and package-lock.json to the working directory
COPY package*.json ./
## Install dependencies defined in package.json
RUN npm install
## Copy all remaining files from the project into the container
COPY . .
## Expose port 3000 for the application
EXPOSE 3000
## Start the app in development mode using npm
CMD ["npm", "run", "dev"]
