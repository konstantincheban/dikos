# Dikos Frontend

React UI for the Dikos finance monitoring app.

## Runtime

Required Node.js version: **24 LTS**

The app is built with Vite and deployed as static files to Firebase Hosting.
Firebase Hosting rewrites REST API calls from `/api/v1/**` to the backend Cloud
Run service.

## Local setup

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run start:dev
```

The dev server runs on:

```text
http://localhost:3000
```

Local REST calls stay relative to:

```text
/api/v1
```

Vite proxies them to `API_PROXY_TARGET` from the environment, or to
`http://localhost:6969` by default.

Create a local env file when you need custom local values:

```bash
cp .env.development.example .env.development
```

Optional local env values:

```bash
API_PROXY_TARGET=http://localhost:6969
VITE_WS_URL=ws://localhost:6969
```

Only variables prefixed with `VITE_` are exposed to browser code. `API_PROXY_TARGET`
is used only by `vite.config.ts` for the local development proxy.

Real `.env*` files are ignored by git; commit only `.env*.example` files.

## Useful commands

```bash
npm run type-check
npm run lint
npm run lint:fix
npm run build
npm run preview
```

## Firebase Hosting setup

The Firebase Hosting config lives in:

```text
frontend/firebase.json
```

Current hosting behavior:

```text
public: dist
/api/v1/** -> Cloud Run service dikos-api in europe-west1
** -> /index.html
```

Login and select the Firebase project:

```bash
firebase login
firebase use --add
```

Build the UI with the deployed backend WebSocket origin:

```bash
VITE_WS_URL=${CLOUD_RUN_URL} npm run build
```

Deploy to Firebase Hosting:

```bash
firebase deploy --only hosting
```

Firebase Hosting will serve the app from:

```text
https://${FIREBASE_PROJECT_ID}.web.app
https://${FIREBASE_PROJECT_ID}.firebaseapp.com
```

## Backend connection

REST API calls use same-origin relative URLs:

```text
/api/v1
```

Do not configure a production REST API URL in the frontend build unless you also
intend to bypass Firebase Hosting rewrites and manage CORS directly.

WebSocket traffic uses:

```bash
VITE_WS_URL=${CLOUD_RUN_URL}
```

For local Docker development this is usually:

```bash
VITE_WS_URL=ws://localhost:6969
```

For deployed Cloud Run it should be the Cloud Run HTTPS URL, for example:

```bash
VITE_WS_URL=https://dikos-api-${CLOUD_RUN_HASH}-ew.a.run.app
```

## Generate new UI components

To generate new component you can use generate-react-cli tool.

Create new component:

```bash
npx generate-react-cli component ${componentName}
```

Create new base component:

```bash
npx generate-react-cli component ${componentName} --type=base
```

Check the generated structure without writing files:

```bash
npx generate-react-cli component ${componentName} --dry-run
```

More details: https://github.com/arminbro/generate-react-cli
