import { StyleSheet, Text, View } from 'react-native';

import { AmbiguityBudget as AmbiguityBudgetType } from '../schema/noktaTypes';
import { COLORS, FONTS, RADIUS, SPACING } from '../theme';

type AmbiguityBudgetProps = {
  budget: AmbiguityBudgetType;
};

function BudgetColumn({
  label,
  items,
  tone,
}: {
  label: string;
  items: string[];
  tone: string;
}) {
  return (
    <View style={styles.column}>
      <View style={[styles.labelChip, { borderColor: tone }]}>
        <Text style={[styles.labelChipText, { color: tone }]}>{label.toUpperCase()}</Text>
      </View>
      {items.map((item) => (
        <Text key={`${label}-${item}`} style={styles.item}>
          - {item}
        </Text>
      ))}
    </View>
  );
}

export function AmbiguityBudget({ budget }: AmbiguityBudgetProps) {
  return (
    <View style={styles.shell}>
      <BudgetColumn label="High" items={budget.high} tone={COLORS.danger} />
      <BudgetColumn label="Medium" items={budget.medium} tone={COLORS.warning} />
      <BudgetColumn label="Low" items={budget.low} tone={COLORS.secondary} />
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    gap: SPACING.md,
  },
  column: {
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.ghostBorder,
    padding: SPACING.md,
    gap: SPACING.xs,
  },
  labelChip: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    borderWidth: 1,
    backgroundColor: COLORS.surfaceHighest,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 5,
  },
  labelChipText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 10,
    letterSpacing: 1.2,
  },
  item: {
    fontFamily: FONTS.body,
    color: COLORS.textMuted,
    fontSize: 12,
    lineHeight: 18,
  },
});

