import { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import { COLORS, FONTS, RADIUS, SPACING } from '../theme';

export type AppStep = 'input' | 'processing' | 'memory' | 'clarify';

type AppShellProps = {
  activeStep: AppStep;
  screenTitle: string;
  subtitle: string;
  runId?: string;
  canNavigate: Partial<Record<AppStep, boolean>>;
  onNavigate: (step: AppStep) => void;
  children: ReactNode;
};

const NAV_ITEMS: Array<{ key: AppStep; label: string }> = [
  { key: 'input', label: 'Input' },
  { key: 'processing', label: 'Processing' },
  { key: 'memory', label: 'Memory' },
  { key: 'clarify', label: 'Clarify' },
];

export function AppShell({
  activeStep,
  screenTitle,
  subtitle,
  runId,
  canNavigate,
  onNavigate,
  children,
}: AppShellProps) {
  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.backdropOrb} />
        <LinearGradient
          colors={['rgba(133,236,255,0.10)', 'rgba(13,14,16,0)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        />

        <View style={styles.headerShell}>
          <View style={styles.header}>
            <View style={styles.headerCopy}>
              <Text style={styles.overline}>NOKTA DISTILLERY</Text>
              <Text style={styles.title}>{screenTitle}</Text>
              <Text style={styles.subtitle}>{subtitle}</Text>
            </View>

            {runId ? (
              <View style={styles.runBadge}>
                <Text style={styles.runBadgeLabel}>RUN</Text>
                <Text style={styles.runBadgeValue}>{runId}</Text>
              </View>
            ) : null}
          </View>

          <View style={styles.headerRule} />
        </View>

        <View style={styles.content}>{children}</View>

        <View style={styles.navBar}>
          {NAV_ITEMS.map((item) => {
            const isActive = item.key === activeStep;
            const isEnabled = canNavigate[item.key] ?? false;

            return (
              <Pressable
                disabled={!isEnabled}
                key={item.key}
                onPress={() => onNavigate(item.key)}
                style={[
                  styles.navItem,
                  isActive && styles.navItemActive,
                  !isEnabled && styles.navItemDisabled,
                ]}
              >
                <Text
                  style={[
                    styles.navLabel,
                    isActive && styles.navLabelActive,
                    !isEnabled && styles.navLabelDisabled,
                  ]}
                >
                  {item.label.toUpperCase()}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
  },
  backdropOrb: {
    position: 'absolute',
    top: -40,
    right: -20,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(133,236,255,0.08)',
  },
  headerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 170,
    borderBottomLeftRadius: RADIUS.xl,
    borderBottomRightRadius: RADIUS.xl,
  },
  headerShell: {
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.ghostBorder,
    backgroundColor: 'rgba(29,32,36,0.72)',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    marginBottom: SPACING.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: SPACING.md,
  },
  headerCopy: {
    flex: 1,
    gap: SPACING.xs,
  },
  overline: {
    fontFamily: FONTS.bodyMedium,
    color: COLORS.secondary,
    fontSize: 11,
    letterSpacing: 1.6,
  },
  title: {
    fontFamily: FONTS.displayBold,
    color: COLORS.text,
    fontSize: 28,
  },
  subtitle: {
    fontFamily: FONTS.body,
    color: COLORS.textMuted,
    fontSize: 14,
    lineHeight: 20,
    maxWidth: 300,
  },
  runBadge: {
    backgroundColor: COLORS.surfaceHighest,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.ghostBorder,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    minWidth: 92,
  },
  runBadgeLabel: {
    fontFamily: FONTS.bodyMedium,
    color: COLORS.secondary,
    fontSize: 10,
    letterSpacing: 1.4,
  },
  runBadgeValue: {
    fontFamily: FONTS.mono,
    color: COLORS.text,
    fontSize: 12,
    marginTop: 2,
  },
  headerRule: {
    marginTop: SPACING.md,
    height: 1,
    backgroundColor: COLORS.ghostBorder,
  },
  content: {
    flex: 1,
  },
  navBar: {
    flexDirection: 'row',
    gap: SPACING.sm,
    paddingVertical: SPACING.md,
  },
  navItem: {
    flex: 1,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surfaceLow,
    borderWidth: 1,
    borderColor: COLORS.ghostBorder,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
  },
  navItemActive: {
    backgroundColor: COLORS.surfaceBright,
    borderColor: COLORS.tertiaryDim,
  },
  navItemDisabled: {
    opacity: 0.45,
  },
  navLabel: {
    fontFamily: FONTS.bodyMedium,
    color: COLORS.textMuted,
    fontSize: 11,
    letterSpacing: 1.1,
  },
  navLabelActive: {
    color: COLORS.tertiary,
  },
  navLabelDisabled: {
    color: COLORS.outline,
  },
});
