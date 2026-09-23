# V2_REFACTOR_REPORT — ADM v2.0-alpha template build

> Built fresh from three inputs, in precedence order for alpha:
> 1. `V2_ALPHA_SIMPLIFICATION_DECISION.md` (simplification decisions win)
> 2. `V2_SPEC_ADDENDUM_REVIEW_FINDINGS.md`
> 3. `V2_VENDOR_NEUTRAL_AGENT_METHOD_REFACTOR_SPEC.md`
> The v1.4 → v2 mapping is in `MIGRATION_V1_TO_V2.md`.

## 1. Old structure (summary)
v1.4 mixed methodology and Claude Code runtime under `.claude/`; monolithic
SESSION_LOG; hand-maintained CURRENT_STATE/MASTER/BACKLOG/CHANGELOG; grouped
decision files; 0–100 confidence scores.

## 2. New structure
`.agent-method/` (canonical) + `.agents/skills/adm-*` (portable workflows) +
`adapters/` + `.claude/skills/` (pointer shims only). Single `state.yaml`.
No `generated/` directory in the default alpha package.

## 3. Alpha scope (per the simplification decision)
- **Single active writable session per repository** (INV-13). The product test
  is the sequential handoff chain Claude → Codex → Cursor → Antigravity → Claude.
- **Parallel writable sessions, worktree orchestration, locks: out of scope**
  (roadmap V2.4). Users may use worktrees personally; ADM does not manage them.
- **Generated projections optional** — default `projections: []`; adm-open
  briefs directly from canonical sources. Deterministic generation → V2.2.
- **Daily surface:** adm-open / adm-close (+ adm-review, adm-doctor when
  needed; adm-bootstrap once). adm-analyze / adm-phase classified advanced.
- **Doctor is one command**; structural/semantic split is internal.
- **Finding lifecycle** added to review AND doctor findings
  (open | resolved | accepted | false-positive, optional resolution block).
- CLI, hooks, MCP: not required by alpha (roadmap V2.1/V2.3).

## 4. Removed / deprecated
`wp_id` (undefined WP concept — A-004); `state.local.yaml` split (A-001
**withdrawn** by the simplification decision); BACKLOG/MASTER/CHANGELOG and all
default projections; fixed reviewer count; doctor "layer count"; confidence
0–100; monolithic log; symlink assumptions; scoped decision subdirectories
(flattened; scope stays in frontmatter).

## 5. Canonical source decisions
Ownership table in ARCHITECTURE.md; invariant list in INVARIANTS.md
(INV-01..18); phase GD threshold single-sourced in config.yaml; normative
concept definitions only in TERMINOLOGY.md (contextual explanations elsewhere
allowed, conflicting normative definitions not).

## 6. Runtime adapter strategy
Codex/Cursor/Antigravity: native `AGENTS.md` + `.agents/skills/` — no extra
files beyond the adapter doc. Claude: `CLAUDE.md → @AGENTS.md` + pointer shims
(A-003 preserved); fallback = test-proven full mirror, decision to be recorded
here after Test B.

## 7. OS portability decisions
No symlinks, no OS-specific shell in core, UTF-8, no case-only names, no
reserved names, no CRLF-dependent logic, no hardcoded temp/home. The core
lifecycle runs without executing any script.

## 8. v1.4 problems resolved
Session log ordering → per-session evidence; diff evidence → start_sha + index
states; state contract explicit in state.yaml; dynamic reviewers; invariant
list as single doctor canon; WP removed; single `archive/`; threshold in
config; no hardcoded file counts; TEST_DEBT semantics split (coverage debt vs
failing required validation).

## 9. Not yet implemented (roadmap)
- V2.1 CLI (CLI_CONTRACT.md): schema validation tooling, deterministic state
  transitions, id generation, adapter generation.
- V2.2 generated views. V2.3 hooks/MCP/subagent enhancements.
- V2.4 parallel work (worktree isolation, session-local state, merge strategy)
  — only if real need is proven. The withdrawn A-001 design is the starting
  point when/if that happens.

## 10. Known risks
- Claude shim behavior unproven until Test B (fallback defined).
- INV-13 (single session) is convention + detection (stale-session warning),
  not lock-enforced.
- Runtime feature assumptions must be re-verified against official vendor docs
  at implementation/release time.
- Briefings are LLM-produced from canonical sources; wording varies across
  runtimes (content must not — Test C checks content, not phrasing).

## 11. Manual test instructions
RUNTIME_TEST_PLAN.md (Tests A–G; Test C is the product test; Test F covers
stale-session detection).

## 12. Decisions still owed by the human
- LICENSE choice (TODO by design). Product name (ADM is a working identifier).
- Per-project `method.language`. Test B outcome → shim vs mirror.
- Whether/when to enable any generated projections in a given project.

## 13. Addendum items — final status (per simplification decision §28)
| Item | Status in template |
|---|---|
| A-001 state split | **Withdrawn** — single state.yaml; revisit in V2.4 |
| A-002 projection set | **Superseded** — projections fully optional, default empty (INV-17) |
| A-003 Claude pointer-shim | Kept — Test B gate + documented fallback |
| A-004 undefined WP | Kept — removed; `additionalProperties: false` everywhere |
| A-005 doctor schema | Kept — doctor.schema.json + INV references + lifecycle |
| A-006 language/terminology | Kept, softened — normative defs single-sourced |
| A-007 failure modes | Parallel/worktree parts out of scope; general Git failure modes kept in skills |
| A-008 completion criteria | Replaced by simplification decision §29 checklist |
| A-009 phase placement | Updated to simplified scope during build |
| A-010 rationale | Partially applicable — parallelism no longer an alpha criterion |
