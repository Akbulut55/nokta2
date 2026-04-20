import { RoleKey } from '../schema/noktaTypes';

export type RoleDefinition = {
  role: RoleKey;
  lens: string;
  focusAreas: string[];
  outputStyle: string;
};

export const roleCatalog: Record<RoleKey, RoleDefinition> = {
  Product: {
    role: 'Product',
    lens: 'Scope, value, review gates, and proof of the MVP contract.',
    focusAreas: [
      'Core problem and project-memory thesis',
      'MVP scope and non-goals',
      'Review states and trust model',
      'Demo flow and signature feature emphasis',
    ],
    outputStyle: 'Outcome-first bullets with decision and risk emphasis.',
  },
  Designer: {
    role: 'Designer',
    lens: 'Screens, hierarchy, states, clarity, and review ergonomics.',
    focusAreas: [
      'Input to processing to memory to clarify flow',
      'Card hierarchy and contrast',
      'Contradiction, evidence, and wiki patch treatment',
      'Calm near-dark cockpit feel',
    ],
    outputStyle: 'Interaction-focused bullets with state and layout cues.',
  },
  Frontend: {
    role: 'Frontend',
    lens: 'Navigation shell, state model, and component composition.',
    focusAreas: [
      'Expo screen flow and local state transitions',
      'Structured rendering from deterministic response data',
      'Review controls and role tab interactions',
      'Performance-friendly card rendering',
    ],
    outputStyle: 'Implementation bullets with component and state detail.',
  },
  Backend: {
    role: 'Backend',
    lens: 'Response contract, traceability shape, persistence boundary, and schema.',
    focusAreas: [
      'Deterministic response model',
      'Fragment IDs, evidence ledger, and patch schema',
      'Mocked or local-only contract for MVP',
      'Future persistence boundary',
    ],
    outputStyle: 'Contract and data-shape bullets with implementation constraints.',
  },
  'AI/LLM': {
    role: 'AI/LLM',
    lens: 'Extraction boundaries, ambiguity handling, and regeneration rules.',
    focusAreas: [
      'Rule-based claim extraction and grouping',
      'Contradiction and clarification generation',
      'Confidence signaling and auditability',
      'Avoiding generic summarization drift',
    ],
    outputStyle: 'Reasoning-system bullets with guardrail emphasis.',
  },
};

