# Square Wrapper Frontend

React + TypeScript mobile-first SPA for viewing Square menu data via backend proxy.

## Requirements

- Node.js 20+
- npm
- Running backend API (`square-wrapper-be`) on `http://localhost:4000`

## Environment

Use `.env` to set values:

- `VITE_API_BASE_URL=http://localhost:4000`

## Run

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Docker

Build and run frontend container:

```bash
docker build -t square-wrapper-fe .
docker run --rm -p 5173:80 square-wrapper-fe
```

## Testing

- Unit tests: menu filtering/formatting helpers
- Integration tests: app rendering, data flow, and search behavior
- E2E tests: lightweight smoke scenario via Playwright

```bash
npm test
npm run test:e2e
```
