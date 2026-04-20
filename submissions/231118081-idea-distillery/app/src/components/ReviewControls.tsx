import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ReviewState } from '../schema/noktaTypes';
import { COLORS, FONTS, RADIUS, SPACING } from '../theme';

type ReviewControlsProps = {
  state: ReviewState;
  onChange: (state: ReviewState) => void;
};

const REVIEW_ACTIONS: Array<{ label: string; nextState: ReviewState; tone: string }> = [
  { label: 'Confirm', nextState: 'confirmed', tone: COLORS.success },
  { label: 'Needs Review', nextState: 'needs_review', tone: COLORS.warning },
  { label: 'Discard', nextState: 'discarded', tone: COLORS.danger },
  { label: 'Lock', nextState: 'locked', tone: COLORS.tertiary },
];

function stateColor(state: ReviewState) {
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

export function ReviewControls({ state, onChange }: ReviewControlsProps) {
  return (
    <View style={styles.container}>
      <View style={[styles.stateChip, { borderColor: stateColor(state) }]}>
        <Text style={[styles.stateLabel, { color: stateColor(state) }]}>{state.toUpperCase()}</Text>
      </View>

      <View style={styles.actions}>
        {REVIEW_ACTIONS.map((action) => (
          <Pressable
            key={action.nextState}
            onPress={() => onChange(action.nextState)}
            style={[
              styles.actionButton,
              state === action.nextState && {
                borderColor: action.tone,
                backgroundColor:
                  action.nextState === 'discarded'
                    ? 'rgba(238,125,119,0.12)'
                    : action.nextState === 'needs_review'
                      ? 'rgba(211,173,99,0.12)'
                      : action.nextState === 'confirmed'
                        ? 'rgba(125,201,167,0.12)'
                        : 'rgba(133,236,255,0.12)',
              },
            ]}
          >
            <Text
              style={[
                styles.actionLabel,
                state === action.nextState && { color: action.tone },
              ]}
            >
              {action.label.toUpperCase()}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: SPACING.sm,
  },
  stateChip: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 5,
    backgroundColor: COLORS.surfaceHighest,
  },
  stateLabel: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 10,
    letterSpacing: 1.1,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  actionButton: {
    minWidth: '47%',
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.ghostBorder,
    backgroundColor: COLORS.surfaceLow,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.sm,
  },
  actionLabel: {
    fontFamily: FONTS.bodyMedium,
    color: COLORS.textMuted,
    fontSize: 11,
    letterSpacing: 0.8,
  },
});
