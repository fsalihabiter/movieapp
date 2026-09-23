# Migration: claude-method v1.4 → ADM v2 (alpha)

> Scope note: existing v1.4 projects (e.g. pinned production projects) may stay
> on v1.4. This guide exists for when a migration is explicitly decided.
> D-NNN and GD-NNN identifiers MUST survive migration unchanged.

## Mapping table

| v1.4 | v2 alpha |
|---|---|
| `.claude/charter/*` | `.agent-method/charter/*` |
| `.claude/pipeline/cycles/GD-*.md` | `.agent-method/cycles/GD-*.md` (ids preserved) |
| `PATTERNS.md`, `NAMING_CONVENTIONS.md`, `SOLUTION_STRUCTURE.md` | split: one decision per file, flat `decisions/D-NNN-*.md` (scope in frontmatter; keep D-NNN ids) |
| `SESSION_LOG.md` (monolithic) | `evidence/sessions/S-*.md` (one file per historical session; latest by `closed_at`) |
| `ENVANTER.md` | `registry/CAPABILITIES.md` (single canonical name; keep entries) |
| `CURRENT_STATE.md` (hand-edited) | `state.yaml` (single canonical state; generated views are optional/roadmap) |
| `MASTER.md`, `BACKLOG.md`, `CHANGELOG.md` | not generated in alpha; backlog = `pipeline/POOL.md` + GD statuses; chronology = session evidence |
| `DOKTOR_PROMPT.md` | `adm-doctor` skill + `doctor.schema.json` + `docs/INVARIANTS.md` |
| `.claude/commands/ac.md` | `.agents/skills/adm-open/` |
| `.claude/commands/baslat.md` | `.agents/skills/adm-bootstrap/` |
| `.claude/commands/kapat.md` | `.agents/skills/adm-close/` |
| `.claude/commands/analiz.md` | `.agents/skills/adm-analyze/` (advanced) |
| `.claude/commands/faz.md` | `.agents/skills/adm-phase/` (advanced) |
| `.claude/commands/review.md` | `.agents/skills/adm-review/` |
| `.claude/commands/doktor.md` | `.agents/skills/adm-doctor/` |
| old command names | may be documented as runtime aliases; canonical names are `adm-*` |
| confidence 0–100 | `severity` + `evidence` (+ finding `status` lifecycle) |

## Procedure (summary)

1. Freeze: close all open sessions on v1.4 (`/kapat`).
2. Copy the v2 template into the repo (do not delete `.claude/` yet).
3. Move charter, cycles, pipeline content per the table; keep all ids.
4. Split grouped decision files; each extracted decision keeps its D-NNN id;
   set `supersedes/superseded_by` where applicable.
5. Split SESSION_LOG into per-session evidence files (best effort; mark
   reconstructed metadata as such).
6. Create `state.yaml` from the last known CURRENT_STATE (empty session block).
7. Generate Claude shims; remove old `.claude/commands/`.
8. Run `adm-doctor`; resolve findings with human approval.
9. Update runtime compatibility status only after Tests A–C pass.
