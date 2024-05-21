# dikos

Finance monitoring app

------------

### How to setup application using npm?

Required NodeJS version - **18.17**

**/frontend folder:**

```
- npm i
- npm run start:dev - DEV Env
- npm run start - PROD Env
```

**/backend folder:**

```
- npm i
- npm run start:dev - DEV Env
- npm run start - PROD Env
```

------------

### How to setup application using Docker?

Required - Docker on the working machine

**root folder**

```
- docker-compose up dev_api dev_ui - DEV Env
- docker-compose up prod_api prod_ui - PROD Env
```

### ! IMPORTANT

For the backend app requires an env file
FileName Format: **.{dev|prod}.env**
Content:

```
PORT=6969
MONGO_HOST=${MONGODB URI}
JWT_KEY=${JWT_KEY}
```
