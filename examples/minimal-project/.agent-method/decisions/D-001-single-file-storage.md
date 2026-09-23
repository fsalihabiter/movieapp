---
id: D-001
title: Single-file plain-text storage
status: accepted
scope: architecture
created: 2026-08-30
supersedes: null
superseded_by: null
---
# D-001 — Single-file plain-text storage
## Context
Fixture must stay dependency-free.
## Decision
Notes persist in one plain-text file (notes.txt); no database.
## Consequences
No concurrency guarantees; acceptable for fixture scope.
## Keywords (for Doctor drift detection)
- Database, SQLite, ORM, WebServer
