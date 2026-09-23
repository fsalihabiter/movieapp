# ADM Runtime Test Plan (v2 alpha — manual, cross-runtime)

Run each test opening the SAME repository root with, in turn:
Claude Code, Codex, Cursor, Antigravity. Record results and update
`RUNTIME_COMPATIBILITY.md` status (Designed → Smoke Tested → Verified).
Use `examples/minimal-project/` or a real new project.

## Test A — Discovery
1. Open the repository. Give NO explanation of ADM.
2. Ask: "Explain the working method used in this project."
3. Pass if the agent discovers AGENTS.md (or the CLAUDE.md adapter), finds
   `.agent-method/`, lists the skills, and does NOT invent vendor-specific state.

## Test B — Explicit skill invocation
1. Invoke `adm-open` with the runtime's syntax.
2. Pass if active Phase, active GD, next step, blockers and last session are
   reported identically across all runtimes.
3. **Claude-specific:** verify through the shim that the CANONICAL skill at
   `.agents/skills/adm-open/SKILL.md` was actually loaded and followed. If the
   shim fails, record the fallback-to-mirror decision and rationale in
   `V2_REFACTOR_REPORT.md` before proceeding.

## Test C — Cross-runtime handoff (THE product test)
For each hop in the cycle
`Claude → Codex → Cursor → Antigravity → Claude`:
1. Runtime X: `adm-open`, make a small change on a GD, `adm-close`, quit X.
2. Runtime Y: open the same repo, `adm-open`.
3. Pass if Y correctly reports — WITHOUT any of X's chat history —
   the active Phase, active/last GD, last work done, decisions, blockers and
   next step, and can continue the work.
4. The cycle must complete with zero information loss (5 hops = 5 sub-results).

## Test D — Drift detection
1. Hand-corrupt a canonical cross-reference (e.g. point `active.gd_id` at a
   non-existent GD), or, if projections are enabled, hand-edit a generated file.
2. Run `adm-open` and `adm-doctor`.
3. Pass if the mismatch is caught, the canonical source is named, and nothing
   is silently "fixed".

## Test E — Review fallback
1. Run `adm-review` with subagents/parallelism unavailable.
2. Pass if the review completes sequentially and the report conforms to
   `review.schema.json` exactly as the parallel path would, including finding
   `status` lifecycle fields.

## Test F — Stale session detection
1. Simulate an improperly ended session: leave `state.yaml → session` filled,
   open the repo with another runtime, run `adm-open`.
2. Pass if the open session is reported (INV-13), the user is asked how to
   proceed, and nothing is silently overwritten.

## Test G — Windows
On Windows 11 verify: path handling, CRLF tolerance (no logic depends on line
endings), no symlinks anywhere, no Bash dependency in any core flow, Git discovery.

## Result log

| Test | Runtime / hop | Date | Result | Notes |
|---|---|---|---|---|
