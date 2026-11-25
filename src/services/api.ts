// src/services/api.ts
// Cliente HTTP único de la app. Todas las peticiones salen de aquí.

import axios from 'axios';

// Expo solo expone al código las variables que empiezan con EXPO_PUBLIC_.
// El valor sale del archivo .env (ver .env.example).
const API_URL = process.env.EXPO_PUBLIC_API_URL;

if (!API_URL && __DEV__) {
  console.log('[api] Falta EXPO_PUBLIC_API_URL en el archivo .env');
}

export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Interceptor de respuesta: se ejecuta con CADA respuesta antes de que llegue
// a tu código. Aquí solo registramos los errores en la terminal mientras desarrollas.
// En la semana 8 aquí mismo se adjuntará el token de autenticación.
apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (__DEV__ && axios.isAxiosError(error)) {
      console.log('[api] error', error.response?.status ?? 'sin respuesta', error.config?.url);
    }
    return Promise.reject(error);
  },
);

// Convierte cualquier error en un texto que se le pueda mostrar al usuario.
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return 'No pudimos conectar con el servidor. Revisa tu conexión a internet.';
    }
    if (error.response.status === 404) {
      return 'No encontramos lo que buscabas (error 404).';
    }
    if (error.response.status >= 500) {
      return 'El servidor tuvo un problema. Intenta de nuevo en un momento.';
    }
    return `El servidor respondió con un error (${error.response.status}).`;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'Ocurrió un error inesperado.';
}
