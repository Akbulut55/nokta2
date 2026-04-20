import { StyleSheet, Text, View } from 'react-native';

import { EvidenceLedgerEntry } from '../schema/noktaTypes';
import { COLORS, FONTS, RADIUS, SPACING } from '../theme';

type EvidenceLedgerProps = {
  entries: EvidenceLedgerEntry[];
};

function evidenceColor(type: EvidenceLedgerEntry['evidenceType']) {
  switch (type) {
    case 'direct':
      return COLORS.success;
    case 'merged':
      return COLORS.tertiary;
    case 'inferred':
      return COLORS.warning;
    default:
      return COLORS.textMuted;
  }
}

export function EvidenceLedger({ entries }: EvidenceLedgerProps) {
  const visibleEntries = entries.slice(0, 6);
  const hiddenCount = entries.length - visibleEntries.length;

  return (
    <View style={styles.container}>
      {visibleEntries.map((entry) => (
        <View key={entry.id} style={styles.row}>
          <View style={styles.rowHeader}>
            <View style={[styles.typeChip, { borderColor: evidenceColor(entry.evidenceType) }]}>
              <Text style={[styles.typeChipText, { color: evidenceColor(entry.evidenceType) }]}>
                {entry.evidenceType.toUpperCase()}
              </Text>
            </View>
            <View style={styles.titleBlock}>
              <Text style={styles.claimTitle}>{entry.claimTitle}</Text>
              <Text style={styles.sources}>{entry.sourceIds.join(', ')}</Text>
            </View>
          </View>

          <Text style={styles.note}>{entry.note}</Text>

          <View style={styles.footer}>
            <Text style={styles.confidence}>{entry.confidence.toUpperCase()}</Text>
            <Text style={styles.claimId}>{entry.claimId}</Text>
          </View>
        </View>
      ))}

      {hiddenCount > 0 ? (
        <View style={styles.moreRow}>
          <Text style={styles.moreText}>{hiddenCount} more ledger entries available in the run.</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: SPACING.sm,
  },
  row: {
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.ghostBorder,
    padding: SPACING.md,
    gap: SPACING.xs,
  },
  rowHeader: {
    flexDirection: 'row',
    gap: SPACING.sm,
    alignItems: 'flex-start',
  },
  titleBlock: {
    flex: 1,
    gap: 2,
  },
  typeChip: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    borderWidth: 1,
    backgroundColor: COLORS.surfaceHighest,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 5,
  },
  typeChipText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 10,
    letterSpacing: 1.1,
  },
  claimTitle: {
    fontFamily: FONTS.bodySemiBold,
    color: COLORS.text,
    fontSize: 14,
  },
  note: {
    fontFamily: FONTS.body,
    color: COLORS.textMuted,
    fontSize: 12,
    lineHeight: 18,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.sm,
  },
  confidence: {
    fontFamily: FONTS.bodyMedium,
    color: COLORS.secondary,
    fontSize: 10,
    letterSpacing: 1,
  },
  sources: {
    fontFamily: FONTS.mono,
    color: COLORS.primary,
    fontSize: 11,
  },
  claimId: {
    fontFamily: FONTS.mono,
    color: COLORS.textMuted,
    fontSize: 11,
  },
  moreRow: {
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surfaceLow,
    borderWidth: 1,
    borderColor: COLORS.ghostBorder,
    padding: SPACING.md,
  },
  moreText: {
    fontFamily: FONTS.body,
    color: COLORS.textMuted,
    fontSize: 12,
  },
});
