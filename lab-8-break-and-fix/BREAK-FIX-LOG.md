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
