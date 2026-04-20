import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { ClarificationQuestion, ReviewState } from '../schema/noktaTypes';
import { COLORS, FONTS, RADIUS, SPACING } from '../theme';

type ClarificationCardProps = {
  question: ClarificationQuestion;
  onAnswer: (questionId: string, answer: string) => void;
  onSkip: (questionId: string) => void;
  onChangeReviewState: (questionId: string, reviewState: ReviewState) => void;
};

function priorityColor(priority: ClarificationQuestion['priority']) {
  switch (priority) {
    case 'High':
      return COLORS.danger;
    case 'Medium':
      return COLORS.warning;
    default:
      return COLORS.secondary;
  }
}

function reviewStateColor(state: ReviewState) {
  switch (state) {
    case 'confirmed':
      return COLORS.success;
    case 'needs_review':
      return COLORS.warning;
    case 'discarded':
      return COLORS.danger;
    case 'locked':
      return COLORS.tertiary;
    default:
      return COLORS.secondary;
  }
}

export function ClarificationCard({
  question,
  onAnswer,
  onSkip,
  onChangeReviewState,
}: ClarificationCardProps) {
  const [draft, setDraft] = useState(question.answer ?? '');
  const [isAnswerMode, setIsAnswerMode] = useState(Boolean(question.answer));

  useEffect(() => {
    setDraft(question.answer ?? '');
    setIsAnswerMode(Boolean(question.answer));
  }, [question.answer]);

  const handleAnswer = () => {
    if (!isAnswerMode) {
      setIsAnswerMode(true);
      return;
    }

    const nextAnswer = draft.trim() || 'Confirmed during review. Keep current mitigation path.';
    onAnswer(question.id, nextAnswer);
  };

  const handleSkip = () => {
    setDraft(question.answer ?? '');
    setIsAnswerMode(Boolean(question.answer));
    onSkip(question.id);
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.question}>{question.question}</Text>
        <View style={styles.headerChips}>
          <View style={[styles.priorityChip, { borderColor: priorityColor(question.priority) }]}>
            <Text style={[styles.priorityText, { color: priorityColor(question.priority) }]}>
              {question.priority.toUpperCase()}
            </Text>
          </View>
          <View style={[styles.priorityChip, { borderColor: reviewStateColor(question.reviewState) }]}>
            <Text style={[styles.priorityText, { color: reviewStateColor(question.reviewState) }]}>
              {question.reviewState.toUpperCase()}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.block}>
        <Text style={styles.blockLabel}>Reason</Text>
        <Text style={styles.blockValue}>{question.reason}</Text>
      </View>

      <View style={styles.block}>
        <Text style={styles.blockLabel}>Blocked area</Text>
        <Text style={styles.blockValue}>{question.blockedArea}</Text>
      </View>

      <View style={styles.block}>
        <Text style={styles.blockLabel}>Related sources</Text>
        <Text style={styles.sources}>{question.relatedSources.join(', ')}</Text>
      </View>

      {isAnswerMode ? (
        <TextInput
          multiline
          numberOfLines={3}
          placeholder="Capture the clarification answer..."
          placeholderTextColor={COLORS.outline}
          style={styles.answerInput}
          value={draft}
          onChangeText={setDraft}
        />
      ) : null}

      {question.answer ? (
        <View style={styles.answerPreview}>
          <Text style={styles.blockLabel}>Captured answer</Text>
          <Text style={styles.blockValue}>{question.answer}</Text>
        </View>
      ) : null}

      <View style={styles.actions}>
        <Pressable onPress={handleAnswer} style={styles.actionPrimary}>
          <Text style={styles.actionPrimaryText}>ANSWER</Text>
        </Pressable>
        <Pressable onPress={handleSkip} style={styles.actionGhost}>
          <Text style={styles.actionGhostText}>SKIP</Text>
        </Pressable>
        <Pressable
          onPress={() => onChangeReviewState(question.id, 'needs_review')}
          style={styles.actionGhost}
        >
          <Text style={styles.actionGhostText}>MARK NEEDS REVIEW</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: SPACING.md,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.surfaceHigh,
    borderWidth: 1,
    borderColor: COLORS.ghostBorder,
    padding: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    gap: SPACING.sm,
    justifyContent: 'space-between',
  },
  headerChips: {
    gap: SPACING.xs,
    alignItems: 'flex-end',
  },
  question: {
    flex: 1,
    fontFamily: FONTS.displayMedium,
    color: COLORS.text,
    fontSize: 19,
    lineHeight: 24,
  },
  priorityChip: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    borderWidth: 1,
    backgroundColor: COLORS.surfaceHighest,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 5,
  },
  priorityText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 10,
    letterSpacing: 1.1,
  },
  block: {
    gap: SPACING.xs,
  },
  blockLabel: {
    fontFamily: FONTS.bodyMedium,
    color: COLORS.secondary,
    fontSize: 11,
    letterSpacing: 1.2,
  },
  blockValue: {
    fontFamily: FONTS.body,
    color: COLORS.textMuted,
    fontSize: 13,
    lineHeight: 19,
  },
  sources: {
    fontFamily: FONTS.mono,
    color: COLORS.primary,
    fontSize: 11,
  },
  answerInput: {
    minHeight: 92,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.ghostBorder,
    backgroundColor: COLORS.surface,
    color: COLORS.text,
    padding: SPACING.md,
    textAlignVertical: 'top',
    fontFamily: FONTS.body,
    fontSize: 13,
    lineHeight: 19,
  },
  answerPreview: {
    gap: SPACING.xs,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.ghostBorder,
    padding: SPACING.md,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  actionPrimary: {
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.secondaryContainer,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  actionPrimaryText: {
    fontFamily: FONTS.bodyMedium,
    color: COLORS.tertiary,
    fontSize: 11,
    letterSpacing: 1,
  },
  actionGhost: {
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.ghostBorder,
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  actionGhostText: {
    fontFamily: FONTS.bodyMedium,
    color: COLORS.textMuted,
    fontSize: 11,
    letterSpacing: 1,
  },
});
