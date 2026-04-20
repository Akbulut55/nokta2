# Nokta Distillery

Track: `Track C`

One-line description: A mobile Expo app that turns messy project fragments into a structured, reviewable project-memory bundle.

## Product Thesis

Nokta Distillery is based on the idea that project knowledge should not remain trapped inside raw chats, notes, and temporary memory. Instead, messy project material should be distilled into a maintained, reviewable memory layer with traceability, contradictions, review states, and a proposed wiki patch.

This submission implements a bounded MVP of that thesis. It is not a generic summarizer and it does not rely on a live AI API.

## What The App Implements

- React Native + Expo mobile app under `submissions/231118081-idea-distillery/app/`
- Four-screen flow:
  - Input
  - Processing
  - Distilled Memory
  - Clarify
- Paste input, load sample input, clear input, and process input
- Local deterministic distillation engine
- Source fragmentation with stable IDs such as `S1`, `S2`, `S3`
- Deduplicated idea cards
- One canonical project summary
- Role-specific views derived from the canonical summary
- Fixed role tabs:
  - Product
  - Designer
  - Frontend
  - Backend
  - AI/LLM
- Contradiction detection for a small set of obvious conflict patterns
- Clarification question generation
- Source traceability and evidence ledger
- Ambiguity budget
- Human review states:
  - pending
  - confirmed
  - needs_review
  - discarded
  - locked
- Clickable review controls in the UI
- Wiki Patch Preview as the visually prominent signature feature
- Handoff Pack section for continuing the project in another session or tool
- Near-dark, card-based UI aligned with the Stitch-derived design direction in `DESIGN.md`

## What The App Does Not Implement

- No live AI API integration
- No real backend or cloud persistence
- No real markdown wiki file writing; the app previews the patch only
- No account system, sync, or collaboration features
- No export flow for the handoff pack or patch preview
- No persistence of review changes between app sessions
- No broad natural-language intelligence beyond the local rule-based pipeline

## Demo Flow

Suggested teacher review flow:

1. Open the app and start on the Input screen.
2. Press `Load Sample` to use the included messy project dump.
3. Inspect the metadata chips and the pipeline hint.
4. Press `Process with Nokta`.
5. Watch the Processing screen show the visible multi-step pipeline instead of a generic spinner.
6. On Distilled Memory, inspect:
   - canonical project summary
   - role tabs
   - Wiki Patch Preview
   - idea cards
   - contradiction queue
   - evidence ledger
   - ambiguity budget
   - handoff pack
   - source traceability
7. Change review states on idea cards, contradictions, or patch items.
8. Open the Clarify screen and answer or mark clarification questions.

## How To Run The Expo App

From `submissions/231118081-idea-distillery/app/`:

```bash
npm install
npm run start
```

Useful commands:

```bash
npm run android
npm run web
npm run typecheck
```

## Submission Placeholders

Expo link placeholder: `TBD`

60-second demo video placeholder: `TBD`

APK note / placeholder:
- APK not included in this README yet.
- Placeholder: `TBD`

## Decision Log

- Chose React Native + Expo for the mobile MVP because the locked idea calls for a mobile app and the implementation needed to stay bounded.
- Chose a local deterministic distillation engine instead of a live AI API because the MVP does not require external inference and the submission needed to run without API keys.
- Chose a four-screen flow because it matches the locked product concept:
  - Input
  - Processing
  - Distilled Memory
  - Clarify
- Chose fixed role tabs instead of open-ended adaptive roles to keep the mobile UI bounded and aligned with the locked role catalog.
- Chose Wiki Patch Preview as a preview artifact rather than real file writes because the idea allows this simplification for MVP.
- Chose in-memory review state updates for the MVP rather than persistence because persistence would expand scope without changing the core thesis.

## AI Tool Log

- `Codex`
  - inspected the repository
  - created `AGENTS.md`
  - scaffolded the Expo app
  - implemented the deterministic distillation engine
  - implemented the React Native UI
  - wrote and updated the submission documentation
- `Stitch MCP`
  - created the UI design project for Nokta Distillery
  - generated the four required mobile screens
  - established the shared visual direction used in `DESIGN.md`

Runtime note:
- The shipped app does not call Codex or Stitch MCP at runtime.
- Those tools were used during design and implementation only.

## Known Limitations

- The distillation engine is heuristic and keyword-based, so it works best on project notes that resemble the intended Nokta input style.
- Contradiction detection is intentionally narrow and pattern-based.
- Clarification answers update local review state but do not trigger a deeper regeneration pipeline.
- Review changes are not persisted after the app closes.
- The handoff pack is shown in-app but not exported as a file.
- The patch preview is a strong visual artifact, but it is still only a preview.

## Future Directions

- Persist review states and clarified decisions locally between sessions
- Add export for handoff pack and wiki patch preview
- Improve contradiction and deduplication logic beyond simple rules
- Add optional real markdown persistence as a later extension
- Add richer update behavior so clarification answers can selectively refresh affected memory items
- Expand evaluation and challenge flows as separate Nokta modes without changing the core Distillery thesis
