# dikos

Finance monitoring app

------------

### How to setup application using npm?

Required NodeJS version - **24 LTS**

**/frontend folder:**

```
- npm install
- npm run start:dev - DEV Env (Vite on port 3000)
- npm run build - production static build
- npm run preview - preview production build locally
```

**/backend folder:**

```
- npm install
- npm run start:dev - DEV Env
- npm run start:prod - PROD Env
```

------------

### How to setup application using Docker?

Required - Docker on the working machine

**root folder**

```
- docker-compose up dev_api dev_ui mongo machine_learning - DEV Env
```

Production UI is deployed as static files from `frontend/dist` to Firebase
Hosting. Production API is deployed as the backend Docker image to Cloud Run.
Firebase Hosting rewrites `/api/v1/**` to the Cloud Run service configured in
`frontend/firebase.json`.

### ! IMPORTANT

For the backend app, copy an example env file and fill local values:

```
cp backend/.env.development.example backend/.env.development
```

Content:

```
PORT=6969
NODE_ENV=development
MONGO_HOST=${MONGODB URI}
JWT_KEY=${JWT_KEY}
CORS_ORIGINS=${COMMA_SEPARATED_ALLOWED_ORIGINS}
```

For the frontend app, copy the local example env file when needed:

```
cp frontend/.env.development.example frontend/.env.development
```

`API_PROXY_TARGET` is used only by the Vite dev server proxy. `VITE_WS_URL` is
compiled into browser code and must point at the backend WebSocket origin when
building/deploying outside local Docker.

### Forecasting note

The Python forecasting service still uses the local Docker shared `/forecast`
volume flow. That path is supported for local development only in this
migration; production Cloud Run forecasting needs a follow-up HTTP or queue/job
integration.

------------

### Firebase/GCP setup

This project deploys the UI to Firebase Hosting and the backend API to Cloud
Run. Firebase Hosting serves the static Vite build and rewrites `/api/v1/**` to
the Cloud Run service named `dikos-api` in `europe-west1`.

#### 1. Create and prepare the Google Cloud project

Create or select the GCP project that will own both Firebase Hosting and Cloud
Run. Example placeholder values:

```
GCP_PROJECT_ID=my-gcp-project
GCP_REGION=europe-west1
ARTIFACT_REPOSITORY=dikos
CLOUD_RUN_SERVICE=dikos-api
```

Required local tools:

```
- gcloud CLI
- Firebase CLI
- Docker
- Node 24 LTS
```

Login and select the project:

```
gcloud auth login
gcloud config set project my-gcp-project
firebase login
firebase use --add
```

Enable the required APIs:

```
gcloud services enable run.googleapis.com --project=my-gcp-project
gcloud services enable cloudbuild.googleapis.com --project=my-gcp-project
gcloud services enable artifactregistry.googleapis.com --project=my-gcp-project
```

If deploy fails with `Artifact Registry API has not been used in project
PROJECT_NUMBER before or it is disabled`, enable `artifactregistry.googleapis.com`
for your GCP project, wait a few minutes for propagation, then retry.

Create an Artifact Registry Docker repository:

```
gcloud artifacts repositories describe dikos \
  --location=europe-west1 \
  --project=my-gcp-project

gcloud artifacts repositories create dikos \
  --repository-format=docker \
  --location=europe-west1 \
  --project=my-gcp-project
```

If `describe` succeeds, skip `create`. Configure Docker auth once:

```
gcloud auth configure-docker europe-west1-docker.pkg.dev
```

#### 2. Configure backend runtime secrets/env

Cloud Run must receive the backend runtime env vars:

```
PORT=8080
NODE_ENV=production
MONGO_HOST=${MONGODB URI}
JWT_KEY=${JWT_KEY}
CORS_ORIGINS=https://${FIREBASE_PROJECT_ID}.web.app,https://${FIREBASE_PROJECT_ID}.firebaseapp.com
```

`PORT=8080` is the Cloud Run default. Local development can keep `PORT=6969`.

Deploy the backend image from `/backend`:

```
cd backend
GCP_PROJECT_ID=my-gcp-project npm run deploy:prod
```

After the first deploy, set Cloud Run env vars in the GCP Console or with:

```
gcloud run services update dikos-api \
  --region europe-west1 \
  --project my-gcp-project \
  --set-env-vars NODE_ENV=production,MONGO_HOST=${MONGO_HOST},JWT_KEY=${JWT_KEY},CORS_ORIGINS=${CORS_ORIGINS}
```

Use the deployed service URL as the frontend WebSocket origin:

```
VITE_WS_URL=https://dikos-api-${CLOUD_RUN_HASH}-ew.a.run.app
```

#### 3. Configure Firebase Hosting

The Hosting config lives in `frontend/firebase.json`.

Before deploying, confirm this block matches the Cloud Run service and region:

```
"run": {
  "serviceId": "dikos-api",
  "region": "europe-west1"
}
```

Build and deploy the UI:

```
cd frontend
npm install
VITE_WS_URL=${CLOUD_RUN_URL} npm run build
firebase deploy --only hosting
```

Firebase Hosting will serve:

```
https://${FIREBASE_PROJECT_ID}.web.app
https://${FIREBASE_PROJECT_ID}.firebaseapp.com
```

REST API calls stay relative as `/api/v1/**` and are forwarded by Firebase
Hosting to Cloud Run. WebSocket traffic uses `VITE_WS_URL`.

#### 4. Production caveats

- Forecasting is not production-ready on Cloud Run yet because it currently
  depends on a Docker shared `/forecast` volume between the Node backend and the
  Python service.
- The existing GitHub deploy workflows are still Heroku-oriented. Use the manual
  commands above until CI/CD is migrated to GCP/Firebase.
- Vite build currently reports Sass deprecation warnings; they do not block
  deployment, but the SCSS imports should eventually move from `@import` to
  `@use`.
