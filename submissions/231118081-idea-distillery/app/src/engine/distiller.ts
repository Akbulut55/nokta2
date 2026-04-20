import { roleCatalog } from '../data/roleCatalog';
import {
  AmbiguityBudget,
  CanonicalSummary,
  ClarificationQuestion,
  Confidence,
  Contradiction,
  DuplicateGroup,
  EvidenceLedgerEntry,
  HandoffPack,
  IdeaCard,
  MemoryItemType,
  NoktaDistillationResponse,
  ProcessingStats,
  ReviewState,
  RoleKey,
  RoleView,
  SourceFragment,
  SummaryMemoryItem,
  UiConfig,
  WikiPatch,
} from '../schema/noktaTypes';

type SummaryBucket = 'requirements' | 'constraints' | 'assumptions' | 'decisions';

type ConceptRule = {
  key: string;
  title: string;
  type: MemoryItemType;
  claim: string;
  keywords: string[];
  relatedRoles: RoleKey[];
  wikiTargets: string[];
  summaryBucket: SummaryBucket;
  confidenceBoost?: number;
};

type ConceptGroup = {
  key: string;
  title: string;
  type: MemoryItemType;
  claim: string;
  sourceIds: string[];
  relatedRoles: RoleKey[];
  wikiTargets: string[];
  summaryBucket: SummaryBucket;
  confidenceBoost?: number;
};

const DEFAULT_REVIEW_STATE: ReviewState = 'pending';

const STOP_WORDS = new Set([
  'a',
  'an',
  'and',
  'are',
  'as',
  'at',
  'be',
  'but',
  'by',
  'for',
  'from',
  'has',
  'have',
  'in',
  'into',
  'is',
  'it',
  'its',
  'just',
  'later',
  'like',
  'maybe',
  'must',
  'need',
  'needs',
  'no',
  'not',
  'of',
  'on',
  'or',
  'our',
  'real',
  'same',
  'should',
  'so',
  'that',
  'the',
  'their',
  'them',
  'this',
  'to',
  'use',
  'with',
]);

const conceptRules: ConceptRule[] = [
  {
    key: 'project-memory',
    title: 'Project memory over raw chat',
    type: 'requirement',
    claim:
      'The product should turn scattered project fragments into maintained project memory instead of leaving project state trapped inside chats and notes.',
    keywords: ['project memory', 'memory layer', 'maintained', 'remember', 'knowledge layer'],
    relatedRoles: ['Product', 'AI/LLM'],
    wikiTargets: ['wiki/canonical-summary.md', 'wiki/log.md'],
    summaryBucket: 'requirements',
    confidenceBoost: 1,
  },
  {
    key: 'not-summarizer',
    title: 'Not a generic summarizer',
    type: 'constraint',
    claim:
      'The MVP must not collapse into a generic summarizer or generic note app; it has to distill project state into a reviewable memory bundle.',
    keywords: ['not only summarize', 'generic summarizer', 'not a chatbot', 'not a note app', 'not only summary'],
    relatedRoles: ['Product', 'Designer', 'AI/LLM'],
    wikiTargets: ['wiki/canonical-summary.md'],
    summaryBucket: 'constraints',
    confidenceBoost: 1,
  },
  {
    key: 'canonical-summary',
    title: 'Canonical summary first',
    type: 'decision',
    claim:
      'One canonical project summary should become the source of truth before any role-specific view or handoff output is generated.',
    keywords: ['canonical summary', 'source of truth', 'summary first'],
    relatedRoles: ['Product', 'Frontend', 'Backend', 'AI/LLM'],
    wikiTargets: ['wiki/canonical-summary.md'],
    summaryBucket: 'decisions',
  },
  {
    key: 'role-views',
    title: 'Role-specific views from one summary',
    type: 'role_need',
    claim:
      'Product, Designer, Frontend, Backend, and AI/LLM views should be projected from the same canonical summary to prevent drift.',
    keywords: ['role tabs', 'role-specific', 'frontend', 'backend', 'designer', 'product', 'ai/llm', 'role views'],
    relatedRoles: ['Product', 'Designer', 'Frontend', 'Backend', 'AI/LLM'],
    wikiTargets: [
      'wiki/roles/product.md',
      'wiki/roles/designer.md',
      'wiki/roles/frontend.md',
      'wiki/roles/backend.md',
      'wiki/roles/ai-llm.md',
    ],
    summaryBucket: 'requirements',
  },
  {
    key: 'traceability',
    title: 'Evidence and source traceability',
    type: 'requirement',
    claim:
      'Important claims should keep visible source traceability through supporting source IDs and an evidence ledger.',
    keywords: ['source trace', 'traceability', 'evidence ledger', 'supporting sources', 'evidence'],
    relatedRoles: ['Product', 'Backend', 'AI/LLM'],
    wikiTargets: ['wiki/evidence-ledger.md'],
    summaryBucket: 'requirements',
  },
  {
    key: 'human-review',
    title: 'Human review before trust',
    type: 'decision',
    claim:
      'The system should propose memory, but the human should control what becomes trusted through explicit review states.',
    keywords: ['human review', 'confirm facts', 'trusted memory', 'review states', 'locked', 'pending', 'confirmed'],
    relatedRoles: ['Product', 'Designer', 'Frontend'],
    wikiTargets: ['wiki/review-states.md', 'wiki/log.md'],
    summaryBucket: 'decisions',
  },
  {
    key: 'wiki-patch',
    title: 'Wiki Patch Preview',
    type: 'requirement',
    claim:
      'Wiki Patch Preview should be the signature feature, showing how distilled memory would update the maintained project wiki.',
    keywords: ['wiki patch', 'patch preview', 'wiki files', 'signature feature'],
    relatedRoles: ['Product', 'Designer', 'Frontend', 'Backend'],
    wikiTargets: ['wiki/canonical-summary.md', 'wiki/open-questions.md', 'wiki/log.md'],
    summaryBucket: 'requirements',
    confidenceBoost: 1,
  },
  {
    key: 'handoff-pack',
    title: 'Handoff pack for continuity',
    type: 'requirement',
    claim:
      'The output should include a handoff pack so the next model or collaborator can continue from the distilled project state.',
    keywords: ['handoff pack', 'next model', 'next collaborator', 'continue the project'],
    relatedRoles: ['Product', 'Backend', 'AI/LLM'],
    wikiTargets: ['wiki/handoff-pack.md'],
    summaryBucket: 'requirements',
  },
  {
    key: 'clarify',
    title: 'Targeted clarification questions',
    type: 'open_question',
    claim:
      'The system should ask a small number of targeted clarification questions when ambiguity blocks trustworthy project memory.',
    keywords: ['clarification', 'questions', 'unclear', 'ambiguity', 'question generation'],
    relatedRoles: ['Product', 'AI/LLM'],
    wikiTargets: ['wiki/open-questions.md'],
    summaryBucket: 'assumptions',
  },
  {
    key: 'contradictions',
    title: 'Contradictions as decision points',
    type: 'contradiction',
    claim:
      'Contradictions should be surfaced explicitly instead of being silently smoothed over.',
    keywords: ['contradiction', 'conflict', 'contradictions', 'smoothing them over'],
    relatedRoles: ['Product', 'AI/LLM'],
    wikiTargets: ['wiki/contradictions.md'],
    summaryBucket: 'requirements',
  },
  {
    key: 'local-engine',
    title: 'Local deterministic MVP engine',
    type: 'constraint',
    claim:
      'The MVP can use a local deterministic distillation engine and should not require a live AI API key.',
    keywords: ['no live ai api', 'local deterministic', 'local engine', 'no ai api', 'deterministic engine'],
    relatedRoles: ['Frontend', 'Backend', 'AI/LLM'],
    wikiTargets: ['wiki/implementation.md'],
    summaryBucket: 'constraints',
  },
  {
    key: 'no-backend',
    title: 'No real backend required for MVP',
    type: 'constraint',
    claim:
      'The first version does not need a deployed backend as long as the data contract remains structured and transparent.',
    keywords: ['does not need a real backend', 'not need a real backend', 'no backend', 'does not need backend'],
    relatedRoles: ['Frontend', 'Backend'],
    wikiTargets: ['wiki/implementation.md'],
    summaryBucket: 'constraints',
  },
  {
    key: 'backend-driven-shape',
    title: 'Backend-driven response shape',
    type: 'implementation_hint',
    claim:
      'Even without a live backend, the UI should read from a backend-shaped response contract so future persistence remains possible.',
    keywords: ['backend-driven', 'structured response shape', 'response shape', 'contract'],
    relatedRoles: ['Frontend', 'Backend'],
    wikiTargets: ['wiki/implementation.md'],
    summaryBucket: 'assumptions',
  },
  {
    key: 'ambiguity-budget',
    title: 'Ambiguity budget',
    type: 'risk',
    claim:
      'The output should state what remains unresolved through a visible ambiguity budget with high, medium, and low uncertainty.',
    keywords: ['ambiguity budget', 'still unclear', 'unclear'],
    relatedRoles: ['Product', 'AI/LLM'],
    wikiTargets: ['wiki/open-questions.md'],
    summaryBucket: 'assumptions',
  },
  {
    key: 'processing-pipeline',
    title: 'Visible distillation pipeline',
    type: 'requirement',
    claim:
      'The app should show a visible distillation pipeline so the product feels like an engineered process instead of a generic loading state.',
    keywords: ['visible processing pipeline', 'not just a spinner', 'pipeline', 'processing pipeline'],
    relatedRoles: ['Designer', 'Frontend'],
    wikiTargets: ['wiki/ui/processing.md'],
    summaryBucket: 'requirements',
  },
];

const contradictionPatterns = [
  {
    id: 'backend-scope',
    title: 'Backend scope conflict',
    leftKeywords: ['no backend', 'does not need a real backend', 'not need a real backend'],
    rightKeywords: ['backend-driven', 'structured response shape', 'response shape'],
    claimA: 'The MVP should avoid a real backend.',
    claimB: 'The UI should still feel backend-driven.',
    suggestedResolution:
      'Use a mocked structured response contract in the MVP so the UI can stay backend-shaped without shipping a live service.',
    blockedArea: 'Response contract and persistence boundary',
  },
  {
    id: 'summary-vs-patch',
    title: 'Summary versus wiki patch conflict',
    leftKeywords: ['only needs to summarize', 'only summarize', 'not only summarize'],
    rightKeywords: ['wiki patch', 'patch preview', 'wiki files'],
    claimA: 'A plain summary could be enough.',
    claimB: 'The signature artifact should be a wiki patch preview.',
    suggestedResolution:
      'Keep the summary as a supporting artifact, but make the wiki patch the primary review surface for durable project memory.',
    blockedArea: 'Primary output design',
  },
  {
    id: 'automatic-vs-review',
    title: 'Automatic trust conflict',
    leftKeywords: ['save automatically', 'automatic', 'without asking'],
    rightKeywords: ['human review', 'confirm facts', 'trusted memory', 'review states'],
    claimA: 'The system could save or trust output automatically.',
    claimB: 'A human should confirm memory before trust.',
    suggestedResolution:
      'Allow automated organization, but require explicit human confirmation before anything is treated as trusted project memory.',
    blockedArea: 'Trust and review workflow',
  },
];

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9/\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function unique<T>(items: T[]) {
  return Array.from(new Set(items));
}

function toTitleCase(value: string) {
  return value.replace(/\b\w/g, (char) => char.toUpperCase());
}

function significantTokens(text: string) {
  return normalizeText(text)
    .split(' ')
    .filter((token) => token.length > 2 && !STOP_WORDS.has(token));
}

function similarityScore(left: string[], right: string[]) {
  const leftSet = new Set(left);
  const rightSet = new Set(right);
  const union = new Set([...leftSet, ...rightSet]);
  let intersectionCount = 0;

  leftSet.forEach((token) => {
    if (rightSet.has(token)) {
      intersectionCount += 1;
    }
  });

  return union.size === 0 ? 0 : intersectionCount / union.size;
}

function inferFragmentTags(text: string) {
  const normalized = normalizeText(text);
  const tags: string[] = [];

  if (normalized.includes('review') || normalized.includes('confirm')) {
    tags.push('review');
  }
  if (normalized.includes('wiki')) {
    tags.push('wiki');
  }
  if (normalized.includes('role')) {
    tags.push('role');
  }
  if (normalized.includes('backend')) {
    tags.push('backend');
  }
  if (normalized.includes('frontend') || normalized.includes('ui')) {
    tags.push('frontend');
  }
  if (normalized.includes('question') || normalized.includes('ambiguity')) {
    tags.push('clarify');
  }
  if (normalized.includes('evidence') || normalized.includes('trace')) {
    tags.push('evidence');
  }

  return unique(tags);
}

function splitIntoFragments(rawInput: string): SourceFragment[] {
  const pieces = rawInput
    .split(/\r?\n/)
    .flatMap((line, index) =>
      line
        .split(/(?:\s*;\s*)/)
        .map((part) => ({ part, line: index + 1 })),
    )
    .map(({ part, line }) => ({
      text: part.replace(/^[-*\u2022\d.)\s]+/, '').trim(),
      line,
    }))
    .filter(({ text }) => text.length > 0);

  return pieces.map(({ text, line }, index) => ({
    id: `S${index + 1}`,
    text,
    normalized: normalizeText(text),
    line,
    tags: inferFragmentTags(text),
  }));
}

function inferGenericType(text: string): MemoryItemType {
  const normalized = normalizeText(text);

  if (normalized.includes('risk')) {
    return 'risk';
  }
  if (normalized.includes('future') || normalized.includes('later')) {
    return 'future_feature';
  }
  if (normalized.includes('question') || normalized.includes('unclear')) {
    return 'open_question';
  }
  if (normalized.includes('decision') || normalized.includes('must')) {
    return 'decision';
  }
  if (normalized.includes('no ') || normalized.includes('not ')) {
    return 'constraint';
  }

  return 'requirement';
}

function inferGenericRoles(text: string): RoleKey[] {
  const normalized = normalizeText(text);
  const roles: RoleKey[] = [];

  if (normalized.includes('product') || normalized.includes('scope')) {
    roles.push('Product');
  }
  if (normalized.includes('design') || normalized.includes('screen') || normalized.includes('ui')) {
    roles.push('Designer');
  }
  if (normalized.includes('frontend') || normalized.includes('component') || normalized.includes('expo')) {
    roles.push('Frontend');
  }
  if (normalized.includes('backend') || normalized.includes('schema') || normalized.includes('response')) {
    roles.push('Backend');
  }
  if (normalized.includes('ai') || normalized.includes('llm') || normalized.includes('extract')) {
    roles.push('AI/LLM');
  }

  return roles.length > 0 ? unique(roles) : ['Product'];
}

function determineConfidence(sourceCount: number, confidenceBoost = 0): Confidence {
  const weighted = sourceCount + confidenceBoost;

  if (weighted >= 3) {
    return 'high';
  }
  if (weighted === 2) {
    return 'medium';
  }
  if (weighted === 1) {
    return 'low';
  }

  return 'unknown';
}

function groupByConceptRules(sourceFragments: SourceFragment[]) {
  const conceptGroups = new Map<string, ConceptGroup>();
  const matchedSourceIds = new Set<string>();

  sourceFragments.forEach((fragment) => {
    conceptRules.forEach((rule) => {
      const didMatch = rule.keywords.some((keyword) => fragment.normalized.includes(normalizeText(keyword)));

      if (!didMatch) {
        return;
      }

      matchedSourceIds.add(fragment.id);
      const current = conceptGroups.get(rule.key);

      if (current) {
        current.sourceIds.push(fragment.id);
      } else {
        conceptGroups.set(rule.key, {
          key: rule.key,
          title: rule.title,
          type: rule.type,
          claim: rule.claim,
          sourceIds: [fragment.id],
          relatedRoles: rule.relatedRoles,
          wikiTargets: rule.wikiTargets,
          summaryBucket: rule.summaryBucket,
          confidenceBoost: rule.confidenceBoost,
        });
      }
    });
  });

  return {
    conceptGroups: Array.from(conceptGroups.values()).map((group) => ({
      ...group,
      sourceIds: unique(group.sourceIds),
    })),
    matchedSourceIds,
  };
}

function groupUnmatchedFragments(sourceFragments: SourceFragment[], matchedSourceIds: Set<string>) {
  const groups: Array<{
    key: string;
    sourceIds: string[];
    tokens: string[];
    text: string;
  }> = [];

  sourceFragments
    .filter((fragment) => !matchedSourceIds.has(fragment.id))
    .forEach((fragment) => {
      const tokens = significantTokens(fragment.text);
      if (tokens.length === 0) {
        return;
      }

      let bestGroupIndex = -1;
      let bestScore = 0;

      groups.forEach((group, index) => {
        const score = similarityScore(tokens, group.tokens);
        if (score > bestScore) {
          bestScore = score;
          bestGroupIndex = index;
        }
      });

      if (bestGroupIndex >= 0 && bestScore >= 0.45) {
        groups[bestGroupIndex].sourceIds.push(fragment.id);
        groups[bestGroupIndex].tokens = unique([...groups[bestGroupIndex].tokens, ...tokens]);
        return;
      }

      groups.push({
        key: `generic-${groups.length + 1}`,
        sourceIds: [fragment.id],
        tokens,
        text: fragment.text,
      });
    });

  return groups;
}

function buildIdeaCards(
  sourceFragments: SourceFragment[],
  conceptGroups: ConceptGroup[],
  genericGroups: ReturnType<typeof groupUnmatchedFragments>,
) {
  const cards: IdeaCard[] = [];

  conceptGroups.forEach((group, index) => {
    cards.push({
      id: `C${index + 1}`,
      title: group.title,
      type: group.type,
      distilledClaim: group.claim,
      supportingSources: group.sourceIds,
      confidence: determineConfidence(group.sourceIds.length, group.confidenceBoost),
      reviewState: DEFAULT_REVIEW_STATE,
      relatedRoles: group.relatedRoles,
      relatedContradictions: [],
      wikiPatchImpact: group.wikiTargets,
    });
  });

  genericGroups.forEach((group, index) => {
    const primarySource = sourceFragments.find((fragment) => fragment.id === group.sourceIds[0]);
    const titleTokens = group.tokens.slice(0, 4);
    const title = titleTokens.length > 0 ? toTitleCase(titleTokens.join(' ')) : `Captured insight ${index + 1}`;
    const claim =
      primarySource?.text ??
      `Distilled insight from related fragments: ${group.sourceIds.join(', ')}`;

    cards.push({
      id: `C${conceptGroups.length + index + 1}`,
      title,
      type: inferGenericType(claim),
      distilledClaim: claim,
      supportingSources: group.sourceIds,
      confidence: determineConfidence(group.sourceIds.length),
      reviewState: DEFAULT_REVIEW_STATE,
      relatedRoles: inferGenericRoles(claim),
      relatedContradictions: [],
      wikiPatchImpact: ['wiki/idea-cards/captured-insights.md'],
    });
  });

  if (cards.length === 0 && sourceFragments.length > 0) {
    cards.push({
      id: 'C1',
      title: 'Captured project direction',
      type: 'requirement',
      distilledClaim: sourceFragments[0].text,
      supportingSources: [sourceFragments[0].id],
      confidence: 'low',
      reviewState: DEFAULT_REVIEW_STATE,
      relatedRoles: ['Product'],
      relatedContradictions: [],
      wikiPatchImpact: ['wiki/idea-cards/captured-project-direction.md'],
    });
  }

  return cards;
}

function buildDuplicateGroups(
  conceptGroups: ConceptGroup[],
  genericGroups: ReturnType<typeof groupUnmatchedFragments>,
): DuplicateGroup[] {
  const duplicates: DuplicateGroup[] = [];

  conceptGroups
    .filter((group) => group.sourceIds.length > 1)
    .forEach((group, index) => {
      duplicates.push({
        id: `D${index + 1}`,
        label: group.title,
        sourceIds: group.sourceIds,
        rationale: 'Multiple fragments converged on the same durable concept.',
      });
    });

  genericGroups
    .filter((group) => group.sourceIds.length > 1)
    .forEach((group, index) => {
      duplicates.push({
        id: `D${duplicates.length + index + 1}`,
        label: toTitleCase(group.tokens.slice(0, 4).join(' ') || group.key),
        sourceIds: group.sourceIds,
        rationale: 'Token overlap suggests a repeated or overlapping project idea.',
      });
    });

  return duplicates;
}

function buildContradictions(sourceFragments: SourceFragment[]): Contradiction[] {
  const contradictions: Contradiction[] = [];

  contradictionPatterns.forEach((pattern, index) => {
    const leftMatches = sourceFragments.filter((fragment) =>
      pattern.leftKeywords.some((keyword) => fragment.normalized.includes(normalizeText(keyword))),
    );
    const rightMatches = sourceFragments.filter((fragment) =>
      pattern.rightKeywords.some((keyword) => fragment.normalized.includes(normalizeText(keyword))),
    );

    if (leftMatches.length === 0 || rightMatches.length === 0) {
      return;
    }

    contradictions.push({
      id: `X${index + 1}`,
      title: pattern.title,
      claimA: pattern.claimA,
      claimB: pattern.claimB,
      suggestedResolution: pattern.suggestedResolution,
      blockedArea: pattern.blockedArea,
      status: 'unresolved',
      supportingSources: unique([...leftMatches.map((fragment) => fragment.id), ...rightMatches.map((fragment) => fragment.id)]),
      reviewState: DEFAULT_REVIEW_STATE,
    });
  });

  return contradictions;
}

function linkContradictionsToCards(cards: IdeaCard[], contradictions: Contradiction[]) {
  return cards.map((card) => ({
    ...card,
    relatedContradictions: contradictions
      .filter((contradiction) =>
        contradiction.supportingSources.some((sourceId) => card.supportingSources.includes(sourceId)),
      )
      .map((contradiction) => contradiction.id),
  }));
}

function buildClarificationQuestions(
  sourceFragments: SourceFragment[],
  cards: IdeaCard[],
  contradictions: Contradiction[],
): ClarificationQuestion[] {
  const questions: ClarificationQuestion[] = contradictions.map((contradiction, index) => ({
    id: `Q${index + 1}`,
    question:
      contradiction.title === 'Backend scope conflict'
        ? 'Should the MVP stay local-only while preserving a backend-shaped response contract?'
        : contradiction.title === 'Summary versus wiki patch conflict'
          ? 'Should the demo foreground the wiki patch preview as the primary artifact instead of a plain summary?'
          : 'Should human review remain mandatory before generated memory is treated as trusted?'
    ,
    reason: contradiction.suggestedResolution,
    blockedArea: contradiction.blockedArea,
    priority: 'High',
    relatedSources: contradiction.supportingSources,
    affectedItemIds: [contradiction.id],
    reviewState: DEFAULT_REVIEW_STATE,
  }));

  const hasRoleQuestion = questions.some((question) => question.blockedArea.includes('Role'));
  const roleCard = cards.find((card) => card.title.includes('Role-specific'));
  if (!hasRoleQuestion && roleCard) {
    questions.push({
      id: `Q${questions.length + 1}`,
      question: 'Which role tabs should be visible by default on the mobile home state?',
      reason: 'The app supports multiple lenses, but mobile density benefits from a small default set.',
      blockedArea: 'Role tab prioritization',
      priority: 'Medium',
      relatedSources: roleCard.supportingSources,
      affectedItemIds: [roleCard.id],
      reviewState: DEFAULT_REVIEW_STATE,
    });
  }

  const hasPersistenceQuestion = questions.some((question) => question.blockedArea.includes('persistence'));
  const wikiCard = cards.find((card) => card.title.includes('Wiki Patch'));
  if (!hasPersistenceQuestion && wikiCard) {
    questions.push({
      id: `Q${questions.length + 1}`,
      question: 'Should the MVP stop at Wiki Patch Preview, or simulate future markdown persistence more explicitly?',
      reason: 'Preview-only keeps the MVP small, but persistence affects how users understand the long-term memory bridge.',
      blockedArea: 'Wiki persistence boundary',
      priority: 'Medium',
      relatedSources: wikiCard.supportingSources,
      affectedItemIds: [wikiCard.id],
      reviewState: DEFAULT_REVIEW_STATE,
    });
  }

  const ambiguousFragments = sourceFragments.filter(
    (fragment) =>
      fragment.normalized.includes('maybe') ||
      fragment.normalized.includes('probably') ||
      fragment.normalized.includes('future'),
  );

  if (questions.length < 4 && ambiguousFragments.length > 0) {
    questions.push({
      id: `Q${questions.length + 1}`,
      question: 'Which future-facing ideas should stay explicitly out of the MVP demo?',
      reason: 'Some fragments mention later extensions, and that can blur the current product proof.',
      blockedArea: 'MVP scope control',
      priority: 'Low',
      relatedSources: ambiguousFragments.slice(0, 3).map((fragment) => fragment.id),
      affectedItemIds: cards
        .filter((card) => card.type === 'future_feature')
        .map((card) => card.id),
      reviewState: DEFAULT_REVIEW_STATE,
    });
  }

  return questions.slice(0, 4);
}

function buildSummaryItems(cards: IdeaCard[], bucket: SummaryBucket): SummaryMemoryItem[] {
  return cards
    .filter((card) => {
      if (bucket === 'requirements') {
        return card.type === 'requirement' || card.type === 'role_need';
      }
      if (bucket === 'constraints') {
        return card.type === 'constraint';
      }
      if (bucket === 'decisions') {
        return card.type === 'decision';
      }
      return card.type === 'assumption' || card.type === 'implementation_hint' || card.type === 'risk';
    })
    .slice(0, 4)
    .map((card) => ({
      id: `summary-${bucket}-${card.id}`,
      text: card.distilledClaim,
      supportingSources: card.supportingSources,
      reviewState: card.reviewState,
    }));
}

function buildCanonicalSummary(
  rawInput: string,
  cards: IdeaCard[],
  contradictions: Contradiction[],
  questions: ClarificationQuestion[],
): CanonicalSummary {
  const normalizedInput = normalizeText(rawInput);
  const title = normalizedInput.includes('nokta') ? 'Nokta Distillery' : 'Distilled Project';
  const topRequirement = cards.find((card) => card.type === 'requirement' || card.type === 'role_need');
  const projectMemoryCard = cards.find((card) => card.title.includes('Project memory'));
  const localEngineCard = cards.find((card) => card.title.includes('Local deterministic'));
  const nonGoals = [
    'Do not turn the experience into a generic note app.',
    'Do not collapse the product into a plain summarizer.',
  ];

  if (localEngineCard) {
    nonGoals.push('Do not require a live AI API key for the MVP demo.');
  }

  return {
    title,
    oneLineDescription:
      'Compile messy project fragments into a reviewable memory bundle with idea cards, role views, evidence, and a wiki patch preview.',
    problem:
      projectMemoryCard?.distilledClaim ??
      'Project intent decays when decisions, assumptions, and requirements stay scattered across transient notes and chats.',
    targetUsers: [
      'Product leads',
      'Designers',
      'Frontend engineers',
      'Backend engineers',
      'AI collaborators',
    ],
    coreConcept:
      topRequirement?.distilledClaim ??
      'Convert noisy project material into durable, reviewable project memory.',
    mvpScope: [
      'Split messy input into source fragments with stable IDs.',
      'Create deduplicated idea cards and one canonical summary.',
      'Generate role views, evidence, contradictions, clarification, and handoff output.',
      'Emphasize Wiki Patch Preview as the signature artifact.',
    ],
    nonGoals: unique(nonGoals),
    mainWorkflow: [
      'Fragments -> Source Fragments',
      'Source Fragments -> Idea Cards',
      'Idea Cards -> Canonical Summary',
      'Canonical Summary -> Role Views',
      'Role Views -> Evidence + Wiki Patch + Handoff Pack',
    ],
    requirements: buildSummaryItems(cards, 'requirements'),
    constraints: buildSummaryItems(cards, 'constraints'),
    assumptions: buildSummaryItems(cards, 'assumptions'),
    decisions: buildSummaryItems(cards, 'decisions'),
    contradictions: contradictions.map((contradiction) => contradiction.title),
    openQuestions: questions.map((question) => question.question),
    nextSteps: [
      'Review the canonical summary and highest-confidence cards.',
      'Resolve contradictions before trusting the patch.',
      'Answer the clarification queue and lock stable memory.',
      'Use the handoff pack to continue implementation.',
    ],
  };
}

function buildRoleView(role: RoleKey, summary: CanonicalSummary, cards: IdeaCard[]): RoleView {
  const definition = roleCatalog[role];
  const relevantCards = cards.filter((card) => card.relatedRoles.includes(role));
  const relevantClaims = relevantCards.map((card) => card.distilledClaim);

  const roleBullets: Record<RoleKey, string[]> = {
    Product: [
      `Protect the MVP scope around ${summary.title}.`,
      'Keep human review and trust boundaries explicit.',
      'Use Wiki Patch Preview as the core demo artifact.',
      'Treat contradictions as decisions to resolve, not noise to hide.',
    ],
    Designer: [
      'Keep the four-screen flow compact, dark, and instrument-like.',
      'Use distinct card treatments for evidence, contradictions, and patch output.',
      'Preserve strong hierarchy so the demo scans in under a minute.',
      'Make review actions feel operational rather than conversational.',
    ],
    Frontend: [
      'Drive the UI from structured deterministic response data.',
      'Keep role tabs, review controls, and processing states local and responsive.',
      'Render source traceability and patch items without chat metaphors.',
      'Use card density and tonal layering instead of heavy dividers.',
    ],
    Backend: [
      'Preserve stable fragment IDs, source arrays, and patch paths.',
      'Keep the MVP local-only while maintaining a future-safe response shape.',
      'Treat the evidence ledger and review states as first-class schema fields.',
      'Preserve a clean boundary for future markdown persistence.',
    ],
    'AI/LLM': [
      'Use bounded extraction and grouping rather than open-ended summarization.',
      'Keep confidence and ambiguity visible for review.',
      'Generate targeted clarification questions from contradictions and weak signals.',
      'Do not let regeneration overwrite locked memory without intent.',
    ],
  };

  return {
    id: `role-${role.toLowerCase().replace(/[^a-z]/g, '-')}`,
    role,
    lens: definition.lens,
    summary:
      relevantClaims[0] ??
      `${role} view derived from the canonical summary and current memory bundle.`,
    bullets: unique([...roleBullets[role], ...relevantClaims]).slice(0, 5),
    relatedCardIds: relevantCards.map((card) => card.id),
    sourceIds: unique(relevantCards.flatMap((card) => card.supportingSources)),
  };
}

function buildEvidenceLedger(
  cards: IdeaCard[],
  contradictions: Contradiction[],
  sourceFragments: SourceFragment[],
): EvidenceLedgerEntry[] {
  const ledger: EvidenceLedgerEntry[] = cards.map((card, index) => ({
    id: `E${index + 1}`,
    claimId: card.id,
    claimTitle: card.title,
    evidenceType: card.supportingSources.length > 1 ? 'merged' : 'direct',
    sourceIds: card.supportingSources,
    note:
      card.supportingSources.length > 1
        ? 'Multiple source fragments were merged into one durable memory claim.'
        : 'Directly supported by a single source fragment.',
    confidence: card.confidence,
  }));

  contradictions.forEach((contradiction, index) => {
    ledger.push({
      id: `E${ledger.length + index + 1}`,
      claimId: contradiction.id,
      claimTitle: contradiction.title,
      evidenceType: 'inferred',
      sourceIds: contradiction.supportingSources,
      note: 'Pattern-based contradiction detected across conflicting fragments.',
      confidence: 'medium',
    });
  });

  const referencedSourceIds = new Set(ledger.flatMap((entry) => entry.sourceIds));
  sourceFragments
    .filter((fragment) => !referencedSourceIds.has(fragment.id))
    .slice(0, 3)
    .forEach((fragment, index) => {
      ledger.push({
        id: `E${ledger.length + index + 1}`,
        claimId: fragment.id,
        claimTitle: 'Unmerged fragment',
        evidenceType: 'ignored',
        sourceIds: [fragment.id],
        note: 'Captured for traceability but not promoted into a durable card.',
        confidence: 'low',
      });
    });

  return ledger;
}

function buildAmbiguityBudget(
  cards: IdeaCard[],
  contradictions: Contradiction[],
  questions: ClarificationQuestion[],
): AmbiguityBudget {
  return {
    high: unique([
      ...contradictions.map((contradiction) => contradiction.title),
      ...questions.filter((question) => question.priority === 'High').map((question) => question.question),
    ]).slice(0, 4),
    medium: unique([
      ...cards
        .filter((card) => card.confidence === 'medium' || card.confidence === 'low')
        .map((card) => `${card.title} still needs stronger evidence.`),
      ...questions.filter((question) => question.priority === 'Medium').map((question) => question.question),
    ]).slice(0, 4),
    low: [
      'Exact markdown persistence can remain future-scoped in the MVP.',
      'Role tab ordering can stay adjustable without changing the thesis.',
      'Patch file naming can evolve after the demo if the structure stays stable.',
    ],
  };
}

function buildWikiPatch(cards: IdeaCard[], contradictions: Contradiction[], questions: ClarificationQuestion[]): WikiPatch[] {
  const roleCard = cards.find((card) => card.title.includes('Role-specific'));
  const patch: WikiPatch[] = [
    {
      id: 'P1',
      action: 'CREATE',
      path: 'wiki/canonical-summary.md',
      reason: 'No canonical summary exists yet for the distilled project state.',
      sourceIds: unique(cards.flatMap((card) => card.supportingSources)).slice(0, 6),
      affectedCardIds: cards.slice(0, 5).map((card) => card.id),
      reviewState: DEFAULT_REVIEW_STATE,
    },
    {
      id: 'P2',
      action: 'CREATE',
      path: 'wiki/idea-cards/role-specific-views.md',
      reason: 'Role-driven views need a stable memory artifact.',
      sourceIds: roleCard?.supportingSources ?? [],
      affectedCardIds: roleCard ? [roleCard.id] : [],
      reviewState: DEFAULT_REVIEW_STATE,
    },
    {
      id: 'P3',
      action: 'CREATE',
      path: 'wiki/roles/product.md',
      reason: 'Role projection should create a Product operating view from canonical memory.',
      sourceIds: roleCard?.supportingSources ?? [],
      affectedCardIds: roleCard ? [roleCard.id] : [],
      reviewState: DEFAULT_REVIEW_STATE,
    },
    {
      id: 'P4',
      action: 'CREATE',
      path: 'wiki/roles/frontend.md',
      reason: 'Frontend implementation needs a dedicated projection from the shared source of truth.',
      sourceIds: roleCard?.supportingSources ?? [],
      affectedCardIds: roleCard ? [roleCard.id] : [],
      reviewState: DEFAULT_REVIEW_STATE,
    },
    {
      id: 'P5',
      action: 'APPEND',
      path: 'wiki/contradictions.md',
      reason: 'Conflicting claims should be surfaced as explicit decision points.',
      sourceIds: unique(contradictions.flatMap((contradiction) => contradiction.supportingSources)),
      affectedCardIds: cards
        .filter((card) => card.relatedContradictions.length > 0)
        .map((card) => card.id),
      reviewState: DEFAULT_REVIEW_STATE,
    },
    {
      id: 'P6',
      action: 'APPEND',
      path: 'wiki/open-questions.md',
      reason: 'Clarification questions represent unresolved ambiguity that still blocks trust.',
      sourceIds: unique(questions.flatMap((question) => question.relatedSources)),
      affectedCardIds: unique(questions.flatMap((question) => question.affectedItemIds)).filter((id) =>
        cards.some((card) => card.id === id),
      ),
      reviewState: DEFAULT_REVIEW_STATE,
    },
    {
      id: 'P7',
      action: 'APPEND',
      path: 'wiki/log.md',
      reason: 'The run should be visible as a memory update event in the audit trail.',
      sourceIds: unique(cards.flatMap((card) => card.supportingSources)).slice(0, 6),
      affectedCardIds: cards.slice(0, 4).map((card) => card.id),
      reviewState: DEFAULT_REVIEW_STATE,
    },
  ];

  return patch;
}

function buildHandoffPack(
  summary: CanonicalSummary,
  cards: IdeaCard[],
  questions: ClarificationQuestion[],
  contradictions: Contradiction[],
  evidenceLedger: EvidenceLedgerEntry[],
): HandoffPack {
  return {
    summary: summary.oneLineDescription,
    confirmedDecisions: summary.decisions.slice(0, 3).map((item) => item.text),
    lockedConstraints: summary.constraints.slice(0, 3).map((item) => item.text),
    unresolvedContradictions: contradictions.map((contradiction) => contradiction.title),
    unresolvedQuestions: questions.map((question) => question.question),
    recommendedNextSteps: summary.nextSteps,
    traceabilitySummary: evidenceLedger.slice(0, 4).map(
      (entry) => `${entry.claimTitle}: ${entry.sourceIds.join(', ') || 'n/a'}`,
    ),
    roleSpecificNotes: {
      Product: cards
        .filter((card) => card.relatedRoles.includes('Product'))
        .slice(0, 3)
        .map((card) => card.distilledClaim),
      Designer: cards
        .filter((card) => card.relatedRoles.includes('Designer'))
        .slice(0, 3)
        .map((card) => card.distilledClaim),
      Frontend: cards
        .filter((card) => card.relatedRoles.includes('Frontend'))
        .slice(0, 3)
        .map((card) => card.distilledClaim),
      Backend: cards
        .filter((card) => card.relatedRoles.includes('Backend'))
        .slice(0, 3)
        .map((card) => card.distilledClaim),
      'AI/LLM': cards
        .filter((card) => card.relatedRoles.includes('AI/LLM'))
        .slice(0, 3)
        .map((card) => card.distilledClaim),
    },
  };
}

function buildUiConfig(cards: IdeaCard[]): UiConfig {
  return {
    selectedRoleTabs: ['Product', 'Designer', 'Frontend', 'Backend', 'AI/LLM'],
    primaryScreen: 'distilledMemory',
    showTraceability: true,
    showEvidenceLedger: true,
    showWikiPatchPreview: true,
    showHandoffPack: true,
    lockedItemIds: cards.filter((card) => card.reviewState === 'locked').map((card) => card.id),
  };
}

function buildProcessingStats(
  sourceFragments: SourceFragment[],
  duplicateGroups: DuplicateGroup[],
  cards: IdeaCard[],
  contradictions: Contradiction[],
  questions: ClarificationQuestion[],
): ProcessingStats {
  return {
    fragmentCount: sourceFragments.length,
    duplicateGroupCount: duplicateGroups.length,
    ideaCardCount: cards.length,
    contradictionCount: contradictions.length,
    clarificationCount: questions.length,
    duplicateDensity:
      sourceFragments.length === 0
        ? 0
        : Number((duplicateGroups.length / sourceFragments.length).toFixed(2)),
  };
}

export const PROCESSING_STEP_LABELS = [
  'Splitting source fragments',
  'Grouping duplicates',
  'Extracting durable claims',
  'Building idea cards',
  'Detecting contradictions',
  'Creating canonical summary',
  'Selecting role views',
  'Building evidence ledger',
  'Preparing wiki patch',
  'Creating handoff pack',
];

export function distillProjectMemory(rawInput: string): NoktaDistillationResponse {
  const sourceFragments = splitIntoFragments(rawInput);
  const { conceptGroups, matchedSourceIds } = groupByConceptRules(sourceFragments);
  const genericGroups = groupUnmatchedFragments(sourceFragments, matchedSourceIds);
  const duplicateGroups = buildDuplicateGroups(conceptGroups, genericGroups);
  const initialCards = buildIdeaCards(sourceFragments, conceptGroups, genericGroups);
  const contradictions = buildContradictions(sourceFragments);
  const linkedCards = linkContradictionsToCards(initialCards, contradictions);
  const clarificationQuestions = buildClarificationQuestions(sourceFragments, linkedCards, contradictions);
  const canonicalSummary = buildCanonicalSummary(rawInput, linkedCards, contradictions, clarificationQuestions);
  const roleViews = (['Product', 'Designer', 'Frontend', 'Backend', 'AI/LLM'] as RoleKey[]).map((role) =>
    buildRoleView(role, canonicalSummary, linkedCards),
  );
  const evidenceLedger = buildEvidenceLedger(linkedCards, contradictions, sourceFragments);
  const ambiguityBudget = buildAmbiguityBudget(linkedCards, contradictions, clarificationQuestions);
  const wikiPatchPreview = buildWikiPatch(linkedCards, contradictions, clarificationQuestions);
  const handoffPack = buildHandoffPack(
    canonicalSummary,
    linkedCards,
    clarificationQuestions,
    contradictions,
    evidenceLedger,
  );
  const uiConfig = buildUiConfig(linkedCards);
  const processingStats = buildProcessingStats(
    sourceFragments,
    duplicateGroups,
    linkedCards,
    contradictions,
    clarificationQuestions,
  );

  return {
    runId: `RUN-${sourceFragments.length.toString(16).toUpperCase()}${linkedCards.length
      .toString(16)
      .toUpperCase()}-${duplicateGroups.length}`,
    rawInput,
    sourceFragments,
    duplicateGroups,
    canonicalSummary,
    ideaCards: linkedCards,
    roleViews,
    contradictions,
    clarificationQuestions,
    evidenceLedger,
    ambiguityBudget,
    wikiPatchPreview,
    handoffPack,
    uiConfig,
    processingStats,
  };
}
