import { Pressable, StyleSheet, Text, View } from 'react-native';

import { RoleKey } from '../schema/noktaTypes';
import { COLORS, FONTS, RADIUS, SPACING } from '../theme';

type RoleTabsProps = {
  roles: RoleKey[];
  selectedRole: RoleKey;
  onSelectRole: (role: RoleKey) => void;
};

export function RoleTabs({ roles, selectedRole, onSelectRole }: RoleTabsProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>ROLE TABS</Text>
      <View style={styles.scroller}>
        {roles.map((role) => {
          const isActive = role === selectedRole;

          return (
            <Pressable
              key={role}
              onPress={() => onSelectRole(role)}
              style={[styles.tab, isActive && styles.tabActive]}
            >
              <Text style={[styles.tabIndex, isActive && styles.tabIndexActive]}>
                {role === 'AI/LLM' ? '05' : `0${roles.indexOf(role) + 1}`}
              </Text>
              <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                {role.toUpperCase()}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: SPACING.xs,
  },
  label: {
    fontFamily: FONTS.bodyMedium,
    color: COLORS.secondary,
    fontSize: 11,
    letterSpacing: 1.3,
  },
  scroller: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  tab: {
    minWidth: '30%',
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.ghostBorder,
    backgroundColor: COLORS.surfaceLow,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    gap: 4,
  },
  tabActive: {
    backgroundColor: COLORS.surfaceBright,
    borderColor: COLORS.tertiaryDim,
  },
  tabIndex: {
    fontFamily: FONTS.mono,
    color: COLORS.secondary,
    fontSize: 10,
  },
  tabIndexActive: {
    color: COLORS.tertiary,
  },
  tabText: {
    fontFamily: FONTS.bodyMedium,
    color: COLORS.textMuted,
    fontSize: 12,
    letterSpacing: 0.9,
  },
  tabTextActive: {
    color: COLORS.tertiary,
  },
});
