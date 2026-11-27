// src/navigation/RootNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text } from 'react-native';
import { CreateScreen } from '../screens/CreateScreen';
import { DetailScreen } from '../screens/DetailScreen';
import { EditScreen } from '../screens/EditScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { SavedScreen } from '../screens/SavedScreen';
import { COLORS } from '../theme';
import type { HomeStackParamList, RootTabParamList } from './types';
import { useSavedStore } from '../stores/savedStore';

const HomeStack = createNativeStackNavigator<HomeStackParamList>();

function HomeStackNavigator(): React.JSX.Element {
  return (
    <HomeStack.Navigator
      initialRouteName="HomeList"
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.surface },
        headerTintColor: COLORS.accent,
        headerTitleStyle: { fontWeight: 'bold' as const },
      }}
    >
      <HomeStack.Screen
        name="HomeList"
        component={HomeScreen}
        options={({ navigation }) => ({
          title: 'Huellitas',
          headerRight: () => (
            <Pressable
              onPress={() => navigation.navigate('Create')}
              accessibilityLabel="Agregar mascota"
              testID="add-button"
            >
              <Text style={styles.headerButton}>+</Text>
            </Pressable>
          ),
        })}
      />
      <HomeStack.Screen
        name="HomeDetail"
        component={DetailScreen}
        options={({ route }) => ({ title: route.params.name })}
      />
      <HomeStack.Screen
        name="Create"
        component={CreateScreen}
        options={{ title: 'Nueva mascota', presentation: 'modal' }}
      />
      <HomeStack.Screen
        name="Edit"
        component={EditScreen}
        options={{ title: 'Editar mascota', presentation: 'modal' }}
      />
    </HomeStack.Navigator>
  );
}

const Tab = createBottomTabNavigator<RootTabParamList>();

export function RootNavigator(): React.JSX.Element {
  const savedCount = useSavedStore((state) => state.savedIds.length);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.accent,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarStyle: { backgroundColor: COLORS.surface },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else {
            iconName = focused ? 'heart' : 'heart-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeStackNavigator}
        options={{ tabBarLabel: 'Inicio' }}
      />
      <Tab.Screen
        name="Saved"
        component={SavedScreen}
        options={{
          tabBarLabel: 'Favoritos',
          tabBarBadge: savedCount > 0 ? savedCount : undefined,
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  headerButton: {
    color: COLORS.accent,
    fontSize: 28,
    fontWeight: '300',
    paddingHorizontal: 8,
  },
});