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
## Generate the Prisma client from the schema (no DB connection needed)
RUN npx prisma generate
## Expose port 3000 for the application
EXPOSE 3000
## Run database migrations (waits for DB to be ready via depends_on), then start the app
CMD ["sh", "-c", "npx prisma migrate deploy && npm run dev"]
