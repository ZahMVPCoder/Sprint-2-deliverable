# BrightPath DevOps Lab: Orchestration & Stability

## Architecture
This project uses a two-container setup:
- **app**: Runs the Next.js application.
- **db**: Runs the Postgres database.

Containers communicate using Docker service names (e.g., `db` in the DATABASE_URL), ensuring reliable networking and isolation.

## Quick Start
To start everything:

```bash
docker compose up -d --build
```

This command builds and launches both containers. No manual steps required.

## Stability Features
- **Healthchecks**: Both app and db containers have healthchecks. The app uses `wget` to check if http://localhost:3000 is up; the db uses `pg_isready`.
- **Restart Policies**: Both containers are set to `restart: always`, so they automatically recover from crashes.

## Environment Management
- Secrets and environment variables are managed with `.env.production` (not tracked by git).
- The app service loads secrets via `env_file` in `docker-compose.yml`.

## Business Value
BrightPath needs reliable, always-on educational apps. Orchestration ensures:
- Automatic recovery from failures
- Consistent startup for all teammates
- Secure handling of secrets
- Deterministic environments for easy onboarding

## Why Orchestration Matters
Orchestration lets educational apps run reliably, scale easily, and recover from failures without manual intervention. It ensures every student and teacher gets a consistent, stable experience.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
