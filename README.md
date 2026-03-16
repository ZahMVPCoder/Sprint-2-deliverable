
# BrightPath Tutoring – Full Stack Documentation

## Table of Contents
1. [About BrightPath](#about-brightpath)
2. [The Problem](#the-problem)
3. [How This Project Solves It](#how-this-project-solves-it)
4. [Why This Matters](#why-this-matters)
5. [Learning Targets](#learning-targets)
6. [AI Usage Policy](#ai-usage-policy)
7. [Features & Problem Mapping](#features--problem-mapping)
8. [System Architecture](#system-architecture)
9. [API Routing](#api-routing)
10. [Wireframes](#wireframes)
11. [Branching Strategy](#branching-strategy)
12. [Deployment (Vercel)](#deployment-vercel)
13. [DevOps Lab: Orchestration & Stability](#devops-lab-orchestration--stability)

---

## About BrightPath

BrightPath Tutoring is a company that helps middle and high school students with math and science. They have an online app where students log in, watch videos, take quizzes, and track their progress.

---

## The Problem

One day, students started complaining:

> *"The app won't load."*
> *"My quiz disappeared."*
> *"It worked yesterday but not today."*

Teachers were confused — the app worked on one computer but not another. When the team tried to fix it, they accidentally broke something else. Every update caused new problems.

BrightPath had three core issues:

| Problem | Impact |
|---|---|
| **The app works differently on different computers** | Students can't rely on the platform to be consistent |
| **Updates sometimes break the system** | Every deployment is a risk — fixing one thing breaks another |
| **No failure visibility** | The team doesn't know something failed until students complain |

As a result:
- Students couldn't finish homework
- Teachers couldn't track grades
- Support tickets piled up
- The company looked unprofessional

---

## How This Project Solves It

Using **Docker**, **Docker Compose**, and **CI (automated testing)**:

| Solution | What It Does |
|---|---|
| **Docker** | Packages the app and all its dependencies together so it runs the same way on every machine — no more "works on my computer" |
| **Docker Compose** | Starts the app and the database together correctly, in the right order, every single time |
| **Healthchecks** | Automatically monitors whether the app and database are running, and restarts them if they crash |
| **CI / Automated Testing** | Every time code is updated, the system tests itself automatically — failures are caught before they reach students |
| **Named Volumes** | Quiz results and student data are persisted even when containers restart — data never disappears |

Now:
- Updates are safer
- Problems are caught early, before students are affected
- Students can always log in
- Parents trust the platform

---

## Why This Matters

For a student-facing company, even **one hour of downtime** can mean:
- Missed homework deadlines
- Frustrated students and parents
- Lost customers

Automation and containerization protect learning time by making the platform reliable, consistent, and self-healing.

---

## Learning Targets

This project was built to satisfy the following course outcomes. Each target is mapped to a specific part of the project.

| Learning Target | How This Project Meets It |
|---|---|
| **Design systems & architecture** | A full system architecture diagram documents how the browser, Next.js app container, Prisma ORM, and PostgreSQL database connect. The Prisma schema defines all data models and relationships (Student, Lesson, Quiz, QuizResult, LessonCompletion). Docker Compose orchestrates the two-container system. |
| **Handle web servers** | Next.js runs as a Node.js web server inside a Docker container exposed on port 3000. The server handles all HTTP requests, serves the frontend, and processes API route requests. The Dockerfile and `CMD` configure how the server starts in production. |
| **Work in a collaborative development environment** | The project follows Git Flow branching strategy with `main`, `develop`, and `feature/*` branches. Pull Requests are used to merge work. Commit message conventions (`feat:`, `fix:`, `docs:`) keep the history readable for all team members. |
| **Integrate AI tools** | GitHub Copilot (Claude Sonnet) was used as a coding assistant throughout development. The AI Usage Policy section documents exactly where AI was used, what was reviewed, and what rules were followed to keep the developer in control. |
| **Design a user experience** | Wireframes for all 5 app screens (Login, Dashboard, Lessons, Lesson Detail + Quiz, Progress) were designed before building. The UI uses a clean blue/white/green palette appropriate for a student-facing academic platform. |
| **Consume application programming interfaces** | The frontend pages call the project's own REST API routes (`/api/auth/login`, `/api/lessons`, `/api/progress`, etc.) using `fetch`. Each page fetches data from the database and renders it dynamically. |

---

## AI Usage Policy

### How AI Was Used in This Project

GitHub Copilot (powered by Claude Sonnet) was used as a coding assistant during the development of BrightPath Tutoring. Below is a transparent breakdown of how it was used and the boundaries applied.

| Area | How AI Was Used |
|---|---|
| **Boilerplate & Repetition** | AI generated repetitive CRUD route handlers (GET, POST, PUT, DELETE) based on one reviewed example, saving time on identical patterns. |
| **Docker Configuration** | AI suggested initial `docker-compose.yml` structure; every line was reviewed and understood before keeping it. |
| **Prisma Schema** | AI helped write model relationships; the schema logic and field choices were decided by the developer. |
| **Security Patterns** | AI recommended using Node.js built-in `crypto.scryptSync` for password hashing instead of plain text. The developer verified and approved this approach. |
| **README Documentation** | AI helped structure and draft documentation sections; content accuracy was verified by the developer. |
| **Debugging** | AI was consulted to explain errors and suggest fixes, but the developer applied and tested all changes. |

### Rules Followed
- **No AI-generated code was used without being read and understood.**
- **All security-sensitive code** (password hashing, credential handling) was manually reviewed line-by-line.
- **AI was never used to make architectural decisions** — the developer decided what features to build and how the system should work.
- **Secrets and credentials** were never shared with the AI tool.
- AI suggestions that added unnecessary complexity were rejected.

---

## Features & Problem Mapping

### Core App Features

| Feature | Problem It Solves |
|---|---|
| **Student Login** (email + password authentication) | Students have no secure way to access their personal account, lessons, and quiz results without authentication. |
| **View Lessons** (browse math & science content) | Students have no centralized, always-available place to access learning materials from any device. |
| **Take Quizzes** (answers saved immediately to the database) | Teachers cannot measure student understanding, and students risk losing their work if the page refreshes before saving. |
| **Track Progress** (view quiz scores and completed lessons) | Students and teachers have no visibility into improvement over time, forcing manual and error-prone grade tracking. |
| **Profile Dashboard** (name, grade, completions, scores) | Students have no central starting point to see their full learning status every time they log in. |
| **Lesson Completion Tracking** (mark lessons as finished) | Without completion tracking, students cannot tell what they have already studied and what still needs to be done. |
| **Quiz Result History** (per-student score log) | Without a result history, past quiz performance is invisible, preventing students from reviewing growth or identifying weak areas. |

### System Needs

| System Need | Problem It Solves |
|---|---|
| **Database Connectivity** (PostgreSQL via Prisma) | Without persistent storage, all student accounts, lesson data, and quiz results are lost when the server restarts. |
| **Secure Authentication** (scrypt password hashing, no plain-text credentials) | Storing plain-text passwords exposes every user account if the database is ever compromised or leaked. |
| **Containerized Environment** (Docker + Docker Compose) | "It works on my machine" inconsistencies mean the app behaves differently across developer laptops, CI, and production. |

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        USER'S BROWSER                        │
│              (React, Next.js pages, Tailwind CSS)            │
└────────────────────────────┬────────────────────────────────┘
                             │  HTTP requests
                             ▼
┌─────────────────────────────────────────────────────────────┐
│               DOCKER CONTAINER: app (port 3000)              │
│                                                              │
│   ┌─────────────────────────────────────────────────────┐   │
│   │               Next.js Application                   │   │
│   │                                                      │   │
│   │  /app/page.tsx          ← React UI pages            │   │
│   │  /app/api/auth/login    ← POST  authenticate        │   │
│   │  /app/api/students      ← GET / POST                │   │
│   │  /app/api/students/[id] ← GET / PUT / DELETE        │   │
│   │  /app/api/lessons       ← GET / POST                │   │
│   │  /app/api/lessons/[id]  ← GET / PUT / DELETE        │   │
│   │  /app/api/quizzes       ← GET / POST                │   │
│   │  /app/api/quizzes/[id]  ← GET / PUT / DELETE        │   │
│   │  /app/api/progress      ← GET / POST                │   │
│   │  /app/api/health        ← GET  health check         │   │
│   └───────────────────────────┬─────────────────────────┘   │
│                               │  Prisma ORM (SQL queries)    │
└───────────────────────────────┼─────────────────────────────┘
                                │  Docker internal network
                                │  (service name: "db")
                                ▼
┌─────────────────────────────────────────────────────────────┐
│              DOCKER CONTAINER: db (port 5432)                │
│                     PostgreSQL 15                            │
│                                                              │
│   Tables:  Student · Lesson · Quiz · QuizResult              │
│            LessonCompletion · Note                           │
│                                                              │
│   Volume:  pgdata (named volume — data persists across       │
│            container restarts and rebuilds)                  │
└─────────────────────────────────────────────────────────────┘

Environment Variables (.env.production — excluded from git):
  DATABASE_URL=postgresql://postgres:password@db:5432/mydb
```

**Key architectural decisions:**
- The `app` container communicates with `db` using Docker's internal DNS (`db` hostname) — no IP addresses are hardcoded.
- Prisma ORM abstracts all raw SQL, preventing SQL injection by using parameterized queries.
- Passwords are hashed with `scryptSync` (Node.js built-in `crypto`) before being stored — the plain-text password never touches the database.
- `depends_on: condition: service_healthy` ensures the app never tries to connect before PostgreSQL is fully ready.

---

## API Routing

All routes are served by Next.js App Router (`/app/api/...`) and interact with PostgreSQL through Prisma ORM.

### Authentication

| Method | Route | Description | Request Body |
|---|---|---|---|
| `POST` | `/api/auth/login` | Authenticate a student | `{ email, password }` |

### Students

| Method | Route | Description | Notes |
|---|---|---|---|
| `GET` | `/api/students` | List all students | Password hash is never returned |
| `POST` | `/api/students` | Register a new student | `{ name, email, password, gradeLevel }` — password is hashed before storage |
| `GET` | `/api/students/[id]` | Get student + full progress | Includes completed lessons and quiz scores |
| `PUT` | `/api/students/[id]` | Update name or grade level | `{ name, gradeLevel }` |
| `DELETE` | `/api/students/[id]` | Remove a student account | — |

### Lessons

| Method | Route | Description | Request Body |
|---|---|---|---|
| `GET` | `/api/lessons` | List all lessons | — |
| `POST` | `/api/lessons` | Create a lesson | `{ title, subject, content }` |
| `GET` | `/api/lessons/[id]` | Get lesson + its quizzes | — |
| `PUT` | `/api/lessons/[id]` | Update lesson content | `{ title, subject, content }` |
| `DELETE` | `/api/lessons/[id]` | Remove a lesson | — |

### Quizzes

| Method | Route | Description | Request Body |
|---|---|---|---|
| `GET` | `/api/quizzes` | List all quizzes | — |
| `POST` | `/api/quizzes` | Create a quiz | `{ lessonId, title }` |
| `GET` | `/api/quizzes/[id]` | Get quiz + all student results | — |
| `PUT` | `/api/quizzes/[id]` | Update quiz title | `{ title }` |
| `DELETE` | `/api/quizzes/[id]` | Remove a quiz | — |

### Progress

| Method | Route | Description | Request Body |
|---|---|---|---|
| `GET` | `/api/progress?studentId=<id>` | Get a student's full progress | Query param: `studentId` |
| `POST` | `/api/progress` | Save a lesson completion | `{ type: "lesson", studentId, lessonId }` |
| `POST` | `/api/progress` | Save a quiz result | `{ type: "quiz", studentId, quizId, score }` |

### Health

| Method | Route | Description |
|---|---|---|
| `GET` | `/api/health` | Returns DB connection status and current server time |

---

## Wireframes

### 1. Login Page (`/login`)
```
┌─────────────────────────────────────────┐
│           🎓 BrightPath Tutoring         │
│                                         │
│         ┌───────────────────────┐       │
│  Email  │ student@email.com     │       │
│         └───────────────────────┘       │
│         ┌───────────────────────┐       │
│  Pass   │ ••••••••              │       │
│         └───────────────────────┘       │
│                                         │
│         ┌───────────────────────┐       │
│         │       Sign In         │       │
│         └───────────────────────┘       │
│                                         │
│    Don't have an account? Register      │
└─────────────────────────────────────────┘
```

### 2. Student Dashboard / Profile (`/dashboard`)
```
┌─────────────────────────────────────────────────────┐
│  BrightPath          Hello, Jordan! 👋    [Log Out] │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────┐ │
│  │   Profile    │  │  Lessons     │  │  Progress │ │
│  │              │  │  Completed   │  │  Quizzes  │ │
│  │  Jordan M.   │  │     8 / 12   │  │  Avg: 84% │ │
│  │  Grade 10    │  │              │  │           │ │
│  └──────────────┘  └──────────────┘  └───────────┘ │
│                                                     │
│  Recent Activity                                    │
│  ─────────────────────────────────────────────────  │
│  ✅ Completed: "Algebra Basics"        Mar 9, 2026  │
│  📝 Quiz Score: "Forces & Motion" — 90%  Mar 8      │
│  ✅ Completed: "Cell Biology"          Mar 7, 2026  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 3. Lessons Page (`/lessons`)
```
┌─────────────────────────────────────────────────────┐
│  BrightPath                             [Dashboard] │
├─────────────────────────────────────────────────────┤
│  Lessons                                            │
│  Filter: [ All ▾ ]  [ Math ]  [ Science ]           │
│  ─────────────────────────────────────────────────  │
│  ┌─────────────────────────────────────────────┐   │
│  │  📐 Algebra Basics              MATH   ✅   │   │
│  │  Introduction to algebra concepts...        │   │
│  │                              [View Lesson]  │   │
│  └─────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────┐   │
│  │  🔬 Cell Biology             SCIENCE        │   │
│  │  Structure and function of cells...         │   │
│  │                              [View Lesson]  │   │
│  └─────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────┐   │
│  │  ⚡ Forces & Motion           SCIENCE   ✅  │   │
│  │  Newton's laws and applications...          │   │
│  │                              [View Lesson]  │   │
│  └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

### 4. Lesson Detail & Quiz (`/lessons/[id]`)
```
┌─────────────────────────────────────────────────────┐
│  BrightPath          ← Back to Lessons              │
├─────────────────────────────────────────────────────┤
│  📐 Algebra Basics                          MATH    │
│  ─────────────────────────────────────────────────  │
│  [Lesson content renders here — text, diagrams,     │
│   examples, worked problems...]                     │
│                                                     │
│  ─────────────────────────────────────────────────  │
│  ┌───────────────────────────────────────────┐     │
│  │              Mark as Complete             │     │
│  └───────────────────────────────────────────┘     │
│                                                     │
│  Quiz: "Algebra Basics Check"                       │
│  ─────────────────────────────────────────────────  │
│  Q1. What is the value of x in 2x = 10?             │
│      ○ 4   ○ 5   ○ 6   ○ 7                         │
│                                                     │
│  Q2. Simplify: 3x + 2x                              │
│      ○ 5x  ○ 6x  ○ x   ○ 5                         │
│                                                     │
│  ┌───────────────────────────────────────────┐     │
│  │              Submit Answers               │     │
│  └───────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────┘
```

### 5. Progress Page (`/progress`)
```
┌─────────────────────────────────────────────────────┐
│  BrightPath                             [Dashboard] │
├─────────────────────────────────────────────────────┤
│  My Progress                                        │
│                                                     │
│  Lessons Completed                                  │
│  ─────────────────────────────────────────────────  │
│  ████████████████████░░░░  8 of 12  (67%)           │
│                                                     │
│  ✅ Algebra Basics               Completed Mar 9    │
│  ✅ Forces & Motion              Completed Mar 8    │
│  ✅ Cell Biology                 Completed Mar 7    │
│                                                     │
│  Quiz Scores                                        │
│  ─────────────────────────────────────────────────  │
│  Quiz                          Score     Date       │
│  ─────────────────────────────────────────────────  │
│  Algebra Basics Check           90%      Mar 9      │
│  Forces & Motion Check          78%      Mar 8      │
│  Cell Biology Check             84%      Mar 7      │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Branching Strategy

This project follows a simplified **Git Flow** branching model.

```
main
 └── develop
       ├── feature/student-login
       ├── feature/view-lessons
       ├── feature/take-quizzes
       ├── feature/track-progress
       ├── feature/profile-dashboard
       ├── feature/docker-setup          ← current
       └── hotfix/[description]
```

### Branch Roles

| Branch | Purpose | Who merges into it |
|---|---|---|
| `main` | Production-ready code only. Deployed to Vercel. Never commit directly. | Merged from `develop` via Pull Request after review. |
| `develop` | Integration branch. All features are merged here first and tested together before going to `main`. | Merged from `feature/*` branches via Pull Request. |
| `feature/*` | One branch per feature or task. Created from `develop`, merged back to `develop` when complete. | Developer opens a PR to `develop`. |
| `hotfix/*` | Emergency fixes for bugs in `main`. Branched from `main`, merged back to both `main` and `develop`. | Developer opens a PR to `main` + `develop`. |

### Workflow Example

```bash
# Start a new feature
git checkout develop
git pull origin develop
git checkout -b feature/take-quizzes

# Work, commit, push
git add .
git commit -m "feat: add quiz submission and score saving"
git push origin feature/take-quizzes

# Open Pull Request: feature/take-quizzes → develop
# After review and approval, merge and delete the branch
```

### Commit Message Convention

| Prefix | Use For |
|---|---|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `docs:` | Documentation only |
| `chore:` | Config, tooling, deps |
| `refactor:` | Code change with no feature/fix |

---

## Deployment (Vercel)

BrightPath's Next.js frontend and API routes are deployed on **Vercel**.

**Live URL:** `https://bright-path-tutoring.vercel.app` *(update this after deployment)*

### Steps to Deploy

1. Push the repository to GitHub.
2. Go to [vercel.com](https://vercel.com) and import the GitHub repository.
3. In the Vercel dashboard, set the following **Environment Variable**:
   - `DATABASE_URL` → your production PostgreSQL connection string (e.g., from Supabase or Railway).
4. Vercel will auto-detect Next.js and deploy on every push to `main`.

> **Note:** The Docker Compose setup is for local development only. Vercel handles deployment automatically — you do not run Docker on Vercel.

---

## DevOps Lab: Orchestration & Stability

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
