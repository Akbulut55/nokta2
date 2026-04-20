import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from '@expo-google-fonts/inter';
import {
  SpaceGrotesk_500Medium,
  SpaceGrotesk_700Bold,
} from '@expo-google-fonts/space-grotesk';

import { AmbiguityBudget } from './src/components/AmbiguityBudget';
import { AppShell, AppStep } from './src/components/AppShell';
import { ClarificationCard } from './src/components/ClarificationCard';
import { EvidenceLedger } from './src/components/EvidenceLedger';
import { HandoffPack } from './src/components/HandoffPack';
import { IdeaCard } from './src/components/IdeaCard';
import { PipelineStep } from './src/components/PipelineStep';
import { RoleTabs } from './src/components/RoleTabs';
import { WikiPatchPreview } from './src/components/WikiPatchPreview';
import { sampleProjectDump } from './src/data/sampleProjectDump';
import { PROCESSING_STEP_LABELS, distillProjectMemory } from './src/engine/distiller';
import {
  ClarificationQuestion,
  DuplicateGroup,
  HandoffPack as HandoffPackType,
  NoktaDistillationResponse,
  ProcessingStats,
  ProcessStepState,
  ReviewState,
  RoleKey,
  SummaryMemoryItem,
} from './src/schema/noktaTypes';
import { COLORS, FONTS, RADIUS, SHADOW, SPACING } from './src/theme';

type StepStatus = {
  label: string;
  status: ProcessStepState;
};

const INITIAL_STEPS: StepStatus[] = PROCESSING_STEP_LABELS.map((label) => ({
  label,
  status: 'pending',
}));

function sleep(duration: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
}

function metricLabel(label: string, value: string | number) {
  return `${label}: ${value}`;
}

function updateListReviewState<T extends { id: string; reviewState: ReviewState }>(
  items: T[],
  itemId: string,
  reviewState: ReviewState,
) {
  return items.map((item) => (item.id === itemId ? { ...item, reviewState } : item));
}

function computeLockedIds(result: NoktaDistillationResponse) {
  return [
    ...result.ideaCards.filter((item) => item.reviewState === 'locked').map((item) => item.id),
    ...result.contradictions.filter((item) => item.reviewState === 'locked').map((item) => item.id),
    ...result.clarificationQuestions
      .filter((item) => item.reviewState === 'locked')
      .map((item) => item.id),
    ...result.wikiPatchPreview.filter((item) => item.reviewState === 'locked').map((item) => item.id),
  ];
}

function deriveRuntimeHandoff(result: NoktaDistillationResponse): HandoffPackType {
  return {
    ...result.handoffPack,
    confirmedDecisions: result.ideaCards
      .filter((card) => (card.reviewState === 'confirmed' || card.reviewState === 'locked') && card.type === 'decision')
      .map((card) => card.distilledClaim),
    lockedConstraints: result.ideaCards
      .filter((card) => card.reviewState === 'locked' && card.type === 'constraint')
      .map((card) => card.distilledClaim),
    unresolvedContradictions: result.contradictions
      .filter((contradiction) => contradiction.reviewState !== 'discarded')
      .map((contradiction) => contradiction.title),
    unresolvedQuestions: result.clarificationQuestions
      .filter((question) => question.reviewState !== 'confirmed')
      .map((question) => question.question),
    roleSpecificNotes: {
      Product: result.roleViews.find((view) => view.role === 'Product')?.bullets ?? [],
      Designer: result.roleViews.find((view) => view.role === 'Designer')?.bullets ?? [],
      Frontend: result.roleViews.find((view) => view.role === 'Frontend')?.bullets ?? [],
      Backend: result.roleViews.find((view) => view.role === 'Backend')?.bullets ?? [],
      'AI/LLM': result.roleViews.find((view) => view.role === 'AI/LLM')?.bullets ?? [],
    },
    traceabilitySummary: result.evidenceLedger
      .slice(0, 4)
      .map((entry) => `${entry.claimTitle}: ${entry.sourceIds.join(', ') || 'n/a'}`),
  };
}

function sectionTitle(title: string, subtitle?: string) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionOverline}>{title.toUpperCase()}</Text>
      {subtitle ? <Text style={styles.sectionSubtitle}>{subtitle}</Text> : null}
    </View>
  );
}

function MetricRow({ stats }: { stats: ProcessingStats }) {
  return (
    <View style={styles.metricRow}>
      {[
        metricLabel('Fragments', stats.fragmentCount),
        metricLabel('Duplicates', stats.duplicateGroupCount),
        metricLabel('Cards', stats.ideaCardCount),
        metricLabel('Contradictions', stats.contradictionCount),
      ].map((item) => (
        <View key={item} style={styles.metricChip}>
          <Text style={styles.metricChipText}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

function StringListBlock({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <View style={styles.summaryBlock}>
      <Text style={styles.summaryBlockTitle}>{title}</Text>
      {items.length > 0 ? (
        items.map((item) => (
          <Text key={`${title}-${item}`} style={styles.summaryBlockItem}>
            - {item}
          </Text>
        ))
      ) : (
        <Text style={styles.summaryBlockItem}>- None captured.</Text>
      )}
    </View>
  );
}

function SummaryMemoryBlock({
  title,
  items,
}: {
  title: string;
  items: SummaryMemoryItem[];
}) {
  return (
    <View style={styles.summaryBlock}>
      <Text style={styles.summaryBlockTitle}>{title}</Text>
      {items.length > 0 ? (
        items.map((item) => (
          <View key={item.id} style={styles.summaryMemoryRow}>
            <Text style={styles.summaryBlockItem}>- {item.text}</Text>
            <Text style={styles.summaryMemoryMeta}>
              {item.reviewState.toUpperCase()} | {item.supportingSources.join(', ')}
            </Text>
          </View>
        ))
      ) : (
        <Text style={styles.summaryBlockItem}>- None captured.</Text>
      )}
    </View>
  );
}

function DuplicateGroupsSection({ duplicateGroups }: { duplicateGroups: DuplicateGroup[] }) {
  return (
    <View style={styles.stack}>
      {duplicateGroups.length > 0 ? (
        duplicateGroups.map((group) => (
          <View key={group.id} style={styles.duplicateCard}>
            <View style={styles.duplicateHeader}>
              <Text style={styles.duplicateTitle}>{group.label}</Text>
              <Text style={styles.duplicateSources}>{group.sourceIds.join(', ')}</Text>
            </View>
            <Text style={styles.duplicateRationale}>{group.rationale}</Text>
          </View>
        ))
      ) : (
        <View style={styles.duplicateCard}>
          <Text style={styles.duplicateTitle}>No major duplicate groups detected</Text>
          <Text style={styles.duplicateRationale}>
            The current run still produces idea cards, but the overlap signal is low.
          </Text>
        </View>
      )}
    </View>
  );
}

function SourceTraceabilitySection({
  fragments,
}: {
  fragments: NoktaDistillationResponse['sourceFragments'];
}) {
  const visibleFragments = fragments.slice(0, 8);
  const hiddenCount = fragments.length - visibleFragments.length;

  return (
    <View style={styles.stack}>
      {visibleFragments.map((fragment) => (
        <View key={fragment.id} style={styles.fragmentCard}>
          <View style={styles.fragmentHeader}>
            <Text style={styles.fragmentId}>{fragment.id}</Text>
            <Text style={styles.fragmentLine}>LINE {fragment.line}</Text>
          </View>
          <Text style={styles.fragmentText}>{fragment.text}</Text>
          {fragment.tags.length > 0 ? (
            <Text style={styles.fragmentTags}>Tags: {fragment.tags.join(', ')}</Text>
          ) : null}
        </View>
      ))}

      {hiddenCount > 0 ? (
        <View style={styles.fragmentMoreCard}>
          <Text style={styles.fragmentMoreText}>
            {hiddenCount} additional source fragments remain available in this run.
          </Text>
        </View>
      ) : null}
    </View>
  );
}

function ContradictionSection({
  result,
  onChangeReviewState,
}: {
  result: NoktaDistillationResponse;
  onChangeReviewState: (contradictionId: string, reviewState: ReviewState) => void;
}) {
  return (
    <View style={styles.stack}>
      {result.contradictions.map((contradiction) => (
        <View key={contradiction.id} style={styles.contradictionCard}>
          <View style={styles.contradictionHeader}>
            <View style={styles.contradictionHeaderCopy}>
              <Text style={styles.contradictionOverline}>CONTRADICTION</Text>
              <Text style={styles.contradictionTitle}>{contradiction.title}</Text>
            </View>
            <View style={styles.contradictionBadge}>
              <Text style={styles.contradictionBadgeText}>{contradiction.status.toUpperCase()}</Text>
            </View>
          </View>
          <Text style={styles.contradictionClaim}>A: {contradiction.claimA}</Text>
          <Text style={styles.contradictionClaim}>B: {contradiction.claimB}</Text>
          <Text style={styles.contradictionResolution}>{contradiction.suggestedResolution}</Text>
          <Text style={styles.contradictionMeta}>
            Blocked area: {contradiction.blockedArea} | Sources: {contradiction.supportingSources.join(', ')}
          </Text>
          <View style={styles.contradictionActions}>
            {(['confirmed', 'needs_review', 'discarded', 'locked'] as ReviewState[]).map((state) => (
              <Pressable
                key={state}
                onPress={() => onChangeReviewState(contradiction.id, state)}
                style={[
                  styles.contradictionAction,
                  contradiction.reviewState === state && styles.contradictionActionActive,
                ]}
              >
                <Text
                  style={[
                    styles.contradictionActionText,
                    contradiction.reviewState === state && styles.contradictionActionTextActive,
                  ]}
                >
                  {state.toUpperCase()}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      ))}
    </View>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    SpaceGrotesk_500Medium,
    SpaceGrotesk_700Bold,
  });

  const [screen, setScreen] = useState<AppStep>('input');
  const [notes, setNotes] = useState('');
  const [processingSteps, setProcessingSteps] = useState<StepStatus[]>(INITIAL_STEPS);
  const [processingStats, setProcessingStats] = useState<ProcessingStats | null>(null);
  const [distillation, setDistillation] = useState<NoktaDistillationResponse | null>(null);
  const [selectedRole, setSelectedRole] = useState<RoleKey>('Product');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!fontsLoaded) {
    return <View style={styles.bootScreen} />;
  }

  const runtimeHandoff = distillation ? deriveRuntimeHandoff(distillation) : null;
  const activeRoleView = distillation?.roleViews.find((view) => view.role === selectedRole);

  const canNavigate = {
    input: true,
    processing: isProcessing || Boolean(distillation),
    memory: Boolean(distillation),
    clarify: Boolean(distillation),
  } satisfies Partial<Record<AppStep, boolean>>;

  const handleProcess = async () => {
    if (!notes.trim() || isProcessing) {
      return;
    }

    setIsProcessing(true);
    setDistillation(null);

    const generated = distillProjectMemory(notes);
    setProcessingStats(generated.processingStats);
    setProcessingSteps(
      PROCESSING_STEP_LABELS.map((label, index) => ({
        label,
        status: index === 0 ? 'active' : 'pending',
      })),
    );
    setSelectedRole('Product');
    setScreen('processing');

    for (let index = 0; index < PROCESSING_STEP_LABELS.length; index += 1) {
      setProcessingSteps((current) =>
        current.map((step, stepIndex) => ({
          ...step,
          status:
            stepIndex < index ? 'complete' : stepIndex === index ? 'active' : 'pending',
        })),
      );

      await sleep(index === 0 ? 360 : 180);
    }

    setProcessingSteps((current) => current.map((step) => ({ ...step, status: 'complete' })));
    setDistillation(generated);
    setScreen('memory');
    setIsProcessing(false);
  };

  const navigateTo = (nextStep: AppStep) => {
    if (nextStep === 'input') {
      setScreen('input');
      return;
    }

    if (nextStep === 'processing' && (isProcessing || distillation)) {
      setScreen('processing');
      return;
    }

    if ((nextStep === 'memory' || nextStep === 'clarify') && distillation) {
      setScreen(nextStep);
    }
  };

  const updateResult = (
    updater: (current: NoktaDistillationResponse) => NoktaDistillationResponse,
  ) => {
    setDistillation((current) => {
      if (!current) {
        return current;
      }

      const updated = updater(current);
      return {
        ...updated,
        uiConfig: {
          ...updated.uiConfig,
          lockedItemIds: computeLockedIds(updated),
        },
      };
    });
  };

  const handleIdeaReviewChange = (cardId: string, reviewState: ReviewState) => {
    updateResult((current) => ({
      ...current,
      ideaCards: updateListReviewState(current.ideaCards, cardId, reviewState),
    }));
  };

  const handleContradictionReviewChange = (
    contradictionId: string,
    reviewState: ReviewState,
  ) => {
    updateResult((current) => ({
      ...current,
      contradictions: updateListReviewState(current.contradictions, contradictionId, reviewState),
    }));
  };

  const handleQuestionReviewChange = (questionId: string, reviewState: ReviewState) => {
    updateResult((current) => ({
      ...current,
      clarificationQuestions: updateListReviewState(
        current.clarificationQuestions,
        questionId,
        reviewState,
      ),
    }));
  };

  const handleQuestionAnswer = (questionId: string, answer: string) => {
    updateResult((current) => ({
      ...current,
      clarificationQuestions: current.clarificationQuestions.map((question) =>
        question.id === questionId
          ? { ...question, answer, reviewState: 'confirmed' }
          : question,
      ),
    }));
  };

  const handleQuestionSkip = (questionId: string) => {
    updateResult((current) => ({
      ...current,
      clarificationQuestions: current.clarificationQuestions.map((question) =>
        question.id === questionId
          ? {
              ...question,
              reviewState:
                question.reviewState === 'confirmed' || question.reviewState === 'locked'
                  ? question.reviewState
                  : 'pending',
            }
          : question,
      ),
    }));
  };

  const handlePatchReviewChange = (patchId: string, reviewState: ReviewState) => {
    updateResult((current) => ({
      ...current,
      wikiPatchPreview: updateListReviewState(current.wikiPatchPreview, patchId, reviewState),
    }));
  };

  const renderInputScreen = () => (
    <ScrollView contentContainerStyle={styles.screenContent} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={['rgba(133,236,255,0.14)', 'rgba(29,32,36,0.92)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.heroCard}
      >
        <Text style={styles.heroOverline}>PROJECT-MEMORY DISTILLATION COCKPIT</Text>
        <Text style={styles.heroTitle}>Turn messy fragments into reviewable project memory.</Text>
        <Text style={styles.heroText}>
          Structured ingest, deterministic pipeline, role projection, evidence, contradictions,
          human review, and a wiki patch preview that becomes the demo centerpiece.
        </Text>

        <View style={styles.metadataBar}>
          {['Mode: Distill', 'Output: Memory Bundle', 'Review: Human Confirmed'].map((chip) => (
            <View key={chip} style={styles.metadataChip}>
              <Text style={styles.metadataChipText}>{chip}</Text>
            </View>
          ))}
        </View>

        <View style={styles.pipelineHero}>
          {['Fragments', 'Idea Cards', 'Canonical Memory', 'Wiki Patch'].map((stage, index) => (
            <View key={stage} style={styles.pipelineHeroStage}>
              <Text style={styles.pipelineHeroIndex}>{`0${index + 1}`}</Text>
              <Text style={styles.pipelineHeroLabel}>{stage}</Text>
            </View>
          ))}
        </View>
      </LinearGradient>

      <View style={styles.card}>
        {sectionTitle(
          'Input buffer',
          'Paste or load rough project material for distillation.',
        )}

        <TextInput
          multiline
          numberOfLines={14}
          placeholder="Paste rough chats, notes, requirements, contradictions, and repeated ideas..."
          placeholderTextColor={COLORS.outline}
          value={notes}
          onChangeText={setNotes}
          style={styles.input}
          textAlignVertical="top"
        />

        <MetricRow
          stats={{
            fragmentCount: notes.trim() ? notes.split(/\r?\n/).filter(Boolean).length : 0,
            duplicateGroupCount: notes.toLowerCase().includes('wiki patch') ? 1 : 0,
            ideaCardCount: notes.trim() ? Math.max(1, Math.ceil(notes.length / 90)) : 0,
            contradictionCount: notes.toLowerCase().includes('no backend') ? 1 : 0,
            clarificationCount: notes.toLowerCase().includes('maybe') ? 1 : 0,
            duplicateDensity: 0,
          }}
        />

        <View style={styles.buttonRow}>
          <Pressable onPress={() => setNotes(sampleProjectDump)} style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>LOAD SAMPLE</Text>
          </Pressable>

          <Pressable onPress={() => setNotes('')} style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>CLEAR</Text>
          </Pressable>
        </View>

        <Pressable
          disabled={!notes.trim() || isProcessing}
          onPress={handleProcess}
          style={({ pressed }) => [
            styles.primaryButtonShell,
            (!notes.trim() || isProcessing) && styles.primaryButtonDisabled,
            pressed && styles.primaryButtonPressed,
          ]}
        >
          <LinearGradient
            colors={[COLORS.primary, COLORS.primaryDim]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.primaryButton}
          >
            <Text style={styles.primaryButtonText}>PROCESS WITH NOKTA</Text>
          </LinearGradient>
        </Pressable>
      </View>
    </ScrollView>
  );

  const renderProcessingScreen = () => {
    const activeIndex = processingSteps.findIndex((step) => step.status === 'active');
    const completeCount = processingSteps.filter((step) => step.status === 'complete').length;
    const progressRatio =
      processingSteps.length === 0
        ? 0
        : (completeCount + (activeIndex >= 0 ? 0.5 : 0)) / processingSteps.length;
    const progressPercent = Math.round(progressRatio * 100);
    const activeLabel =
      activeIndex >= 0 ? processingSteps[activeIndex].label : 'Run complete and bundle assembled.';

    return (
      <ScrollView contentContainerStyle={styles.screenContent} showsVerticalScrollIndicator={false}>
        {processingStats ? (
          <LinearGradient
            colors={['rgba(133,236,255,0.14)', 'rgba(29,32,36,0.92)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.processingHero}
          >
            {sectionTitle('System status', 'Engineered local run. No live AI request involved.')}
            <View style={styles.processingHeadlineRow}>
              <Text style={styles.processingHeadline}>{progressPercent}% complete</Text>
              <Text style={styles.processingHeadlineMeta}>
                {activeIndex >= 0 ? `STEP ${activeIndex + 1}` : 'COMPLETE'}
              </Text>
            </View>
            <View style={styles.processingTrack}>
              <View style={[styles.processingTrackFill, { width: `${progressPercent}%` }]} />
            </View>
            <Text style={styles.processingFocus}>{activeLabel}</Text>
            <MetricRow stats={processingStats} />
            <Text style={styles.processingMeta}>
              Duplicate density {processingStats.duplicateDensity} | Structured output bundle scheduled
              for canonical summary, role views, evidence, patch, and handoff.
            </Text>
          </LinearGradient>
        ) : null}

        <View style={styles.stack}>
          {processingSteps.map((step, index) => (
            <PipelineStep key={step.label} index={index} label={step.label} status={step.status} />
          ))}
        </View>
      </ScrollView>
    );
  };

  const renderMemoryScreen = () => {
    if (!distillation || !runtimeHandoff) {
      return null;
    }

    return (
      <ScrollView contentContainerStyle={styles.screenContent} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          {sectionTitle(
            'Canonical Project Summary',
            'One maintained project state drives every downstream projection.',
          )}
          <Text style={styles.summaryTitle}>{distillation.canonicalSummary.title}</Text>
          <Text style={styles.summaryText}>{distillation.canonicalSummary.oneLineDescription}</Text>
          <Text style={styles.summaryProblem}>{distillation.canonicalSummary.problem}</Text>
          <Text style={styles.summaryCoreConcept}>{distillation.canonicalSummary.coreConcept}</Text>
          <MetricRow stats={distillation.processingStats} />
          <View style={styles.summaryGrid}>
            <StringListBlock
              title="Target Users"
              items={distillation.canonicalSummary.targetUsers}
            />
            <StringListBlock
              title="MVP Scope"
              items={distillation.canonicalSummary.mvpScope}
            />
            <StringListBlock
              title="Main Workflow"
              items={distillation.canonicalSummary.mainWorkflow}
            />
            <StringListBlock
              title="Non-goals"
              items={distillation.canonicalSummary.nonGoals}
            />
            <SummaryMemoryBlock
              title="Requirements"
              items={distillation.canonicalSummary.requirements}
            />
            <SummaryMemoryBlock
              title="Constraints"
              items={distillation.canonicalSummary.constraints}
            />
            <SummaryMemoryBlock
              title="Decisions"
              items={distillation.canonicalSummary.decisions}
            />
            <SummaryMemoryBlock
              title="Assumptions"
              items={distillation.canonicalSummary.assumptions}
            />
            <StringListBlock
              title="Open Questions"
              items={distillation.canonicalSummary.openQuestions}
            />
            <StringListBlock
              title="Next Steps"
              items={distillation.canonicalSummary.nextSteps}
            />
          </View>
        </View>

        <View style={styles.card}>
          {sectionTitle('Role Tabs', activeRoleView?.lens)}
          <RoleTabs
            roles={distillation.uiConfig.selectedRoleTabs}
            selectedRole={selectedRole}
            onSelectRole={setSelectedRole}
          />
          {activeRoleView ? (
            <View style={styles.roleViewCard}>
              <Text style={styles.roleViewSummary}>{activeRoleView.summary}</Text>
              {activeRoleView.bullets.map((bullet) => (
                <Text key={bullet} style={styles.roleViewBullet}>
                  - {bullet}
                </Text>
              ))}
              <Text style={styles.roleViewSources}>
                Sources: {activeRoleView.sourceIds.join(', ') || 'n/a'}
              </Text>
            </View>
          ) : null}
        </View>

        <View style={styles.stack}>
          {sectionTitle('Deduplication', 'Repeated fragments grouped into durable concepts before projection.')}
          <DuplicateGroupsSection duplicateGroups={distillation.duplicateGroups} />
        </View>

        <WikiPatchPreview
          patchItems={distillation.wikiPatchPreview}
          onChangeReviewState={handlePatchReviewChange}
        />

        <View style={styles.stack}>
          {sectionTitle('Idea Cards', 'Deduplicated working memory units with review controls.')}
          {distillation.ideaCards.map((card) => (
            <IdeaCard
              key={card.id}
              card={card}
              onChangeReviewState={handleIdeaReviewChange}
            />
          ))}
        </View>

        <View style={styles.stack}>
          {sectionTitle('Contradiction Queue', 'Conflicts stay visible until someone resolves them.')}
          <ContradictionSection
            result={distillation}
            onChangeReviewState={handleContradictionReviewChange}
          />
        </View>

        <View style={styles.stack}>
          {sectionTitle('Evidence Ledger', 'Auditable trace from claims back to source fragments.')}
          <EvidenceLedger entries={distillation.evidenceLedger} />
        </View>

        <View style={styles.stack}>
          {sectionTitle('Ambiguity Budget', 'What still needs a decision before full trust.')}
          <AmbiguityBudget budget={distillation.ambiguityBudget} />
        </View>

        <View style={styles.stack}>
          {sectionTitle('Handoff Pack', 'Compact context for the next tool, model, or collaborator.')}
          <HandoffPack handoffPack={runtimeHandoff} />
        </View>

        <View style={styles.stack}>
          {sectionTitle('Source Traceability', 'Raw source fragments remain visible as evidence.')}
          <SourceTraceabilitySection fragments={distillation.sourceFragments} />
        </View>

        <Pressable onPress={() => setScreen('clarify')} style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>OPEN CLARIFY QUEUE</Text>
        </Pressable>
      </ScrollView>
    );
  };

  const renderClarifyScreen = () => {
    if (!distillation) {
      return null;
    }

    const remaining = distillation.clarificationQuestions.filter(
      (question) => question.reviewState !== 'confirmed',
    ).length;

    return (
      <ScrollView contentContainerStyle={styles.screenContent} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          {sectionTitle(
            'Clarification Queue',
            'Answers update affected memory items while preserving locked decisions.',
          )}
          <MetricRow
            stats={{
              fragmentCount: remaining,
              duplicateGroupCount: distillation.clarificationQuestions.length,
              ideaCardCount: distillation.ideaCards.filter((card) => card.reviewState === 'needs_review').length,
              contradictionCount: distillation.contradictions.length,
              clarificationCount: distillation.clarificationQuestions.length,
              duplicateDensity: 0,
            }}
          />
          <Text style={styles.processingMeta}>
            {remaining} / {distillation.clarificationQuestions.length} questions still need explicit confirmation.
          </Text>
        </View>

        <View style={styles.stack}>
          {distillation.clarificationQuestions.map((question: ClarificationQuestion) => (
            <ClarificationCard
              key={question.id}
              question={question}
              onAnswer={handleQuestionAnswer}
              onSkip={handleQuestionSkip}
              onChangeReviewState={handleQuestionReviewChange}
            />
          ))}
        </View>
      </ScrollView>
    );
  };

  const shellSubtitle =
    screen === 'input'
      ? 'Compile messy project fragments into trusted project memory.'
      : screen === 'processing'
        ? 'Local deterministic engine run with visible pipeline stages.'
        : screen === 'memory'
          ? 'Review the memory bundle, evidence, contradictions, and wiki patch.'
          : 'Resolve ambiguity with targeted questions and explicit review states.';

  const shellTitle =
    screen === 'input'
      ? 'Nokta Distillery'
      : screen === 'processing'
        ? 'Processing'
        : screen === 'memory'
          ? 'Distilled Memory'
          : 'Clarify';

  return (
    <>
      <StatusBar style="light" />
      <AppShell
        activeStep={screen}
        screenTitle={shellTitle}
        subtitle={shellSubtitle}
        runId={distillation?.runId}
        canNavigate={canNavigate}
        onNavigate={navigateTo}
      >
        {screen === 'input'
          ? renderInputScreen()
          : screen === 'processing'
            ? renderProcessingScreen()
            : screen === 'memory'
              ? renderMemoryScreen()
              : renderClarifyScreen()}
      </AppShell>
    </>
  );
}

const styles = StyleSheet.create({
  bootScreen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  screenContent: {
    paddingBottom: SPACING.xxl,
    gap: SPACING.lg,
  },
  sectionHeader: {
    gap: SPACING.xs,
  },
  sectionOverline: {
    fontFamily: FONTS.bodyMedium,
    color: COLORS.secondary,
    fontSize: 11,
    letterSpacing: 1.4,
  },
  sectionSubtitle: {
    fontFamily: FONTS.body,
    color: COLORS.textMuted,
    fontSize: 13,
    lineHeight: 18,
  },
  card: {
    gap: SPACING.md,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.surfaceHigh,
    borderWidth: 1,
    borderColor: COLORS.ghostBorder,
    padding: SPACING.lg,
    ...SHADOW,
  },
  stack: {
    gap: SPACING.md,
  },
  heroCard: {
    gap: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.tertiaryDim,
    padding: SPACING.lg,
    ...SHADOW,
  },
  heroOverline: {
    fontFamily: FONTS.bodyMedium,
    color: COLORS.tertiary,
    fontSize: 11,
    letterSpacing: 1.4,
  },
  heroTitle: {
    fontFamily: FONTS.displayBold,
    color: COLORS.text,
    fontSize: 26,
    lineHeight: 32,
  },
  heroText: {
    fontFamily: FONTS.body,
    color: COLORS.textMuted,
    fontSize: 13,
    lineHeight: 19,
  },
  input: {
    minHeight: 280,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.ghostBorder,
    backgroundColor: COLORS.surfaceLow,
    color: COLORS.text,
    padding: SPACING.lg,
    fontFamily: FONTS.mono,
    fontSize: 13,
    lineHeight: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  secondaryButton: {
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.ghostBorder,
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    fontFamily: FONTS.bodyMedium,
    color: COLORS.text,
    fontSize: 12,
    letterSpacing: 1,
  },
  primaryButtonShell: {
    borderRadius: RADIUS.md,
    overflow: 'hidden',
  },
  primaryButtonDisabled: {
    opacity: 0.45,
  },
  primaryButtonPressed: {
    transform: [{ translateY: 1 }],
  },
  primaryButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
  },
  primaryButtonText: {
    fontFamily: FONTS.bodySemiBold,
    color: '#263136',
    fontSize: 12,
    letterSpacing: 1.1,
  },
  metadataBar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  metadataChip: {
    borderRadius: 999,
    backgroundColor: COLORS.secondaryContainer,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  metadataChipText: {
    fontFamily: FONTS.bodyMedium,
    color: COLORS.tertiary,
    fontSize: 11,
    letterSpacing: 0.9,
  },
  pipelineHintCard: {
    gap: SPACING.md,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.ghostBorder,
    padding: SPACING.lg,
  },
  pipelineHintText: {
    fontFamily: FONTS.mono,
    color: COLORS.primary,
    fontSize: 12,
    lineHeight: 20,
  },
  pipelineHero: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  pipelineHeroStage: {
    minWidth: '47%',
    borderRadius: RADIUS.md,
    backgroundColor: 'rgba(13,14,16,0.28)',
    borderWidth: 1,
    borderColor: COLORS.ghostBorder,
    padding: SPACING.md,
    gap: 4,
  },
  pipelineHeroIndex: {
    fontFamily: FONTS.mono,
    color: COLORS.tertiary,
    fontSize: 11,
  },
  pipelineHeroLabel: {
    fontFamily: FONTS.bodySemiBold,
    color: COLORS.text,
    fontSize: 13,
  },
  metricRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  metricChip: {
    borderRadius: 999,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.ghostBorder,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 6,
  },
  metricChipText: {
    fontFamily: FONTS.bodyMedium,
    color: COLORS.textMuted,
    fontSize: 11,
    letterSpacing: 0.7,
  },
  processingMeta: {
    fontFamily: FONTS.body,
    color: COLORS.textMuted,
    fontSize: 13,
    lineHeight: 19,
  },
  processingHero: {
    gap: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.tertiaryDim,
    padding: SPACING.lg,
    ...SHADOW,
  },
  processingHeadlineRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.sm,
    alignItems: 'center',
  },
  processingHeadline: {
    fontFamily: FONTS.displayBold,
    color: COLORS.text,
    fontSize: 24,
  },
  processingHeadlineMeta: {
    fontFamily: FONTS.mono,
    color: COLORS.tertiary,
    fontSize: 12,
  },
  processingTrack: {
    height: 8,
    borderRadius: 999,
    backgroundColor: COLORS.surfaceHighest,
    overflow: 'hidden',
  },
  processingTrackFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: COLORS.tertiaryDim,
  },
  processingFocus: {
    fontFamily: FONTS.bodySemiBold,
    color: COLORS.primary,
    fontSize: 13,
    lineHeight: 18,
  },
  summaryTitle: {
    fontFamily: FONTS.displayBold,
    color: COLORS.text,
    fontSize: 24,
  },
  summaryText: {
    fontFamily: FONTS.body,
    color: COLORS.text,
    fontSize: 14,
    lineHeight: 20,
  },
  summaryProblem: {
    fontFamily: FONTS.body,
    color: COLORS.textMuted,
    fontSize: 13,
    lineHeight: 19,
  },
  summaryCoreConcept: {
    fontFamily: FONTS.bodySemiBold,
    color: COLORS.primary,
    fontSize: 13,
    lineHeight: 19,
  },
  summaryListLabel: {
    fontFamily: FONTS.bodyMedium,
    color: COLORS.secondary,
    fontSize: 11,
    letterSpacing: 1.3,
  },
  summaryListItem: {
    fontFamily: FONTS.body,
    color: COLORS.textMuted,
    fontSize: 12,
    lineHeight: 18,
  },
  roleViewCard: {
    marginTop: SPACING.md,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.ghostBorder,
    padding: SPACING.md,
    gap: SPACING.xs,
  },
  roleViewSummary: {
    fontFamily: FONTS.bodySemiBold,
    color: COLORS.text,
    fontSize: 14,
  },
  roleViewBullet: {
    fontFamily: FONTS.body,
    color: COLORS.textMuted,
    fontSize: 12,
    lineHeight: 18,
  },
  roleViewSources: {
    marginTop: SPACING.xs,
    fontFamily: FONTS.mono,
    color: COLORS.primary,
    fontSize: 11,
  },
  summaryGrid: {
    gap: SPACING.sm,
  },
  summaryBlock: {
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.ghostBorder,
    padding: SPACING.md,
    gap: SPACING.xs,
  },
  summaryBlockTitle: {
    fontFamily: FONTS.bodyMedium,
    color: COLORS.secondary,
    fontSize: 11,
    letterSpacing: 1.2,
  },
  summaryBlockItem: {
    fontFamily: FONTS.body,
    color: COLORS.textMuted,
    fontSize: 12,
    lineHeight: 18,
  },
  summaryMemoryRow: {
    gap: 4,
  },
  summaryMemoryMeta: {
    fontFamily: FONTS.mono,
    color: COLORS.primary,
    fontSize: 10,
  },
  duplicateCard: {
    gap: SPACING.xs,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.ghostBorder,
    padding: SPACING.md,
  },
  duplicateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.sm,
  },
  duplicateTitle: {
    flex: 1,
    fontFamily: FONTS.bodySemiBold,
    color: COLORS.text,
    fontSize: 14,
  },
  duplicateSources: {
    fontFamily: FONTS.mono,
    color: COLORS.tertiary,
    fontSize: 11,
  },
  duplicateRationale: {
    fontFamily: FONTS.body,
    color: COLORS.textMuted,
    fontSize: 12,
    lineHeight: 18,
  },
  contradictionCard: {
    gap: SPACING.sm,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.dangerContainer,
    borderWidth: 1,
    borderColor: COLORS.dangerDim,
    padding: SPACING.md,
  },
  contradictionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.sm,
  },
  contradictionHeaderCopy: {
    flex: 1,
    gap: 4,
  },
  contradictionOverline: {
    fontFamily: FONTS.bodyMedium,
    color: '#ffb6b0',
    fontSize: 10,
    letterSpacing: 1.2,
  },
  contradictionTitle: {
    fontFamily: FONTS.displayMedium,
    color: COLORS.text,
    fontSize: 18,
  },
  contradictionBadge: {
    borderRadius: 999,
    backgroundColor: 'rgba(13, 14, 16, 0.36)',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 5,
  },
  contradictionBadgeText: {
    fontFamily: FONTS.bodyMedium,
    color: COLORS.danger,
    fontSize: 10,
    letterSpacing: 1.1,
  },
  contradictionClaim: {
    fontFamily: FONTS.body,
    color: COLORS.text,
    fontSize: 13,
    lineHeight: 19,
  },
  contradictionResolution: {
    fontFamily: FONTS.body,
    color: COLORS.textMuted,
    fontSize: 12,
    lineHeight: 18,
  },
  contradictionMeta: {
    fontFamily: FONTS.mono,
    color: COLORS.primary,
    fontSize: 11,
    lineHeight: 16,
  },
  contradictionActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    marginTop: SPACING.xs,
  },
  contradictionAction: {
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
    backgroundColor: 'rgba(13, 14, 16, 0.24)',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
  },
  contradictionActionActive: {
    borderColor: COLORS.tertiaryDim,
  },
  contradictionActionText: {
    fontFamily: FONTS.bodyMedium,
    color: COLORS.textMuted,
    fontSize: 11,
    letterSpacing: 0.8,
  },
  contradictionActionTextActive: {
    color: COLORS.tertiary,
  },
  fragmentCard: {
    gap: SPACING.xs,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.ghostBorder,
    padding: SPACING.md,
  },
  fragmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  fragmentId: {
    fontFamily: FONTS.mono,
    color: COLORS.tertiary,
    fontSize: 12,
  },
  fragmentLine: {
    fontFamily: FONTS.bodyMedium,
    color: COLORS.secondary,
    fontSize: 10,
    letterSpacing: 1.1,
  },
  fragmentText: {
    fontFamily: FONTS.body,
    color: COLORS.text,
    fontSize: 13,
    lineHeight: 19,
  },
  fragmentTags: {
    fontFamily: FONTS.body,
    color: COLORS.textMuted,
    fontSize: 11,
  },
  fragmentMoreCard: {
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surfaceLow,
    borderWidth: 1,
    borderColor: COLORS.ghostBorder,
    padding: SPACING.md,
  },
  fragmentMoreText: {
    fontFamily: FONTS.body,
    color: COLORS.textMuted,
    fontSize: 12,
  },
});
