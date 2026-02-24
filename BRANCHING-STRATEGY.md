# Branching Strategy

## main
Production-ready code is merged here. Only thoroughly tested and reviewed code is allowed.

## develop
Integration branch for ongoing development. Features and fixes are merged here before going to main.

## feature/*
Each new feature is developed in its own branch (e.g., feature/login, feature/notes-api). Merged into develop when complete.

## hotfix/*
Urgent fixes for production issues are developed in hotfix branches and merged into both main and develop.
