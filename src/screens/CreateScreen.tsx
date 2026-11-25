// src/screens/CreateScreen.tsx
// Formulario (modal) para registrar una mascota nueva en el servidor.

import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useCreateItem } from '../hooks/useCreateItem';
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

  const [name, setName] = useState('');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<Gender>('Macho');
  const [description, setDescription] = useState('');
  const [listing, setListing] = useState<Listing>('adoption');
  const [price, setPrice] = useState('');

  // "150.000" o "150000" -> 150000 (se quitan todos los caracteres que no sean dígitos)
  const priceNumber = Number(price.replace(/\D/g, ''));

  // El botón solo se activa con nombre, precio válido si es venta, y sin estar enviando.
  const canSubmit =
    name.trim().length > 0 && (listing === 'adoption' || priceNumber > 0) && !isPending;

  function handleSubmit(): void {
    if (!canSubmit) return;
    const cleanName = name.trim();

    createItem(
      {
        name: cleanName,
        breed: breed.trim() || 'Mestizo',
        age: age.trim() || 'Sin dato',
        gender,
        description: description.trim() || 'Sin descripción por ahora.',
        listing,
        price: listing === 'sale' ? priceNumber : 0,
        // Foto temporal. En la semana 11 se reemplaza por la cámara/galería.
        image: `https://picsum.photos/seed/${encodeURIComponent(cleanName)}/400/300`,
      },
      {
        // Se ejecuta DESPUÉS de que la lista se invalidó y recargó.
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

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>
            Nombre <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Ej: Toby"
            placeholderTextColor={COLORS.textMuted}
            returnKeyType="next"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Raza</Text>
          <TextInput
            style={styles.input}
            value={breed}
            onChangeText={setBreed}
            placeholder="Ej: Labrador"
            placeholderTextColor={COLORS.textMuted}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Edad</Text>
          <TextInput
            style={styles.input}
            value={age}
            onChangeText={setAge}
            placeholder="Ej: 2 años"
            placeholderTextColor={COLORS.textMuted}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Género</Text>
          <View style={styles.chipRow}>
            {GENDERS.map((option) => (
              <Pressable
                key={option}
                style={[styles.chip, gender === option && styles.chipActive]}
                onPress={() => setGender(option)}
              >
                <Text style={[styles.chipText, gender === option && styles.chipTextActive]}>
                  {option}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Tipo</Text>
          <View style={styles.chipRow}>
            {LISTINGS.map((option) => (
              <Pressable
                key={option.value}
                style={[styles.chip, listing === option.value && styles.chipActive]}
                onPress={() => setListing(option.value)}
              >
                <Text
                  style={[styles.chipText, listing === option.value && styles.chipTextActive]}
                >
                  {option.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {listing === 'sale' && (
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>
              Precio (COP) <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              value={price}
              onChangeText={setPrice}
              placeholder="Ej: 150000"
              placeholderTextColor={COLORS.textMuted}
              keyboardType="numeric"
            />
          </View>
        )}

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Descripción</Text>
          <TextInput
            style={[styles.input, styles.multiline]}
            value={description}
            onChangeText={setDescription}
            placeholder="Cuéntanos cómo es…"
            placeholderTextColor={COLORS.textMuted}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <Pressable
          style={[styles.button, !canSubmit && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={!canSubmit}
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
