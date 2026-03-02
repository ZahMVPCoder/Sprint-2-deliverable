# Lab 6: Docker Secrets & Stability

## Step-by-Step Guide

1. **Create .env.production**
	 - Add your DATABASE_URL connection string:
		 `DATABASE_URL="postgresql://postgres:password@db:5432/mydb"`

2. **Use Environment File in Docker Compose**
	 - In `docker-compose.yml`, set:
		 ```
		 env_file:
			 - .env.production
		 ```
		 for your app service (already configured).

3. **Ensure .env.production is NOT tracked by git**
	 - Run: `git status --short .env.production`
	 - If no output, the file is not tracked (good!).
	 - If you see `A  .env.production` or `M  .env.production`, add it to `.gitignore` and remove from git:
		 - Add `.env.production` to `.gitignore`
		 - Run: `git rm --cached .env.production`

---
in order to Rebuild from scratch

Run: docker compose up -d --build

Prove it works again

Run: docker compose ps

You must see: db = healthy, app = running

## Docker Compose + Prisma Migration Guide

### Step-by-Step Instructions

1. **Start Docker Compose stack**
	 - Run: `docker compose up -d`
	 - Ensure both `db` and `web` services are healthy (check with `docker compose ps`).

2. **Check DATABASE_URL**
	 - In `.env.production`, confirm:
		 `DATABASE_URL="postgresql://postgres:password@db:5432/mydb"`
	 - The service name (`db`) must match the one in `docker-compose.yml`.

3. **Generate Prisma Migration (inside container)**
	 - Enter the web container:
		 `docker compose exec web sh`
	 - Inside the container, navigate to your app directory if needed:
		 `cd /app`
	 - Run:
		 `npx prisma migrate dev --name init`

4. **Deploy Migration (inside container)**
	 - Still inside the web container, run:
		 `npx prisma migrate deploy`

5. **Exit the container**
	 - Type: `exit`

### Troubleshooting

- If you see `Error: P1001: Can't reach database server at db:5432`, ensure:
	- The db service is healthy (`docker compose ps`)
	- The DATABASE_URL is correct
	- You are running migration commands inside the container, not locally

---

# Lab 8: Break and Fix Log

This document tracks intentional breakages and subsequent fixes during Lab 8.

## Format
- **Step**: Short description
- **What was broken**: What was intentionally changed or removed
- **Observed error**: What error or failure occurred
- **How it was fixed**: Steps taken to restore functionality
- **Lesson learned**: Key takeaway

---

## Example Entry

### Scenario 1 – Wrong Database Port
- **What was broken**: The Database_url is porting to the wrong place.
- **Observed error**: The App failed to connect to database. 
- **How it was fixed**: Turn the  DATABASE_URL line in .env.production back to the correct port, which was 5432. Run this code after "docker compose down" then "docker compose up -d"
- **Lesson learned**: Critical environment variables must be present for app to function


Orchestration matters for educational apps because it ensures:

High reliability: Services automatically recover from crashes, so students and teachers always have access.
Consistent environments: Every user and developer gets the same setup, reducing technical issues.
Easy scaling: More users or features can be added without manual reconfiguration.
Secure secret management: Sensitive data (like database passwords) is handled safely.
Fast onboarding: New team members can start with a single command, saving time.
Minimal downtime: Automated healthchecks and restarts keep the app running smoothly.
This means educational platforms like BrightPath can deliver a stable, secure, and accessible experience for learning.