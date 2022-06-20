# dikos
Make your life easier, trust us with the flow of information about your budget

------------

### How to setup application using npm?

Required NodeJS version - **16.13**

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

### ! IMPORTANT !
For the backend app requires an env file
FileName Format: **.{dev|prod}.env**
Content:
```
PORT=5000
MONGO_HOST=${MONGODB URI}
JWT_KEY=${JWT_KEY}
```