# Submission Instructions: 231118081 Idea Distillery

## Scope

- Only modify files under `submissions/231118081-idea-distillery/`.
- Do not touch root-level files.
- Do not touch any other submission folder.
- The app lives in `submissions/231118081-idea-distillery/app/`.

## Source Of Truth

- `submissions/231118081-idea-distillery/idea.md` is the locked product source of truth.
- Do not rewrite, rethink, weaken, or replace the idea in `idea.md`.
- If implementation details need simplification, preserve the core thesis and product contract from `idea.md`.
- Use Stitch MCP for UI design before implementation work.
- Treat Stitch MCP output as the UI source of truth once screens are created.

## Technical Direction

- Implement the app with React Native + Expo.
- MVP does not require any live AI API.
- A local deterministic distillation engine is acceptable for MVP.
- The app must render structured data, not a generic chat-style answer.
- Do not build a generic summarizer.

## Locked Product Focus

- The product is Nokta Distillery.
- The signature feature is Wiki Patch Preview.
- The app should feel like a project-memory distillation cockpit.
- Canonical summary is the central source of truth for downstream views.
- Role-specific views should be derived from the canonical summary.
- Preserve evidence, traceability, contradictions, clarification questions, review states, and handoff output as first-class concepts.

## MVP Guardrails

- Favor a bounded, deterministic pipeline over open-ended AI behavior.
- Simulate or implement the distillation stages in a transparent way.
- Keep the output centered on a reviewable project-memory bundle.
- Prioritize source fragments, idea cards, canonical summary, role views, contradiction handling, evidence/traceability, clarification questions, review states, wiki patch preview, and handoff pack.
- Avoid scope drift into note-taking, project management, or generic productivity tooling.

## Delivery Rules

- Before implementation, create the UI direction with Stitch MCP and follow it during app build-out.
- Keep changes contained to this submission folder.
- When implementation discoveries force tradeoffs, treat them as execution simplifications, not product redefinition.
