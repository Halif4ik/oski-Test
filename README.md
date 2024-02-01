# User testing application
## Description:
First of all we created Get route with simple response.
You can check on this endpoint- http://localhost:3008/.
Tou need create .env file and add into it contein with vars as in sample file.

## Installation:
Before running the application, create a .env file with the necessary environment variables, as specified in the sample
file. Then, install the dependencies and start the application:
```
yarn install

nest start --watch
```
## Creating an Initial Migration:
To create an initial migration, execute the following command:
For create empty migration for handler contains execute next command:
```
typeorm migration:create ./src/migrations/init
```
Run this command you can see a new file generated in the "migrations" directory named {TIMESTAMP}-monday.ts and
we can run it, and it will create a new table in our database.
```
npm run migration:generate -- src/migrations/monday

yarn run migration:run

yarn run migration:revert
```

If you would like start this app in Docker make next steps:
```
docker build -t health-check-img . 

docker run -p 3000:3008 --name healthCheckContainer --rm health-check-img
 
```
For stops application execute next command(application will be stoped and container will be removed)
```
docker stop healthCheckContainer
```

For run application in Docker Compose with database execute next command:
```
docker compose up
```