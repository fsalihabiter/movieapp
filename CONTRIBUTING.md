# Contributing to ADM

- Machine surface (file names, IDs, YAML keys, schemas, skill names) is English. Always.
- One decision = one file; one session = one evidence file. Do not reintroduce monolithic logs.
- Never make a generated file canonical (INV-12). Never require symlinks,
  OS-specific shell, hooks or subagents for core correctness (P5–P8).
- Concept definitions live only in `.agent-method/docs/TERMINOLOGY.md`.
- New invariants go to `docs/INVARIANTS.md`; give them the next INV-NN id and,
  if checkable, wire them into the adm-doctor structural procedure.
- Runtime claims in RUNTIME_COMPATIBILITY.md must cite a test run from
  RUNTIME_TEST_PLAN.md ("Supported" ≠ "Tested").
