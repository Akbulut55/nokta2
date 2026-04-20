# Nokta: Project Memory Distillation Engine

Nokta is a project-memory system that turns scattered project chats, notes, decisions, and fragments into a maintained knowledge layer.

Most AI-assisted projects do not suffer from a lack of ideas. They suffer because useful ideas never become durable project memory. They remain distributed across long LLM chats, copied prompts, rough notes, message threads, meeting fragments, half-written requirements, implementation thoughts, and the user’s own memory.

Nokta exists to convert that unstable material into a structured artifact that can be reviewed, trusted, reused, and extended.

The first implemented mode is **Nokta Distillery**.

Nokta Distillery accepts messy project material and transforms it into a reviewable project-memory bundle:

```txt
messy project fragments
→ source fragments
→ deduplicated idea cards
→ canonical project summary
→ role-specific views
→ evidence ledger
→ wiki patch preview
→ handoff pack
```

The central artifact is not a chat response.

The central artifact is a **reviewable wiki patch**: a proposed update to the project’s maintained memory.

Nokta is not a generic summarizer. A summarizer compresses text. Nokta distills project state.

---

## 1. Problem

AI-assisted work creates a new type of project-memory problem.

A project may begin in one LLM chat, continue in another model, move into WhatsApp messages, get rewritten in personal notes, then turn into scattered tasks, prompts, sketches, and requirement fragments.

The user may already know what the project is, but that knowledge is not stored in a clean form.

Common failure modes:

- the same idea appears many times in slightly different wording
- old assumptions remain mixed with newer decisions
- future features get confused with MVP scope
- contradictions are hidden inside casual messages
- design direction is separated from technical direction
- implementation constraints are buried inside temporary conversations
- handoff to another tool or model requires explaining everything again
- the current project state exists partly in files and partly in the user’s memory

This creates project-memory decay.

Raw chat history is chronological and noisy. Static notes become stale. Retrieval over old material can find fragments, but it does not automatically maintain a cleaner project state.

Nokta addresses this by creating a maintained memory layer between raw project material and future work.

---

## 2. Core Thesis

The useful unit of project knowledge is not the raw chat.

The useful unit is a maintained project-memory artifact.

Nokta’s thesis is:

> Project knowledge should be continuously distilled from raw fragments into a structured, reviewable, and reusable memory layer.

This memory layer can later become:

- a wiki
- a handoff file
- a role-specific brief
- an implementation plan
- a decision log
- an AI context package
- a source of truth for future project work

The important point is that the project becomes clearer over time.

Each ingest should improve the project memory instead of adding another pile of text.

---

## 3. Product Identity

Nokta is a project-memory distillation engine.

It is not a passive archive. It is not a simple note folder. It is not a one-shot AI answer.

Nokta should help answer:

- What is this project really about?
- Which ideas are repeated?
- Which claims are supported by sources?
- Which claims are uncertain?
- Which decisions are already made?
- Which contradictions still block progress?
- What should each role care about?
- What should be added to the project wiki?
- What context should be handed to the next AI tool, collaborator, or implementation session?

The first app does not need to implement the entire future Nokta ecosystem.

It needs to prove the core operation:

> scattered project material can be converted into trusted project memory.

---

## 4. First Implemented Mode: Nokta Distillery

The first implemented mode is **Nokta Distillery**.

Nokta Distillery is the migration and deduplication mode of the larger Nokta system.

It accepts messy existing project material and produces a structured memory package.

The first version focuses on this flow:

```txt
input:
messy project chats, notes, and fragments

process:
split, deduplicate, extract, classify, clarify, review

output:
canonical project memory, idea cards, role views, evidence, wiki patch, handoff pack
```

This is the first proof of Nokta’s larger system.

The app should feel focused, but not small. It is not “just note cleanup.” It is the first ingest operation of a larger project-memory engine.

---

## 5. Input

The user can paste or load messy project material such as:

- exported AI chats
- copied planning messages
- WhatsApp-style notes
- rough bullet lists
- repeated requirements
- vague product ideas
- feature fragments
- implementation notes
- design comments
- old decisions
- contradictory statements
- unanswered questions
- future expansion ideas

The input does not need to be clean.

Nokta is most useful when the input is messy.

Example input:

```txt
- app should take messy project notes
- maybe it should summarize them
- no, not only summarize, make project wiki
- role tabs: product, frontend, backend maybe
- backend driven UI?
- no real backend for challenge maybe mocked response
- user must confirm facts before saving
- source trace is important
- repeated: canonical summary first
- maybe marketplace later, not MVP
- should ask clarification questions if unclear
- need something better than just note cards
- app should show what wiki files would be created
- implementation should not keep changing the idea forever
- but implementation discoveries should still be captured cleanly
```

Nokta should not pretend this input is already organized.

It should expose structure, uncertainty, repetition, and decision points.

---

## 6. Core Distillation Pipeline

Nokta Distillery uses a bounded engineering pipeline.

The pipeline is the heart of the product.

---

### 6.1 Source Fragmentation

The raw input is split into smaller source fragments.

Each source receives a stable ID:

```txt
S1, S2, S3, ...
```

The original source fragments remain unchanged.

They are treated as evidence, not as final project memory.

This separation matters because Nokta should not erase the raw material. It should build a cleaner layer above it.

---

### 6.2 Deduplication

Repeated or overlapping ideas are grouped.

Example:

```txt
S2: "role tabs: product, frontend, backend maybe"
S6: "different people need different views"
S9: "role-specific tabs should come from one canonical summary"
```

These fragments can be distilled into one memory claim:

```txt
The app should generate role-specific project views from one canonical summary.
```

Deduplication is not only removing repeated text.

It is recognizing that multiple fragments point to the same durable project concept.

---

### 6.3 Durable Knowledge Extraction

Nokta separates durable project knowledge from temporary noise.

Extracted knowledge is classified into types:

- requirement
- constraint
- assumption
- decision
- contradiction
- open question
- future feature
- implementation hint
- role need
- risk

This classification is important.

A requirement should not be treated the same as a future feature.

A decision should not be treated the same as an assumption.

A contradiction should not be hidden inside a polished paragraph.

---

### 6.4 Canonical Summary Construction

Nokta creates one canonical project summary.

This summary is the central source of truth for the output.

It contains:

- project title
- one-line description
- problem
- target users
- core concept
- current MVP scope
- non-goals
- main workflow
- requirements
- constraints
- assumptions
- decisions
- contradictions
- open questions
- next implementation steps

The canonical summary is not just a nicer version of the input.

It is the current project state.

---

### 6.5 Idea Card Generation

Nokta creates deduplicated idea cards.

An idea card is a structured memory unit.

Each card contains:

- title
- type
- distilled claim
- supporting sources
- confidence level
- review state
- related role views
- related contradictions
- wiki patch impact

Example card:

```txt
Title:
Role-specific project views

Type:
Requirement

Distilled claim:
The app should generate Product, Designer, Frontend, Backend, and AI/LLM views from the same canonical project summary.

Sources:
S2, S6, S9

Confidence:
High

Review state:
Pending

Used in:
Canonical Summary, Product View, Frontend View, Backend View

Wiki patch impact:
CREATE wiki/roles/product.md
CREATE wiki/roles/frontend.md
CREATE wiki/roles/backend.md
```

This makes the idea cards more valuable than simple sticky notes.

They become reviewable project-memory units.

---

### 6.6 Role Projection

Nokta generates role-specific views from the canonical summary.

The raw input is not summarized separately for each role. That would create drift.

The flow is:

```txt
raw fragments
→ canonical project summary
→ role-specific views
```

Possible role views:

- Product
- Designer
- Frontend
- Backend
- AI/LLM
- Data
- Security/Compliance
- Operations
- Evaluator/Reviewer

The first version should focus on the most useful roles:

- Product
- Designer
- Frontend
- Backend
- AI/LLM

Each role sees the same project through a different working lens.

Example role focus:

```txt
Product:
problem, users, scope, value, decisions, risks

Designer:
screens, user flow, interaction states, empty states, review moments

Frontend:
components, navigation, state, rendering rules, UI shell

Backend:
response shape, source traceability, persistence, schema

AI/LLM:
extraction task, uncertainty, contradiction handling, evaluation, regeneration rules
```

The role views are adaptive but bounded.

Nokta may choose which roles are relevant, but it should choose from a predefined catalog. The app should not invent unlimited tabs.

---

### 6.7 Contradiction Detection

Messy project material often contains conflicts.

Nokta should surface contradictions instead of smoothing them over.

Example:

```txt
Claim A:
"The MVP should not need a backend."

Claim B:
"The UI should be backend-driven."

Suggested resolution:
Use a mocked structured response for the first implementation. Treat backend-driven UI as a response contract, not as a deployed backend.

Status:
Unresolved until user confirms.
```

A contradiction is not a failure.

A contradiction is a decision waiting to happen.

Nokta should help the user see those decisions earlier.

---

### 6.8 Clarification Question Generation

When the input is ambiguous, Nokta asks targeted questions.

The goal is not to ask many questions. The goal is to ask the few questions that would most improve the project memory.

A clarification question should include:

- the question
- why it matters
- what it blocks
- related source fragments
- priority

Example:

```txt
Question:
Should the MVP persist actual markdown wiki files, or only preview the wiki patch?

Reason:
The larger Nokta concept is based on maintained wiki memory, but the first mobile app may only need to preview the proposed patch.

Blocks:
backend design, demo scope, persistence behavior

Priority:
High

Related sources:
S4, S8, S13
```

This keeps Nokta honest.

It should not hide uncertainty behind confident language.

---

### 6.9 Evidence Ledger

Nokta maintains an evidence ledger.

The evidence ledger maps raw fragments to extracted project claims.

It answers:

- which fragments were used?
- which fragments were ignored?
- which fragments were merged as duplicates?
- which claims are directly supported?
- which claims are inferred?
- which claims have weak support?
- which contradictions remain unresolved?

This is one of the features that makes Nokta more serious than a summarizer.

A good AI output is not only well-written.

A good AI output is auditable.

---

### 6.10 Human Review

Nokta should not silently convert AI output into trusted memory.

Every extracted item has a review state:

```txt
pending
confirmed
needs_review
discarded
locked
```

Definitions:

```txt
pending:
Extracted but not reviewed.

confirmed:
Accepted by the user as valid project memory.

needs_review:
Possibly useful, but uncertain or incomplete.

discarded:
Rejected by the user.

locked:
Stable memory that should survive regeneration.
```

The human owns trust.

The AI owns organization.

This is central to Nokta.

---

### 6.11 Wiki Patch Preview

The signature feature of Nokta Distillery is the wiki patch preview.

Instead of only showing a summary, Nokta shows what would be written into the maintained project memory.

Example:

```txt
CREATE  wiki/canonical-summary.md
CREATE  wiki/idea-cards/role-specific-project-views.md
CREATE  wiki/roles/product.md
CREATE  wiki/roles/frontend.md
CREATE  wiki/roles/backend.md
APPEND  wiki/contradictions.md
APPEND  wiki/open-questions.md
APPEND  wiki/log.md
```

Each patch item contains:

- action
- target path
- reason
- supporting sources
- affected idea cards
- review state

Example patch item:

```txt
Action:
CREATE

Path:
wiki/canonical-summary.md

Reason:
No canonical project summary exists yet.

Affected cards:
C1, C2, C4, C7

Sources:
S1, S2, S5, S8

Status:
Pending human review
```

The wiki patch preview is what makes Nokta more than a note summarizer.

The user is not just reading generated text.

The user is reviewing a proposed update to project memory.

---

### 6.12 Handoff Pack

Nokta produces a handoff pack.

The handoff pack is a compact context package that can be given to another AI tool, collaborator, or future implementation session.

It contains:

- canonical summary
- confirmed decisions
- locked constraints
- unresolved contradictions
- open questions
- role-specific notes
- next implementation steps
- source traceability summary

The purpose is continuity.

If the user switches models, tools, or sessions, they should not need to explain the project from the beginning.

Nokta’s maintained memory should carry the project forward.

---

## 7. Output Bundle

The output of Nokta Distillery is not one paragraph.

It is a structured project-memory bundle.

The bundle contains:

```txt
1. Source Fragments
2. Deduplicated Idea Cards
3. Canonical Project Summary
4. Role-Specific Views
5. Contradiction Queue
6. Clarification Questions
7. Evidence Ledger
8. Human Review States
9. Wiki Patch Preview
10. Handoff Pack
11. Next-Step Implementation Plan
```

This bundle should feel like something the user can act on immediately.

The goal is not only to understand old notes.

The goal is to create a better starting point for future work.

---

## 8. Why This Is Not Just Summarization

A summarizer says:

```txt
Here is what your notes said.
```

Nokta says:

```txt
Here is the project state I inferred.
Here are the repeated ideas I merged.
Here are the idea cards I created.
Here are the claims I am uncertain about.
Here are the contradictions I found.
Here are the role-specific views derived from the same source of truth.
Here are the sources behind each claim.
Here is the wiki patch I would create.
Here is the handoff pack for the next AI or human collaborator.
Please confirm what should become trusted memory.
```

That is the difference.

Summarization compresses content.

Nokta governs project memory.

---

## 9. Memory Model

Nokta uses a clear memory model.

### Source Fragment

A raw fragment from the user’s input.

Examples:

- one chat message
- one bullet point
- one copied prompt
- one note
- one decision fragment

### Memory Claim

A distilled statement extracted from one or more source fragments.

Example:

```txt
The app should generate role-specific views from a canonical summary.
```

### Idea Card

A structured card built around one memory claim.

It contains type, sources, confidence, review state, and related outputs.

### Canonical Summary

The current source of truth for the project.

### Role View

A perspective-specific projection of the canonical summary.

### Contradiction

A conflict between two or more memory claims.

### Clarification Question

A targeted question that would improve the project memory.

### Evidence Ledger Entry

A record that explains how source fragments map to extracted claims.

### Wiki Patch

A proposed update to the maintained project wiki.

### Handoff Pack

A compact project context package for continuing work elsewhere.

This memory model gives Nokta a clear internal language.

It also makes the product easier to implement because every output has a defined purpose.

---

## 10. Ambiguity Budget

Nokta should not pretend that all project knowledge is equally clear.

Each run should produce an ambiguity budget.

The ambiguity budget lists the most important unresolved areas.

Example:

```txt
High ambiguity:
- whether the app should persist real wiki files or only preview patches
- whether backend behavior is real or simulated in the first version

Medium ambiguity:
- exact role catalog
- how many clarification questions should appear per run

Low ambiguity:
- exact markdown file paths
- exact labels for review buttons
```

The ambiguity budget helps the user understand what needs a decision before implementation.

It also prevents the AI from overproducing confident structure from weak input.

---

## 11. Confidence Model

Each extracted item should include a confidence level.

Confidence is not mathematical truth.

It is a review signal.

Suggested levels:

```txt
High:
Directly supported by repeated or clear source fragments.

Medium:
Supported, but involves some interpretation.

Low:
Weakly supported or inferred. Should be reviewed.

Unknown:
Not enough evidence. Should become a clarification question.
```

Confidence helps prioritize review.

A low-confidence item should not quietly become project memory.

---

## 12. UI Concept

The first mobile app should feel like a distillation cockpit.

It should have four main screens.

---

### 12.1 Input

The user pastes messy project material or loads a sample dump.

Primary actions:

- load sample
- clear
- process with Nokta

The screen may show lightweight metadata:

- estimated source fragments
- selected mode
- possible duplicate density
- expected output bundle

---

### 12.2 Processing

The app shows a visible pipeline, not only a loading spinner.

Example pipeline:

```txt
1. Splitting source fragments
2. Grouping duplicates
3. Extracting durable claims
4. Building idea cards
5. Detecting contradictions
6. Creating canonical summary
7. Selecting role views
8. Building evidence ledger
9. Preparing wiki patch
10. Creating handoff pack
```

This makes the product feel like a structured system rather than a generic AI response.

---

### 12.3 Distilled Memory

This is the main output screen.

It shows:

- canonical project summary
- idea cards
- role tabs
- contradiction queue
- source traceability
- evidence ledger
- ambiguity budget
- wiki patch preview
- handoff pack
- review controls

The user can confirm, discard, mark for review, or lock items.

---

### 12.4 Clarify

This screen shows targeted clarification questions.

The user’s answers update the affected memory items.

Locked items should remain stable.

The app should not regenerate everything carelessly if only one uncertain area changed.

---

## 13. Backend Response Shape

The UI should be driven by structured data, not free-form prose.

A simplified response shape:

```ts
type NoktaDistillationResponse = {
  runId: string;

  sourceFragments: SourceFragment[];

  canonicalSummary: {
    title: string;
    oneLineDescription: string;
    problem: string;
    targetUsers: string[];
    coreConcept: string;
    mvpScope: string[];
    nonGoals: string[];
    mainWorkflow: string[];
    requirements: MemoryItem[];
    constraints: MemoryItem[];
    assumptions: MemoryItem[];
    decisions: MemoryItem[];
    openQuestions: ClarificationQuestion[];
    nextSteps: string[];
  };

  ideaCards: IdeaCard[];

  roleViews: RoleView[];

  contradictions: Contradiction[];

  clarificationQuestions: ClarificationQuestion[];

  evidenceLedger: EvidenceLedgerEntry[];

  ambiguityBudget: {
    high: string[];
    medium: string[];
    low: string[];
  };

  wikiPatchPreview: WikiPatch[];

  handoffPack: {
    summary: string;
    confirmedDecisions: string[];
    lockedConstraints: string[];
    unresolvedQuestions: string[];
    recommendedNextSteps: string[];
  };

  uiConfig: {
    selectedRoleTabs: string[];
    primaryScreen: "distilledMemory" | "clarify";
    showTraceability: boolean;
    showEvidenceLedger: boolean;
    showWikiPatchPreview: boolean;
    showHandoffPack: boolean;
    lockedItemIds: string[];
  };
};
```

The implementation can simplify the exact fields.

The concept should stay stable:

> the app receives messy material and renders a structured, reviewable project-memory bundle.

---

## 14. Product Contract

Nokta Distillery has a stable product contract.

The following must remain true during implementation:

### 14.1 Input Contract

The input is messy project material.

It may contain repeated ideas, contradictions, uncertain claims, future features, and incomplete requirements.

The app should not require the input to be clean.

---

### 14.2 Processing Contract

The system must perform, or simulate clearly, these operations:

- split the input into source fragments
- group duplicates
- extract durable project claims
- classify claims by type
- build idea cards
- construct one canonical summary
- generate role views from that canonical summary
- preserve source traceability
- surface contradictions
- ask clarification questions
- maintain review states
- preview wiki patch output
- produce a handoff pack

---

### 14.3 Output Contract

The output is a project-memory bundle, not a plain text summary.

At minimum, the output should include:

- canonical summary
- idea cards
- role views
- evidence or source traceability
- contradiction queue
- clarification questions
- wiki patch preview
- review states

The handoff pack and ambiguity budget strengthen the product, but the central output remains the reviewable project-memory bundle.

---

## 15. Design Evolution Protocol

The idea should be locked before implementation, but it should not become brittle.

Implementation discoveries should be handled as structured deltas.

A structured delta contains:

- what was discovered
- which part of the idea it affects
- whether it changes execution or the core thesis
- whether it should become a simplification, future feature, or locked decision

Example:

```txt
Discovery:
Real markdown persistence is too large for the first mobile version.

Effect:
Execution detail changes.

Decision:
Use wiki patch preview instead of real filesystem writes.

Core thesis:
Unchanged. Nokta still previews how messy project memory would become maintained wiki memory.
```

Another example:

```txt
Discovery:
Too many role tabs make the mobile UI noisy.

Effect:
UI scope changes.

Decision:
Select only the most relevant tabs from a predefined catalog.

Core thesis:
Unchanged. Role views still come from the canonical summary.
```

This allows the idea to improve during implementation without drifting into a different product.

The implementation can simplify execution.

It should not weaken the thesis.

---

## 16. Locked Product Principles

The following principles should remain stable.

### 16.1 Memory over chat

Nokta is about durable project memory, not temporary conversation.

### 16.2 Canonical summary first

Role views and handoff outputs come from one canonical project state.

### 16.3 Evidence before confidence

Important claims should be traceable to source fragments.

### 16.4 Human review before trust

The system proposes memory. The human decides what becomes trusted.

### 16.5 Contradictions are decision points

The app should surface conflicts instead of hiding them.

### 16.6 Adaptive but bounded UI

The system can choose relevant views, but only inside a defined shell.

### 16.7 Wiki patch as the memory bridge

The wiki patch preview connects the first app to the larger Nokta vision.

### 16.8 Handoff is a first-class outcome

The output should help the user continue the project in another tool, model, or session.

---

## 17. What Nokta Distillery Should Not Become

Nokta Distillery should not become:

- a generic note-taking app
- a generic chat export viewer
- a one-shot summarizer
- a simple todo generator
- a project management board
- a broad social platform
- a marketplace
- a payment product
- an NDA workflow product
- a full investor due diligence system
- a vague multi-agent platform

Those may be possible future directions, but they are not the first proof.

The first proof is project-memory distillation.

---

## 18. Future System Modes

Nokta can grow beyond the first distillation mode.

Future modes may include:

### Capture Mode

Starts from one raw project idea and enriches it into early project memory.

### Distill Mode

Accepts messy existing project material and turns it into structured memory.

This is the first implemented mode.

### Challenge Mode

Checks the project memory for weak claims, unsupported assumptions, contradictions, and overconfident reasoning.

### Handoff Mode

Packages the project state for another model, tool, human collaborator, or implementation agent.

### Lint Mode

Periodically checks the project memory for decay, duplication, stale assumptions, unresolved contradictions, and terminology drift.

These modes are future extensions of the same memory layer.

They should not distract from the first working proof.

---

## 19. Success Criteria

The first version succeeds if the user can:

1. Paste a messy project dump.
2. See the dump split into source fragments.
3. Receive deduplicated idea cards.
4. Receive one canonical project summary.
5. See role-specific views generated from that summary.
6. Inspect source traceability for important claims.
7. See contradictions instead of having them hidden.
8. Review an evidence ledger.
9. See an ambiguity budget.
10. Answer clarification questions.
11. Confirm, discard, mark for review, or lock extracted items.
12. Preview the wiki patch that would update project memory.
13. Export or read a handoff pack for continuing the project.

The product succeeds when the user feels that scattered project material has become a usable project state.

---

## 20. Final Thesis

Nokta is not a place to dump notes.

Nokta is a system for turning project fragments into project memory.

The first version proves this through Nokta Distillery:

```txt
messy fragments
→ source fragments
→ deduplicated idea cards
→ canonical project memory
→ role-specific views
→ evidence ledger
→ wiki patch preview
→ handoff pack
```

The long-term vision is an evolving project wiki.

The first concrete product is a distillation engine.

The core promise is simple:

> Nokta helps a project remember itself.