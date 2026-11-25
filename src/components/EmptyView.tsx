// src/components/EmptyView.tsx
// Estado vacío reutilizable (lista sin elementos).

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { COLORS, SPACING, TYPOGRAPHY } from '../theme';

interface EmptyViewProps {
  title: string;
  subtitle: string;
}

export function EmptyView({ title, subtitle }: EmptyViewProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>🐾</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xxl,
    gap: SPACING.md,
  },
  icon: {
    fontSize: 52,
  },
  title: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textSecondary,
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.textMuted,
    textAlign: 'center',
    paddingHorizontal: SPACING.lg,
  },
});
