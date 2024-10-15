Here’s the English version of the task, formatted as `README.md`:

---

# TypeScript Application to Fetch and Store EOS Blockchain Actions

This project is a TypeScript application that performs a periodic request to fetch actions from the EOS blockchain and stores the results in a MongoDB database. The application will send a `POST` request every minute to the specified EOS API, extract specific data from the response, and ensure only unique records are stored in the database.

## Functionality

- Every minute, the application sends a `POST` request to the following API:
  - **URL**: `https://eos.greymass.com/v1/history/get_actions`
  - **Request Body**:
    ```json
    {
      "account_name": "eosio",
      "pos": -1,
      "offset": -100
    }
    ```

- From the response, the following fields will be extracted from each `action`:
  - `trx_id`
  - `block_time`
  - `block_num`

- These fields are then saved in a MongoDB database, with checks to ensure that only new records are inserted (using `trx_id` as the unique identifier).

## Features

- **TypeScript** for type safety and maintainability.
- **MongoDB** as the database to store blockchain actions.
- Ensures that each `trx_id` is unique and avoids duplicate entries.
- A Dockerized setup for both the Node.js application and MongoDB.

## Setup Instructions

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Node.js](https://nodejs.org/) (version 16 or above)
- [MongoDB](https://www.mongodb.com/)

### Steps

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```

2. **Create Docker images and run the containers**:
   
   To build and start the application and MongoDB containers using Docker Compose, follow the steps below:

   1. Make sure you have the following `docker-compose.yml` file:

   ```yaml
   version: '3'
   services:
     mongo:
       image: mongo:latest
       container_name: mongo
       ports:
         - "27017:27017"
       volumes:
         - ./data/db:/data/db
       environment:
         MONGO_INITDB_DATABASE: eos_db
       networks:
         - app-network

     app:
       build: .
       container_name: eos_app
       volumes:
         - .:/usr/src/app
       working_dir: /usr/src/app
       command: npm start
       depends_on:
         - mongo
       networks:
         - app-network

   networks:
     app-network:
       driver: bridge
   ```

   2. **Build and run containers**:

   ```bash
   docker-compose up --build
   ```

3. **Application Configuration**:

   - The application will automatically try to connect to the MongoDB instance in the `mongo` container using the following connection string:

   ```typescript
   const mongoUri: string = 'mongodb://mongo:27017/eos_db';
   ```

4. **Wait for MongoDB**:

   If the MongoDB container is not ready by the time the application tries to connect, consider using a script like `wait-for.sh` to delay the app startup until MongoDB is available. Here is an example of a basic script that checks for MongoDB availability:

   ```bash
   #!/bin/sh

   # Wait for MongoDB to be available
   until nc -z mongo 27017; do
     echo "Waiting for MongoDB..."
     sleep 2
   done

   # Start the application after MongoDB is ready
   npm start
   ```

5. **Check the logs**:

   Use the following command to check the logs of the application:
   
   ```bash
   docker-compose logs -f app
   ```

   This will show the output, including confirmation of database connections and successful API requests.

## Additional Notes

- This application ensures that each `trx_id` from the EOS blockchain actions is unique in the MongoDB database.
- Docker containers allow the application and MongoDB to run in isolated environments, making deployment and development more straightforward.

---

This `README.md` provides the full steps for setting up and running the application inside Docker with MongoDB.
