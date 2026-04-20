export type ReviewState =
  | 'pending'
  | 'confirmed'
  | 'needs_review'
  | 'discarded'
  | 'locked';

export type Confidence = 'high' | 'medium' | 'low' | 'unknown';

export type MemoryItemType =
  | 'requirement'
  | 'constraint'
  | 'assumption'
  | 'decision'
  | 'contradiction'
  | 'open_question'
  | 'future_feature'
  | 'implementation_hint'
  | 'role_need'
  | 'risk';

export type RoleKey = 'Product' | 'Designer' | 'Frontend' | 'Backend' | 'AI/LLM';

export type ProcessStepState = 'pending' | 'active' | 'complete';

export type SourceFragment = {
  id: string;
  text: string;
  normalized: string;
  line: number;
  tags: string[];
};

export type DuplicateGroup = {
  id: string;
  label: string;
  sourceIds: string[];
  rationale: string;
};

export type SummaryMemoryItem = {
  id: string;
  text: string;
  supportingSources: string[];
  reviewState: ReviewState;
};

export type IdeaCard = {
  id: string;
  title: string;
  type: MemoryItemType;
  distilledClaim: string;
  supportingSources: string[];
  confidence: Confidence;
  reviewState: ReviewState;
  relatedRoles: RoleKey[];
  relatedContradictions: string[];
  wikiPatchImpact: string[];
};

export type CanonicalSummary = {
  title: string;
  oneLineDescription: string;
  problem: string;
  targetUsers: string[];
  coreConcept: string;
  mvpScope: string[];
  nonGoals: string[];
  mainWorkflow: string[];
  requirements: SummaryMemoryItem[];
  constraints: SummaryMemoryItem[];
  assumptions: SummaryMemoryItem[];
  decisions: SummaryMemoryItem[];
  contradictions: string[];
  openQuestions: string[];
  nextSteps: string[];
};

export type RoleView = {
  id: string;
  role: RoleKey;
  lens: string;
  summary: string;
  bullets: string[];
  relatedCardIds: string[];
  sourceIds: string[];
};

export type Contradiction = {
  id: string;
  title: string;
  claimA: string;
  claimB: string;
  suggestedResolution: string;
  blockedArea: string;
  status: 'unresolved' | 'mitigated' | 'resolved';
  supportingSources: string[];
  reviewState: ReviewState;
};

export type ClarificationQuestion = {
  id: string;
  question: string;
  reason: string;
  blockedArea: string;
  priority: 'High' | 'Medium' | 'Low';
  relatedSources: string[];
  affectedItemIds: string[];
  reviewState: ReviewState;
  answer?: string;
};

export type EvidenceLedgerEntry = {
  id: string;
  claimId: string;
  claimTitle: string;
  evidenceType: 'direct' | 'inferred' | 'merged' | 'ignored';
  sourceIds: string[];
  note: string;
  confidence: Confidence;
};

export type AmbiguityBudget = {
  high: string[];
  medium: string[];
  low: string[];
};

export type WikiPatch = {
  id: string;
  action: 'CREATE' | 'APPEND' | 'UPDATE';
  path: string;
  reason: string;
  sourceIds: string[];
  affectedCardIds: string[];
  reviewState: ReviewState;
};

export type HandoffPack = {
  summary: string;
  confirmedDecisions: string[];
  lockedConstraints: string[];
  unresolvedContradictions: string[];
  unresolvedQuestions: string[];
  recommendedNextSteps: string[];
  traceabilitySummary: string[];
  roleSpecificNotes: Record<RoleKey, string[]>;
};

export type UiConfig = {
  selectedRoleTabs: RoleKey[];
  primaryScreen: 'distilledMemory' | 'clarify';
  showTraceability: boolean;
  showEvidenceLedger: boolean;
  showWikiPatchPreview: boolean;
  showHandoffPack: boolean;
  lockedItemIds: string[];
};

export type ProcessingStats = {
  fragmentCount: number;
  duplicateGroupCount: number;
  ideaCardCount: number;
  contradictionCount: number;
  clarificationCount: number;
  duplicateDensity: number;
};

export type NoktaDistillationResponse = {
  runId: string;
  rawInput: string;
  sourceFragments: SourceFragment[];
  duplicateGroups: DuplicateGroup[];
  canonicalSummary: CanonicalSummary;
  ideaCards: IdeaCard[];
  roleViews: RoleView[];
  contradictions: Contradiction[];
  clarificationQuestions: ClarificationQuestion[];
  evidenceLedger: EvidenceLedgerEntry[];
  ambiguityBudget: AmbiguityBudget;
  wikiPatchPreview: WikiPatch[];
  handoffPack: HandoffPack;
  uiConfig: UiConfig;
  processingStats: ProcessingStats;
};
