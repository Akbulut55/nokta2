import { StyleSheet, Text, View } from 'react-native';

import { HandoffPack as HandoffPackType } from '../schema/noktaTypes';
import { COLORS, FONTS, RADIUS, SPACING } from '../theme';

type HandoffPackProps = {
  handoffPack: HandoffPackType;
};

function ListBlock({ label, items }: { label: string; items: string[] }) {
  return (
    <View style={styles.block}>
      <Text style={styles.blockLabel}>{label}</Text>
      {items.length > 0 ? (
        items.map((item) => (
          <Text key={`${label}-${item}`} style={styles.blockItem}>
            - {item}
          </Text>
        ))
      ) : (
        <Text style={styles.blockItem}>- None yet.</Text>
      )}
    </View>
  );
}

export function HandoffPack({ handoffPack }: HandoffPackProps) {
  return (
    <View style={styles.shell}>
      <View style={styles.summaryPanel}>
        <Text style={styles.summaryLabel}>HANDOFF SUMMARY</Text>
        <Text style={styles.summary}>{handoffPack.summary}</Text>
      </View>

      <ListBlock label="Confirmed decisions" items={handoffPack.confirmedDecisions} />
      <ListBlock label="Locked constraints" items={handoffPack.lockedConstraints} />
      <ListBlock label="Unresolved contradictions" items={handoffPack.unresolvedContradictions} />
      <ListBlock label="Unresolved questions" items={handoffPack.unresolvedQuestions} />
      <ListBlock label="Recommended next steps" items={handoffPack.recommendedNextSteps} />
      <ListBlock label="Traceability summary" items={handoffPack.traceabilitySummary} />

      <View style={styles.roleSection}>
        <Text style={styles.blockLabel}>Role-specific notes</Text>
        {Object.entries(handoffPack.roleSpecificNotes).map(([role, notes]) => (
          <View key={role} style={styles.roleBlock}>
            <Text style={styles.roleLabel}>{role}</Text>
            {notes.length > 0 ? (
              notes.map((note) => (
                <Text key={`${role}-${note}`} style={styles.blockItem}>
                  - {note}
                </Text>
              ))
            ) : (
              <Text style={styles.blockItem}>- No role-specific notes yet.</Text>
            )}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    gap: SPACING.md,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.surfaceHigh,
    borderWidth: 1,
    borderColor: COLORS.ghostBorder,
    padding: SPACING.md,
  },
  summaryPanel: {
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.ghostBorder,
    padding: SPACING.md,
    gap: SPACING.xs,
  },
  summaryLabel: {
    fontFamily: FONTS.bodyMedium,
    color: COLORS.tertiary,
    fontSize: 11,
    letterSpacing: 1.2,
  },
  summary: {
    fontFamily: FONTS.body,
    color: COLORS.text,
    fontSize: 14,
    lineHeight: 20,
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
  blockItem: {
    fontFamily: FONTS.body,
    color: COLORS.textMuted,
    fontSize: 12,
    lineHeight: 18,
  },
  roleSection: {
    gap: SPACING.sm,
  },
  roleBlock: {
    gap: SPACING.xs,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.ghostBorder,
    padding: SPACING.sm,
  },
  roleLabel: {
    fontFamily: FONTS.bodyMedium,
    color: COLORS.primary,
    fontSize: 11,
    letterSpacing: 1,
  },
});
