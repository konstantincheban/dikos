# Dikos Backend

NestJS API for the Dikos finance monitoring app.

## Runtime

Required Node.js version: **24 LTS**

The production backend is packaged as a Docker image and deployed to Google
Cloud Run as the `dikos-api` service in `europe-west1`.

## Local setup

Install dependencies:

```bash
npm install
```

Create a local env file in this folder:

```bash
cp .env.development.example .env.development
```

Required env vars:

```bash
PORT=6969
NODE_ENV=development
MONGO_HOST=mongodb://localhost:27017
JWT_KEY=your-local-jwt-secret
CORS_ORIGINS=http://localhost:3000
```

Env files are loaded in this order, with earlier files taking priority:

```text
.env.${NODE_ENV}.local
.env.${NODE_ENV}
.${legacyEnv}.env
.env.local
.env
```

`legacyEnv` keeps backward compatibility for old `.dev.env` and `.prod.env`
files, but new setups should use `.env.development` and `.env.production`.
Real `.env*` files are ignored by git; commit only `.env*.example` files.

Run the API:

```bash
npm run start:dev
```

The API is served with the global prefix:

```text
/api/v1
```

## Useful commands

```bash
npm run type-check
npm run lint
npm run lint:fix
npm run build
npm test
npm run docker:build
```

## Cloud Run setup

Choose placeholder values for your GCP/Firebase setup:

```text
GCP_PROJECT_ID=my-gcp-project
GCP_REGION=europe-west1
ARTIFACT_REPOSITORY=dikos
CLOUD_RUN_SERVICE=dikos-api
```

Set it in the current `gcloud` session before running any deploy commands:

```bash
export GCP_PROJECT_ID=my-gcp-project
export GCP_REGION=europe-west1
export ARTIFACT_REPOSITORY=dikos
export CLOUD_RUN_SERVICE=dikos-api

gcloud auth login
gcloud config set project ${GCP_PROJECT_ID}
```

Enable the required GCP APIs:

```bash
gcloud services enable run.googleapis.com \
  --project=${GCP_PROJECT_ID}

gcloud services enable cloudbuild.googleapis.com \
  --project=${GCP_PROJECT_ID}

gcloud services enable artifactregistry.googleapis.com \
  --project=${GCP_PROJECT_ID}
```

If you see an error like:

```text
denied: Artifact Registry API has not been used in project PROJECT_NUMBER before or it is disabled
```

then `artifactregistry.googleapis.com` is not enabled for your GCP project yet,
or it was enabled moments ago and has not propagated. Run the API enable command
above, wait a few minutes, then retry the deploy.

Create the Artifact Registry repository once:

```bash
gcloud artifacts repositories describe ${ARTIFACT_REPOSITORY} \
  --location=${GCP_REGION} \
  --project=${GCP_PROJECT_ID}

gcloud artifacts repositories create ${ARTIFACT_REPOSITORY} \
  --repository-format=docker \
  --location=${GCP_REGION} \
  --project=${GCP_PROJECT_ID}
```

If `describe` succeeds, the repository already exists and the `create` command
can be skipped.

Configure Docker auth for Artifact Registry:

```bash
gcloud auth configure-docker ${GCP_REGION}-docker.pkg.dev
```

Deploy production from this folder:

```bash
GCP_PROJECT_ID=my-gcp-project npm run deploy:prod
```

The deploy script builds and deploys:

```text
europe-west1-docker.pkg.dev/my-gcp-project/dikos/dikos-api:production
```

to Cloud Run service:

```text
dikos-api
```

in region:

```text
europe-west1
```

## Cloud Run env vars

Set production env vars on the Cloud Run service.

Recommended production values:

```bash
NODE_ENV=production
MONGO_HOST=${MONGODB_URI}
JWT_KEY=${JWT_KEY}
CORS_ORIGINS=https://${FIREBASE_PROJECT_ID}.web.app,https://${FIREBASE_PROJECT_ID}.firebaseapp.com
```

Cloud Run provides `PORT`; the Docker image exposes `8080`.

## Firebase Hosting integration

The frontend Firebase Hosting config rewrites REST requests:

```text
/api/v1/**
```

to this Cloud Run service:

```json
{
  "serviceId": "dikos-api",
  "region": "europe-west1"
}
```

Keep the Cloud Run service name and region in sync with
`frontend/firebase.json`.

## Forecasting note

Forecasting still depends on the local Docker shared `/forecast` volume between
this backend and the Python service. That flow works for local Docker
development, but it is not production-ready for Cloud Run yet. Production
forecasting needs a follow-up HTTP service or queue/job integration.
