// src/components/LoadingView.tsx
// Pantalla de "cargando" reutilizable.

import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { COLORS, SPACING, TYPOGRAPHY } from '../theme';

interface LoadingViewProps {
  message?: string;
}

export function LoadingView({ message = 'Cargando...' }: LoadingViewProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={COLORS.accent} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.md,
    padding: SPACING.lg,
    backgroundColor: COLORS.background,
  },
  message: {
    ...TYPOGRAPHY.caption,
  },
});
