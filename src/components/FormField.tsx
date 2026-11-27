import React from 'react';
import {
  Control,
  Controller,
  FieldPath,
  FieldValues,
} from 'react-hook-form';
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';

import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../theme';

interface FormFieldProps<T extends FieldValues> extends TextInputProps {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  required?: boolean;
  multiline?: boolean;
}

export function FormField<T extends FieldValues>({
  control,
  name,
  label,
  required = false,
  multiline = false,
  style,
  ...inputProps
}: FormFieldProps<T>): React.JSX.Element {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>
            {label}
            {required ? <Text style={styles.required}> *</Text> : null}
          </Text>

          <TextInput
            style={[
              styles.input,
              multiline && styles.multiline,
              error && styles.inputError,
              style,
            ]}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value === undefined || value === null ? '' : String(value)}
            placeholderTextColor={COLORS.textMuted}
            multiline={multiline}
            textAlignVertical={multiline ? 'top' : 'center'}
            {...inputProps}
          />

          {error ? <Text style={styles.errorText}>{error.message}</Text> : null}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  field: {
    gap: SPACING.xs,
  },
  fieldLabel: {
    ...TYPOGRAPHY.body,
    fontWeight: '600',
  },
  required: {
    color: COLORS.error,
  },
  input: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.sm,
    padding: SPACING.sm,
    ...TYPOGRAPHY.body,
  },
  multiline: {
    minHeight: 96,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  errorText: {
    ...TYPOGRAPHY.label,
    color: COLORS.error,
  },
});