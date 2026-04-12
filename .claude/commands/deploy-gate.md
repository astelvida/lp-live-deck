---
description: Run the lp-live-deck deploy-gate-runner subagent and relay its pass/fail report. Use before `vercel deploy --prod`.
---

Invoke the `deploy-gate-runner` subagent via the Agent tool (subagent_type: `deploy-gate-runner`) and relay its report verbatim.

If the subagent registry hasn't picked up `.claude/agents/deploy-gate-runner.md` yet (fresh install, cold session), fall back to the `general-purpose` subagent with the checklist from `.claude/agents/deploy-gate-runner.md` inlined into the prompt.

Do not add commentary beyond what the subagent returns — the user wants the gate report, not interpretation. If the verdict is `BLOCKED`, offer to fix the first failing check; do not fix proactively.
