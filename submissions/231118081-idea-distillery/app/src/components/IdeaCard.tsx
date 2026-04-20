import { StyleSheet, Text, View } from 'react-native';

import { IdeaCard as IdeaCardType, ReviewState } from '../schema/noktaTypes';
import { COLORS, FONTS, RADIUS, SPACING } from '../theme';
import { ReviewControls } from './ReviewControls';

type IdeaCardProps = {
  card: IdeaCardType;
  onChangeReviewState: (cardId: string, reviewState: ReviewState) => void;
};

function confidenceColor(confidence: IdeaCardType['confidence']) {
  switch (confidence) {
    case 'high':
      return COLORS.success;
    case 'medium':
      return COLORS.warning;
    case 'low':
      return COLORS.danger;
    default:
      return COLORS.secondary;
  }
}

export function IdeaCard({ card, onChangeReviewState }: IdeaCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.headerCopy}>
          <View style={styles.headerTop}>
            <Text style={styles.cardId}>{card.id}</Text>
            {card.relatedContradictions.length > 0 ? (
              <Text style={styles.alertText}>CONFLICT LINKED</Text>
            ) : null}
          </View>
          <Text style={styles.title}>{card.title}</Text>
        </View>

        <View style={styles.headerMeta}>
          <View style={styles.metaChip}>
            <Text style={styles.metaLabel}>{card.type.toUpperCase()}</Text>
          </View>
          <View
            style={[
              styles.metaChip,
              { borderColor: confidenceColor(card.confidence), backgroundColor: COLORS.surfaceHighest },
            ]}
          >
            <Text style={[styles.metaLabel, { color: confidenceColor(card.confidence) }]}>
              {card.confidence.toUpperCase()}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.claimPanel}>
        <Text style={styles.claim}>{card.distilledClaim}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.sectionLabel}>Sources</Text>
        <View style={styles.inlineWrap}>
          {card.supportingSources.map((sourceId) => (
            <View key={sourceId} style={styles.sourceChip}>
              <Text style={styles.sourceChipText}>{sourceId}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.row}>
        <Text style={styles.sectionLabel}>Roles</Text>
        <View style={styles.inlineWrap}>
          {card.relatedRoles.map((role) => (
            <View key={role} style={styles.roleChip}>
              <Text style={styles.roleChipText}>{role}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.row}>
        <Text style={styles.sectionLabel}>Wiki Patch Impact</Text>
        <View style={styles.pathList}>
          {card.wikiPatchImpact.map((path) => (
            <Text key={path} style={styles.pathText}>
              {path}
            </Text>
          ))}
        </View>
      </View>

      {card.relatedContradictions.length > 0 ? (
        <View style={styles.row}>
          <Text style={styles.sectionLabel}>Linked contradictions</Text>
          <Text style={styles.contradictionsText}>{card.relatedContradictions.join(', ')}</Text>
        </View>
      ) : null}

      <ReviewControls
        state={card.reviewState}
        onChange={(nextState) => onChangeReviewState(card.id, nextState)}
      />
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.md,
  },
  headerCopy: {
    flex: 1,
    gap: SPACING.xs,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.sm,
    alignItems: 'center',
  },
  cardId: {
    fontFamily: FONTS.mono,
    color: COLORS.tertiary,
    fontSize: 11,
  },
  alertText: {
    fontFamily: FONTS.bodyMedium,
    color: COLORS.danger,
    fontSize: 10,
    letterSpacing: 1.1,
  },
  title: {
    fontFamily: FONTS.displayMedium,
    color: COLORS.text,
    fontSize: 18,
  },
  claimPanel: {
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.ghostBorder,
    padding: SPACING.md,
  },
  claim: {
    fontFamily: FONTS.body,
    color: COLORS.text,
    fontSize: 13,
    lineHeight: 19,
  },
  headerMeta: {
    gap: SPACING.xs,
    alignItems: 'flex-end',
  },
  metaChip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.ghostBorder,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 5,
    backgroundColor: COLORS.surface,
  },
  metaLabel: {
    fontFamily: FONTS.bodyMedium,
    color: COLORS.textMuted,
    fontSize: 10,
    letterSpacing: 1,
  },
  row: {
    gap: SPACING.xs,
  },
  sectionLabel: {
    fontFamily: FONTS.bodyMedium,
    color: COLORS.secondary,
    fontSize: 11,
    letterSpacing: 1.2,
  },
  inlineWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
  },
  sourceChip: {
    borderRadius: 999,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.ghostBorder,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 5,
  },
  sourceChipText: {
    fontFamily: FONTS.mono,
    color: COLORS.text,
    fontSize: 11,
  },
  roleChip: {
    borderRadius: 999,
    backgroundColor: COLORS.secondaryContainer,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 5,
  },
  roleChipText: {
    fontFamily: FONTS.bodyMedium,
    color: COLORS.primary,
    fontSize: 11,
  },
  pathList: {
    gap: SPACING.xs,
  },
  pathText: {
    fontFamily: FONTS.mono,
    color: COLORS.primary,
    fontSize: 11,
  },
  contradictionsText: {
    fontFamily: FONTS.mono,
    color: COLORS.danger,
    fontSize: 11,
  },
});
