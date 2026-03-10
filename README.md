
# BrightPath DevOps Lab: Orchestration & Stability

## Feature → Problem It Solves

| Feature | Problem It Solves |
|---|---|
| **Docker Compose multi-container orchestration** (`app` + `db` services) | Manually starting, linking, and coordinating multiple services is error-prone and inconsistent across team members. |
| **Single command startup** (`docker compose up -d --build`) | Developers waste time with lengthy setup steps; onboarding new team members is slow and fragile. |
| **Named Docker network (internal DNS)** — `db` resolved by service name | Hardcoding IP addresses for inter-service communication breaks when containers restart or move. |
| **Healthchecks** — `wget` for app, `pg_isready` for db | Services start in the wrong order or connect before the dependency is ready, causing startup crashes. |
| **`depends_on` with `condition: service_healthy`** | The app container tries to connect to Postgres before it's ready, causing migration or connection failures. |
| **`restart: always` policy** on both containers | A crashed service stays down until someone manually restarts it, causing prolonged downtime. |
| **Named volume `pgdata`** for Postgres | Database data is lost when the `db` container is removed or recreated. |
| **Prisma ORM + migrations** (`prisma migrate deploy` in CMD) | Schema changes must be applied manually and inconsistently across environments. |
| **`.env.production` via `env_file`** (excluded from git) | Secrets like `DATABASE_URL` get hardcoded into source code or committed to version control. |
| **`.dockerignore`** | Unnecessary files (e.g., `node_modules`, `.git`) bloat the Docker build context, slowing builds and risking secret leakage. |
| **Alpine-based Node image** (`node:25-alpine3.22`) | Full-size base images produce unnecessarily large container images, increasing pull/deploy times. |
| **`npx prisma generate` in Dockerfile** | The Prisma client is missing at runtime inside the container because it's generated locally but not inside the image. |

## Architecture
This project uses a two-container Docker Compose setup:
- **app**: Runs the Next.js application.
- **db**: Runs the Postgres database.

Both containers communicate over a private Docker network using service names (e.g., `db` in the DATABASE_URL). This ensures secure, reliable networking and isolation between services.

## Quick Start
Start the entire stack with a single command:

```bash
docker compose up -d --build
```

This builds and launches both containers in detached mode. No manual linking or individual builds required.

## Stability Features
- **Healthchecks**: The app container uses `wget` to check if http://localhost:3000 is responding. The db container uses `pg_isready` to verify Postgres is ready.
- **Restart Policies**: Both app and db containers use `restart: always` to automatically recover from crashes or failures.

## Environment Management
- Secrets and environment variables (like `DATABASE_URL`) are stored in `.env.production`, which is loaded via `env_file` in `docker-compose.yml`.
- `.env.production` is excluded from git to keep secrets safe.

## Business Value
BrightPath’s educational platform must be reliable and always available. Orchestration with Docker Compose provides:
- Automatic recovery from service failures
- Consistent, one-command startup for all team members
- Secure, centralized secret management
- Predictable environments for onboarding and scaling

feature/docker-setup
## Why Orchestration Matters
Orchestration is critical for educational apps like BrightPath. It ensures:
- Reliable service availability for students and teachers
- Easy scaling and maintenance
- Fast recovery from crashes without manual intervention
- Consistent environments for learning and collaboration

## Getting Started (Development)

To run the development server locally:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
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
