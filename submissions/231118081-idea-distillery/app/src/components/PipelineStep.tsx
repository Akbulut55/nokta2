import { StyleSheet, Text, View } from 'react-native';

import { ProcessStepState } from '../schema/noktaTypes';
import { COLORS, FONTS, RADIUS, SPACING } from '../theme';

type PipelineStepProps = {
  index: number;
  label: string;
  status: ProcessStepState;
  detail?: string;
};

export function PipelineStep({ index, label, status, detail }: PipelineStepProps) {
  const isActive = status === 'active';
  const isComplete = status === 'complete';
  const progressWidth = isComplete ? '100%' : isActive ? '62%' : '12%';

  return (
    <View style={[styles.row, isActive && styles.rowActive]}>
      <View
        style={[
          styles.indexBadge,
          isActive && styles.indexBadgeActive,
          isComplete && styles.indexBadgeComplete,
        ]}
      >
        <Text style={[styles.indexText, isActive && styles.indexTextActive]}>
          {isComplete ? 'OK' : index + 1}
        </Text>
      </View>

      <View style={styles.copy}>
        <Text style={[styles.label, isActive && styles.labelActive]}>{label}</Text>
        <Text style={styles.detail}>
          {detail ??
            (isComplete
              ? 'Completed and retained in the run ledger.'
              : isActive
                ? 'Active pass running on local deterministic rules.'
              : 'Queued behind earlier pipeline stages.')}
        </Text>
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              { width: progressWidth },
              isActive && styles.progressFillActive,
              isComplete && styles.progressFillComplete,
            ]}
          />
        </View>
      </View>

      <View
        style={[
          styles.statusPill,
          isActive && styles.statusPillActive,
          isComplete && styles.statusPillComplete,
        ]}
      >
        <Text style={[styles.statusText, isActive && styles.statusTextActive]}>
          {status.toUpperCase()}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.ghostBorder,
    padding: SPACING.md,
  },
  rowActive: {
    backgroundColor: COLORS.surfaceBright,
    borderColor: COLORS.tertiaryDim,
  },
  indexBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.surfaceHighest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indexBadgeActive: {
    backgroundColor: COLORS.secondaryContainer,
  },
  indexBadgeComplete: {
    backgroundColor: COLORS.successContainer,
  },
  indexText: {
    fontFamily: FONTS.bodyMedium,
    color: COLORS.textMuted,
    fontSize: 11,
    letterSpacing: 0.8,
  },
  indexTextActive: {
    color: COLORS.tertiary,
  },
  copy: {
    flex: 1,
    gap: 4,
  },
  label: {
    fontFamily: FONTS.bodySemiBold,
    color: COLORS.text,
    fontSize: 14,
  },
  labelActive: {
    color: COLORS.tertiary,
  },
  detail: {
    fontFamily: FONTS.body,
    color: COLORS.textMuted,
    fontSize: 12,
    lineHeight: 18,
  },
  progressTrack: {
    height: 5,
    borderRadius: 999,
    backgroundColor: COLORS.surfaceHighest,
    overflow: 'hidden',
    marginTop: SPACING.xs,
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: COLORS.secondary,
  },
  progressFillActive: {
    backgroundColor: COLORS.tertiaryDim,
  },
  progressFillComplete: {
    backgroundColor: COLORS.success,
  },
  statusPill: {
    borderRadius: 999,
    backgroundColor: COLORS.surfaceHighest,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 5,
  },
  statusPillActive: {
    backgroundColor: COLORS.secondaryContainer,
  },
  statusPillComplete: {
    backgroundColor: COLORS.successContainer,
  },
  statusText: {
    fontFamily: FONTS.bodyMedium,
    color: COLORS.textMuted,
    fontSize: 10,
    letterSpacing: 1.1,
  },
  statusTextActive: {
    color: COLORS.tertiary,
  },
});
