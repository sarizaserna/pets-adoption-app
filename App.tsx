// App.tsx — Semana 05: Networking y TanStack Query v5
// QueryClientProvider (caché del servidor) + NavigationContainer en la raíz.

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { RootNavigator } from './src/navigation/RootNavigator';

// El QueryClient se crea FUERA del componente: así hay una sola instancia
// y la caché no se borra cada vez que App se vuelve a renderizar.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2, // 2 min: los datos se consideran "frescos"
      retry: 2, // si falla, reintenta 2 veces antes de mostrar el error
    },
  },
});

export default function App(): React.JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
        <StatusBar style="light" />
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
