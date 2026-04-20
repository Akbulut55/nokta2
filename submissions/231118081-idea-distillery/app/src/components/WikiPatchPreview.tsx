import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { ReviewState, WikiPatch } from '../schema/noktaTypes';
import { COLORS, FONTS, RADIUS, SPACING } from '../theme';

type WikiPatchPreviewProps = {
  patchItems: WikiPatch[];
  onChangeReviewState: (patchId: string, reviewState: ReviewState) => void;
};

const PATCH_REVIEW_STATES: ReviewState[] = ['confirmed', 'needs_review', 'discarded', 'locked'];

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

export function WikiPatchPreview({ patchItems, onChangeReviewState }: WikiPatchPreviewProps) {
  return (
    <LinearGradient
      colors={[COLORS.surfaceBright, COLORS.surfaceHighest]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.shell}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.overline}>SIGNATURE FEATURE</Text>
          <Text style={styles.title}>Wiki Patch Preview</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{patchItems.length} ITEMS</Text>
        </View>
      </View>

      {patchItems.map((item) => (
        <View key={item.id} style={styles.row}>
          <View style={styles.rowAccent} />
          <View style={styles.rowTop}>
            <View style={styles.rowTopHeader}>
              <Text style={styles.action}>{item.action}</Text>
              <View
                style={[
                  styles.reviewChip,
                  { borderColor: reviewStateColor(item.reviewState) },
                ]}
              >
                <Text
                  style={[
                    styles.reviewChipText,
                    { color: reviewStateColor(item.reviewState) },
                  ]}
                >
                  {item.reviewState.toUpperCase()}
                </Text>
              </View>
            </View>
            <Text style={styles.path}>{item.path}</Text>
          </View>
          <Text style={styles.reason}>{item.reason}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.metaText}>Sources: {item.sourceIds.join(', ') || 'n/a'}</Text>
            <Text style={styles.metaText}>Cards: {item.affectedCardIds.join(', ') || 'n/a'}</Text>
          </View>
          <View style={styles.controlRow}>
            {PATCH_REVIEW_STATES.map((state) => (
              <Pressable
                key={`${item.id}-${state}`}
                onPress={() => onChangeReviewState(item.id, state)}
                style={[
                  styles.controlButton,
                  item.reviewState === state && {
                    borderColor: reviewStateColor(state),
                    backgroundColor: COLORS.surfaceBright,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.controlButtonText,
                    item.reviewState === state && { color: reviewStateColor(state) },
                  ]}
                >
                  {state.toUpperCase()}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      ))}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  shell: {
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.tertiaryDim,
    padding: SPACING.md,
    gap: SPACING.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  overline: {
    fontFamily: FONTS.bodyMedium,
    color: COLORS.tertiary,
    fontSize: 11,
    letterSpacing: 1.4,
  },
  title: {
    fontFamily: FONTS.displayBold,
    color: COLORS.text,
    fontSize: 22,
  },
  badge: {
    borderRadius: 999,
    backgroundColor: COLORS.secondaryContainer,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 6,
  },
  badgeText: {
    fontFamily: FONTS.bodyMedium,
    color: COLORS.tertiary,
    fontSize: 10,
    letterSpacing: 1.1,
  },
  row: {
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surfaceHigh,
    borderWidth: 1,
    borderColor: COLORS.ghostBorder,
    padding: SPACING.md,
    gap: SPACING.xs,
    overflow: 'hidden',
  },
  rowAccent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: COLORS.tertiaryDim,
  },
  rowTop: {
    gap: SPACING.xs,
  },
  rowTopHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.sm,
  },
  action: {
    fontFamily: FONTS.bodyMedium,
    color: COLORS.tertiary,
    fontSize: 11,
    letterSpacing: 1.4,
  },
  reviewChip: {
    borderRadius: 999,
    borderWidth: 1,
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 5,
  },
  reviewChipText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 10,
    letterSpacing: 1,
  },
  path: {
    fontFamily: FONTS.mono,
    color: COLORS.primary,
    fontSize: 12,
  },
  reason: {
    fontFamily: FONTS.body,
    color: COLORS.textMuted,
    fontSize: 12,
    lineHeight: 18,
  },
  metaRow: {
    gap: 4,
  },
  metaText: {
    fontFamily: FONTS.mono,
    color: COLORS.text,
    fontSize: 11,
  },
  controlRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
    marginTop: SPACING.xs,
  },
  controlButton: {
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.ghostBorder,
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
  },
  controlButtonText: {
    fontFamily: FONTS.bodyMedium,
    color: COLORS.textMuted,
    fontSize: 10,
    letterSpacing: 0.8,
  },
});
