# Huellitas — Tienda de mascotas y adopción

App móvil hecha con React Native y Expo para una **tienda de mascotas con servicio de adopción**: cada mascota se entrega en adopción (gratis) o se vende (con precio). Se construye semana a semana, una rama por semana (`week-01`, `week-02`…), con commits convencionales.

Guía completa del proyecto: [docs/00-GUIA-MAESTRA.md](docs/00-GUIA-MAESTRA.md)
Guía de esta semana: [docs/handoffs/HANDOFF-week-05.md](docs/handoffs/HANDOFF-week-05.md)

## Qué hace (semana 05)

- Lista de mascotas cargada desde una API REST, con estados de **carga**, **error con reintento** y **vacío**, y **pull-to-refresh**.
- Detalle de cada mascota con datos frescos del servidor.
- Formulario para **registrar una mascota** (adopción o venta con precio). Al guardar, la lista se actualiza sola.
- Favoritos: se guardan solo los **ids** en el dispositivo; los datos salen de la caché.

## Tecnologías

| Pieza | Para qué |
| --- | --- |
| Expo + React Native + TypeScript estricto | App móvil |
| React Navigation 7 (Tab + Stack) | Navegación |
| Axios | Cliente HTTP (`src/services/api.ts`) |
| TanStack Query v5 | Estado del servidor: caché, carga, errores, mutaciones |
| Zustand + AsyncStorage | Estado local: ids de favoritos |
| pnpm (versiones exactas) | Gestor de paquetes |
| husky + commitlint | Commits convencionales y typecheck antes de cada commit |

## API

La API es un recurso `pets` en [MockAPI](https://mockapi.io) (API REST de práctica que guarda los datos).

| Verbo | Endpoint | Uso |
| --- | --- | --- |
| `GET` | `/pets` | Lista de mascotas |
| `GET` | `/pets/:id` | Una mascota |
| `POST` | `/pets` | Crear una mascota |

Modelo `Item` (`src/types/index.ts`): `id`, `name`, `description`, `breed`, `age`, `gender`, `image`, `listing` (`adoption` o `sale`) y `price`.

## Cómo correrla

1. Instala dependencias: `pnpm install`
2. Crea un archivo `.env` (mira `.env.example`) con la URL base de tu API, **sin** `/pets` al final:

   ```text
   EXPO_PUBLIC_API_URL=https://TU-ID.mockapi.io/api/v1
   ```

3. Carga las mascotas de ejemplo: `node scripts/seed.mjs https://TU-ID.mockapi.io/api/v1`
4. Inicia: `pnpm exec expo start -c` y abre la app con Expo Go.

Otros comandos: `pnpm typecheck` (revisa tipos).

## Estructura

```text
src/
├── components/   LoadingView, ErrorView, EmptyView
├── hooks/        useItems, useItemById, useCreateItem (TanStack Query)
├── navigation/   Tab + Stack tipados
├── screens/      HomeScreen, DetailScreen, CreateScreen, SavedScreen
├── services/     api.ts (instancia Axios)
├── stores/       savedStore (Zustand: solo ids)
├── theme/        colores, tipografía, espaciado
├── types/        Item, CreateItemPayload
└── utils/        formatPrice, formatListing
```

## Dónde vive cada dato

| Dato | Dónde |
| --- | --- |
| Lista y detalle de mascotas | Caché de TanStack Query (`['pets']`, `['pets', id]`) |
| Ids de favoritos | Zustand (persistido) |
| Texto del formulario a medias | `useState` de la pantalla |

## Capturas

| Inicio | Crear | Detalle | Favoritos |
| --- | --- | --- | --- |
| ![Inicio](docs/screenshots/home.png) | ![Crear](docs/screenshots/create.png) | ![Detalle](docs/screenshots/detail.png) | ![Favoritos](docs/screenshots/saved.png) |
