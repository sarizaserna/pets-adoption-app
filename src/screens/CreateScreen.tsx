// src/screens/CreateScreen.tsx
// Formulario para registrar una mascota nueva con React Hook Form + Zod + FormField.

import React from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Controller, useForm } from 'react-hook-form';

import { FormField } from '../components/FormField';
import { useCreateItem } from '../hooks/useCreateItem';
import { petFormSchema, type PetFormValues } from '../schemas/pet.schema';
import { getErrorMessage } from '../services/api';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../theme';
import type { HomeStackParamList } from '../navigation/types';
import type { Listing } from '../types';

type CreateScreenNavProp = NativeStackNavigationProp<HomeStackParamList, 'Create'>;

type Gender = 'Macho' | 'Hembra';
const GENDERS: Gender[] = ['Macho', 'Hembra'];

const LISTINGS: { value: Listing; label: string }[] = [
  { value: 'adoption', label: 'Adopción' },
  { value: 'sale', label: 'Venta' },
];

export function CreateScreen(): React.JSX.Element {
  const navigation = useNavigation<CreateScreenNavProp>();
  const { mutate: createItem, isPending } = useCreateItem();

  const {
    control,
    handleSubmit,
    watch,
  } = useForm<PetFormValues>({
    resolver: zodResolver(petFormSchema),
    defaultValues: {
      name: '',
      breed: '',
      age: '',
      gender: 'Macho',
      listing: 'adoption',
      price: '',
      description: '',
    },
  });

  const selectedListing = watch('listing');

  function onSubmit(values: PetFormValues): void {
    const cleanName = values.name.trim();
    const priceNumber = Number((values.price ?? '').replace(/\D/g, ''));

    createItem(
      {
        name: cleanName,
        breed: values.breed?.trim() || 'Mestizo',
        age: values.age?.trim() || 'Sin dato',
        gender: values.gender,
        description: values.description?.trim() || 'Sin descripción por ahora.',
        listing: values.listing,
        price: values.listing === 'sale' ? priceNumber : 0,
        image: `https://picsum.photos/seed/${encodeURIComponent(cleanName)}/400/300`,
      },
      {
        onSuccess: () => navigation.goBack(),
        onError: (error) => Alert.alert('No se pudo guardar', getErrorMessage(error)),
      },
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.sectionLabel}>Datos de la mascota</Text>

        <FormField
          control={control}
          name="name"
          label="Nombre"
          required
          placeholder="Ej: Toby"
          returnKeyType="next"
        />

        <FormField
          control={control}
          name="breed"
          label="Raza"
          placeholder="Ej: Labrador"
        />

        <FormField
          control={control}
          name="age"
          label="Edad"
          placeholder="Ej: 2 años"
        />

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Género</Text>
          <Controller
            control={control}
            name="gender"
            render={({ field: { onChange, value } }) => (
              <View style={styles.chipRow}>
                {GENDERS.map((option) => (
                  <Pressable
                    key={option}
                    style={[styles.chip, value === option && styles.chipActive]}
                    onPress={() => onChange(option)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        value === option && styles.chipTextActive,
                      ]}
                    >
                      {option}
                    </Text>
                  </Pressable>
                ))}
              </View>
            )}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Tipo</Text>
          <Controller
            control={control}
            name="listing"
            render={({ field: { onChange, value } }) => (
              <View style={styles.chipRow}>
                {LISTINGS.map((option) => (
                  <Pressable
                    key={option.value}
                    style={[styles.chip, value === option.value && styles.chipActive]}
                    onPress={() => onChange(option.value)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        value === option.value && styles.chipTextActive,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            )}
          />
        </View>

        {selectedListing === 'sale' && (
          <FormField
            control={control}
            name="price"
            label="Precio (COP)"
            required
            placeholder="Ej: 150000"
            keyboardType="numeric"
          />
        )}

        <FormField
          control={control}
          name="description"
          label="Descripción"
          placeholder="Cuéntanos cómo es…"
          multiline
          numberOfLines={4}
        />

        <Pressable
          style={[styles.button, isPending && styles.buttonDisabled]}
          onPress={() => {
            void handleSubmit(onSubmit)();
          }}
          disabled={isPending}
          testID="submit-button"
        >
          {isPending ? (
            <ActivityIndicator size="small" color={COLORS.background} />
          ) : (
            <Text style={styles.buttonText}>Guardar mascota</Text>
          )}
        </Pressable>

        <Pressable style={styles.cancel} onPress={() => navigation.goBack()}>
          <Text style={styles.cancelText}>Cancelar</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.lg,
    gap: SPACING.md,
    paddingBottom: SPACING.xxl,
  },
  sectionLabel: {
    ...TYPOGRAPHY.label,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  field: {
    gap: SPACING.xs,
  },
  fieldLabel: {
    ...TYPOGRAPHY.body,
    fontWeight: '600',
  },
  chipRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  chip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipActive: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  chipText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
  },
  chipTextActive: {
    color: COLORS.background,
    fontWeight: '600',
  },
  button: {
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  buttonDisabled: {
    opacity: 0.45,
  },
  buttonText: {
    ...TYPOGRAPHY.body,
    fontWeight: '700',
    color: COLORS.background,
  },
  cancel: {
    alignItems: 'center',
    padding: SPACING.sm,
  },
  cancelText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textMuted,
  },
});