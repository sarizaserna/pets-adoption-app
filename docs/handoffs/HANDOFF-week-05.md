# HANDOFF — Semana 05: Networking y TanStack Query v5

> Lee primero `docs/00-GUIA-MAESTRA.md`. Este archivo es autocontenido para la semana 05.
> Escrito para alguien que **no conoce el tema**: cada paso explica qué haces, por qué, cómo comprobarlo y qué commit hacer.

## 0. Cómo usar este documento

Con este documento viene la carpeta `proyecto/` (tu app terminada) y un archivo `semana-05.patch` (los mismos commits listos para aplicar). Tienes dos caminos:

| Camino | Qué haces | Cuándo usarlo |
| --- | --- | --- |
| **A — Rápido** | `git am semana-05.patch` aplica los 15 commits de una vez | Si se acaba el tiempo o quieres comparar con tu repo |
| **B — Paso a paso (recomendado)** | Sigues los pasos 0 a 12 de abajo, escribiendo el código y haciendo cada commit | La primera vez: así aprendes qué hace cada pieza |

Si en el camino B un archivo no te funciona, abre ese mismo archivo en `proyecto/` y compara. Los pasos están en orden y **cada commit compila por sí solo** (tu hook `pre-commit` ejecuta `pnpm typecheck` y bloquea el commit si hay errores de TypeScript).

**Cómo leer los bloques de cambios (diff).** Cuando un archivo ya existe, te muestro solo lo que cambia:

- Las líneas que empiezan con `-` se **borran**.
- Las líneas que empiezan con `+` se **agregan**.
- Las líneas sin símbolo son contexto: te ayudan a ubicarte, no las toques.
- `@@ -10,6 +10,9 @@` indica el número de línea aproximado; puede variar unas líneas en tu archivo.

Si no te sientes cómoda con un diff, copia el archivo completo desde `proyecto/`.

## 1. Contexto

- Proyecto: **Huellitas**, app de **tienda de mascotas y adopción** (React Native, Expo, TypeScript estricto, pnpm con versiones fijas, Conventional Commits).
- Rama de trabajo: `week-05`, creada desde **`week-4`**.
- En tu GitHub existen `week-04` y `week-4`. `week-4` es `week-04` más tu commit "semana 4" (Axios y React Query ya instalados, y tu `.env`). Esta guía parte de `week-4`.
- Estado inicial esperado: tu app de la semana 4 (Tab + Stack, favoritos con Zustand) leyendo mascotas de una lista local (`src/data/mockData.ts`).
- Resultado esperado: la misma app, pero la lista, el detalle y el formulario de crear hablan con una **API real** usando Axios y TanStack Query v5.

**Qué verifiqué yo y qué te falta a ti**

| Verificado en mi entorno | Pendiente por ti |
| --- | --- |
| `pnpm typecheck` sin errores en cada uno de los 15 commits | Probar la app en Expo Go o simulador |
| La app se empaqueta para Android con `expo export` (Metro resuelve todos los archivos) | Crear tu API en MockAPI y poner tu URL en `.env` |
| Axios contra un servidor local que imita MockAPI: listar, crear, detalle, 404 y falta de red | Tomar las capturas para el README |
| Migración de favoritos viejos (de objetos a ids) con datos de la semana 4 | Subir la rama a GitHub |
| Hooks de husky y commitlint rechazando mensajes inválidos | |

## 2. Qué pide la semana 5 (carpeta `3-proyecto`)

**Objetivo del proyecto:** una app que consume una API REST con Axios y TanStack Query v5: muestra una lista de ítems de tu dominio, navega al detalle, permite crear ítems con un formulario y maneja los estados de red (carga, error, vacío, pull-to-refresh). Se entrega **en vivo al cierre de la clase** (180 min, sin trabajo en casa).

### Mínimo para entregar (25 de 30 puntos)

| # | Requisito del bootcamp | Dónde queda en tu app | Puntos |
| --- | --- | --- | --- |
| 1 | `QueryClientProvider` envuelve la app en `App.tsx` | `App.tsx` | 3 |
| 2 | Instancia Axios con `baseURL` en `src/services/api.ts` | `src/services/api.ts` | 4 |
| 3 | `HomeScreen` con `FlatList` cargada con `useQuery`, `queryKey` semántico y hook `useItems` | `src/hooks/useItems.ts` (`['pets']`) y `src/screens/HomeScreen.tsx` | 6 |
| 4 | Loading: `ActivityIndicator` mientras `isLoading === true` | `LoadingView` usado en `HomeScreen` | 5 (los tres estados juntos) |
| 5 | Error: mensaje cuando `isError === true` | `ErrorView` con botón Reintentar | |
| 6 | Vacío: `ListEmptyComponent` cuando no hay datos | `EmptyView` en el `FlatList` | |
| 7 | Crear: `CreateScreen` hace POST con `useMutation` (`useCreateItem`) e invalida la query en `onSuccess` | `src/hooks/useCreateItem.ts` y `src/screens/CreateScreen.tsx` | 7 |

Además: TypeScript sin errores ni `any`, y la app corre en el simulador o Expo Go.

### Extras (suman, no condicionan aprobar)

| Extra del bootcamp | Dónde queda |
| --- | --- |
| Pull-to-refresh con `refetch` (+5 puntos en la rúbrica) | `onRefresh={refetch}` en Inicio y Favoritos |
| Botón "Reintentar" en el error | `ErrorView` |
| Detalle propio con `useItemById` y botón reintentar | `DetailScreen` |
| Alerta con el error de la mutación | `Alert.alert` en `CreateScreen` |
| Campos adicionales de tu dominio | `listing` (adopción o venta) y `price` |
| README con dominio, API y capturas | `README.md` (las capturas las agregas tú) |

### Entregables de la carpeta `3-proyecto`

1. Demo en vivo en el simulador (iOS y/o Android).
2. `useQuery` consumiendo al menos un endpoint real de tu dominio.
3. `useMutation` con `invalidateQueries` en `onSuccess`.
4. Manejo de loading, error y empty states en `HomeScreen`.

### Penalizaciones que debes evitar

| Infracción | Penalización | Cómo la evitamos |
| --- | --- | --- |
| `as any` | −5 | No se usa ninguno (`grep -rn "as any" src` no devuelve nada) |
| Datos del servidor guardados en Zustand | −10 | Zustand guarda **solo ids** (paso 10) |
| `fetch`/Axios directo en `useEffect` | −8 | Todo va por hooks de TanStack Query |
| La app no inicia o falla al abrir | −10 | Verifica el paso 12 antes de la demo |
| Copiar la implementación de otro aprendiz | −15 | Tu dominio (tienda y adopción) es propio; escribe y entiende tu código |

## 3. Lo que encontré en tu repo (y cómo lo arreglamos)

Analicé el `.zip` de tu proyecto de la semana 4. Estos son los hallazgos que afectan a la semana 5:

| # | Hallazgo | Por qué importa | Solución |
| --- | --- | --- | --- |
| 1 | `pnpm typecheck` no existe en `package.json`, pero `.husky/pre-commit` lo ejecuta | Con los hooks activos, **todos tus commits serían rechazados** | Agregar el script (paso 1) |
| 2 | `src/components/PetCard.tsx` importa un tipo `Pet` que ya no existe | `tsc` falla: un error de TypeScript | Borrar el archivo (paso 1) |
| 3 | `husky` y `commitlint` no están en `devDependencies` | Aunque la carpeta `.husky/` existe, en una instalación nueva los hooks no se activan | Instalarlos (paso 2) |
| 4 | Hay dos lockfiles: `package-lock.json` y `pnpm-lock.yaml` | Usas pnpm; el de npm sobra y confunde | Borrar `package-lock.json` (paso 1) |
| 5 | Tu commit "semana 4" subió `.env` a GitHub, aunque `.gitignore` lo ignora (se agregó a la fuerza) | Cualquiera puede ver la URL de tu API. Es solo una API de práctica, no un secreto, pero ahí nunca deben ir claves | Lo dejamos para que tu repo corra al clonarlo (nota en el paso 3) |
| 6 | `savedStore` guarda **mascotas completas** en Zustand | Con una API, eso es "estado del servidor en Zustand" (−10 puntos) | Guardar solo ids (paso 10) |
| 7 | En `DetailScreen` el selector `useSavedStore((s) => s.isItemSaved)` devuelve una función | Una función nunca cambia, así que la pantalla no se entera cuando cambian los favoritos | Seleccionar un dato: `s.savedIds.includes(id)` (paso 10) |
| 8 | `package.json` dice `expo 58.0.23`, y la guía maestra dice SDK 57 | Tu Expo Go debe corresponder al SDK del proyecto | Verifica tu versión (paso 0) |
| 9 | Una dependencia con `^` (`react-native-web`) | Rompe la regla de versiones exactas | Opcional: quita el `^` y corre `pnpm install` |
| 10 | Existen dos ramas, `week-04` y `week-4` | `week-4` tiene un commit más ("semana 4"); es fácil trabajar sobre la equivocada | Partimos de `week-4`; no borres ninguna |
| 11 | `@tanstack/react-query` quedó como `^5.108.0` | El `^` rompe la regla de versiones exactas | Se fija a `5.108.0` (paso 4) |
| 12 | El mensaje del commit "semana 4" no sigue Conventional Commits | Commitlint lo habría rechazado: los hooks no estaban activos | Con el paso 2 quedan activos |

> No pude ver tu historial de git (el `.zip` no incluye la carpeta `.git`). Confirma tus ramas con `git branch` antes de empezar.

## 4. Conceptos en 5 minutos

**Estado del servidor vs estado local.** Hay dos tipos de datos en una app:

- **Estado local o de interfaz:** vive en el teléfono (¿está abierto el menú? ¿qué mascotas marqué como favoritas?). Lo manejas con `useState` o Zustand.
- **Estado del servidor:** vive en otro computador (la lista de mascotas). Tu app solo guarda una **copia** que puede quedar vieja. Hay que pedirla, guardarla, refrescarla y avisar si falló. Eso lo hace **TanStack Query**.

**API REST y endpoint.** Una API es un servidor al que le haces peticiones HTTP. Cada dirección es un *endpoint*, y el verbo dice qué quieres hacer:

| Verbo | Endpoint | Qué hace |
| --- | --- | --- |
| `GET` | `/pets` | Trae la lista de mascotas |
| `GET` | `/pets/7` | Trae la mascota 7 |
| `POST` | `/pets` | Crea una mascota (el servidor le pone el `id`) |

**Axios.** Es la librería que hace esas peticiones. Creas **una sola instancia** con la dirección base (`baseURL`), un tiempo máximo de espera (`timeout`) y cabeceras. Después escribes solo `apiClient.get('/pets')`. Un **interceptor** es una función que se ejecuta con cada respuesta; por ahora lo usamos para registrar errores y en la semana 8 adjuntará el token.

**TanStack Query.** Piénsalo como un mesero con memoria: la primera vez que pides la lista va a la cocina (la API); las siguientes te la da de su libreta (la **caché**) y, si pasó mucho tiempo, va a revisar si cambió.

- `useQuery({ queryKey, queryFn })` **lee**. La `queryKey` es el nombre con el que se archiva en la caché (`['pets']`). La `queryFn` es la función que hace la petición.
- Te devuelve `data` y banderas: `isLoading` (primera carga, sin datos), `isError`, `error`, `isFetching` (se está pidiendo algo ahora, aunque ya haya datos) y `refetch` (volver a pedir).
- `staleTime` es cuánto tiempo los datos se consideran frescos (aquí 2 minutos). Pasado ese tiempo se consideran "viejos" y se refrescan al volver a usarlos.
- `useMutation({ mutationFn })` **escribe** (crear, editar, borrar). No corre solo: lo disparas con `mutate(datos)`. Te da `isPending` (está enviando).
- `invalidateQueries({ queryKey: ['pets'] })` marca esa caché como vieja y la vuelve a pedir. Es lo que hace que **la lista se actualice sola** después de crear una mascota.

**Cómo viaja un dato**

```text
Pantalla  ──usa──>  hook (useItems)  ──llama──>  apiClient (Axios)  ──HTTP──>  API (MockAPI)
   ▲                      │
   └──── data, isLoading ─┴── caché de TanStack Query bajo la llave ['pets']

Crear mascota:  mutate(datos) ─> POST /pets ─> OK ─> invalidateQueries(['pets']) ─> la lista se vuelve a pedir ─> pantalla actualizada
```

**La regla de oro de la semana:** los datos del servidor viven en la caché de TanStack Query; en Zustand solo van cosas del dispositivo o de la persona, como los **ids** de favoritos.

## 5. Paso 0 — Preparar la rama y revisar el entorno

1. Abre una terminal en la carpeta de tu proyecto y confirma que no tienes cambios sin guardar:

```bash
git status
```

Debe decir `nothing to commit, working tree clean`. Si hay cambios, haz commit o `git stash` antes de seguir.

2. Mira qué ramas tienes y ubícate en la más reciente de la semana 4. **Es `week-4`** (con una sola "-" y el 4 sin cero), no `week-04`:

```bash
git branch -a
git switch week-4
git pull
git log --oneline -3
```

El primer commit del log debe llamarse `semana 4`.

3. Crea la rama de esta semana **a partir de `week-4`** (así hereda todo tu trabajo):

```bash
git switch -c week-05
git branch --show-current
```

Debe imprimir `week-05`.

4. Instala y revisa dónde estás parada:

```bash
pnpm install
pnpm exec tsc --noEmit
```

Si `pnpm typecheck` dice `Command "typecheck" not found`, es el hallazgo 1 y se arregla en el paso 1. Es normal ver el error de `PetCard` (hallazgo 2).

5. Revisa que tu **Expo Go** coincide con el SDK del proyecto. En tu `package.json` busca la línea `"expo":`; el número mayor (58 en tu zip) es el SDK. Expo Go del teléfono debe soportar ese SDK. Si no, la app no abrirá y no es un error de tu código.

> No cambies la versión de Expo para "arreglar" algo. Si necesitas instalar un paquete nativo, usa `pnpm exec expo install <paquete>`, que elige la versión compatible. Para Axios y TanStack Query basta `pnpm add` (son JavaScript puro).

## 6. Paso 1 — Limpiar la base
Qué haces: borrar tres archivos que sobran y agregar el script `typecheck`.

```bash
git rm src/components/PetCard.tsx src/types/navigation.ts package-lock.json
```

- `PetCard.tsx` es un resto de la semana 1 que ya no compila.
- `src/types/navigation.ts` es un duplicado que nadie importa (los tipos buenos están en `src/navigation/types.ts`).
- `package-lock.json` es el lockfile de npm; tú usas pnpm.

Ahora edita `package.json` y agrega el script `typecheck` dentro de `"scripts"`:

Archivo `package.json`:

```diff
@@ -5,8 +5,9 @@
   "scripts": {
     "start": "expo start",
     "android": "expo start --android",
     "ios": "expo start --ios",
+    "typecheck": "tsc --noEmit",
     "lint": "eslint . --ext .ts,.tsx"
   },
   "dependencies": {
     "@expo/vector-icons": "15.1.1",
```

Verifica y haz commit:

```bash
pnpm typecheck
git add -A
git commit -m "chore(week-05): remove broken leftovers and add typecheck script" -m "For: pnpm typecheck must run clean before any new commit" -m "Impact: PetCard, the unused navigation types and package-lock.json are gone"
```

`pnpm typecheck` no debe imprimir errores. Si imprime alguno, **no hagas el commit**: léelo y corrígelo.

## 7. Paso 2 — Husky y commitlint
Husky ejecuta comandos antes de cada commit; commitlint revisa que el mensaje siga Conventional Commits. Tu carpeta `.husky/` ya existe, pero los paquetes no estaban en `package.json`.

Primero comprueba si ya los tienes:

```bash
pnpm exec commitlint --version
git config core.hooksPath
```

Si el primero imprime una versión y el segundo imprime `.husky/_`, **ya está listo: salta al paso 3.** Si no:

```bash
pnpm add -D husky @commitlint/cli @commitlint/config-conventional
```

Gracias a `save-exact=true` en tu `.npmrc`, quedan con versión exacta. Ahora agrega el script `prepare` (así husky se activa solo en cada instalación):

Archivo `package.json`:

```diff
@@ -6,9 +6,10 @@
     "start": "expo start",
     "android": "expo start --android",
     "ios": "expo start --ios",
     "typecheck": "tsc --noEmit",
-    "lint": "eslint . --ext .ts,.tsx"
+    "lint": "eslint . --ext .ts,.tsx",
+    "prepare": "husky"
   },
   "dependencies": {
     "@expo/vector-icons": "15.1.1",
     "@react-native-async-storage/async-storage": "2.2.0",
@@ -28,8 +29,11 @@
     "zustand": "5.0.14"
   },
   "devDependencies": {
     "@babel/core": "7.29.7",
+    "@commitlint/cli": "21.2.4",
+    "@commitlint/config-conventional": "21.2.4",
     "@types/react": "19.3.0",
+    "husky": "9.1.7",
     "typescript": "6.0.3"
   }
 }
```

Actívalo y pruébalo:

```bash
pnpm install
git commit --allow-empty -m "bad message"
```

El segundo comando **debe fallar** con `type may not be empty`. Eso confirma que commitlint funciona. Ahora el commit real:

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore(config): add husky and commitlint dev dependencies" -m "For: enforce conventional commits and typecheck on every commit" -m "Impact: invalid messages and type errors are rejected locally"
```

**Reglas del mensaje de commit** (las revisa commitlint): `tipo(alcance): descripción en inglés`, de máximo 72 caracteres, sin punto final. Tipos: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `ci`, `perf`, `build`. Los textos `For:` e `Impact:` van como párrafos extra (cada `-m` es un párrafo).

## 8. Paso 3 — Revisar tu API en MockAPI y cargar las mascotas

### 8.1 Por qué MockAPI

Necesitas una API que **guarde** lo que creas. JSONPlaceholder acepta `POST` pero no guarda nada: la lista nunca cambiaría y no podrías demostrar la invalidación. [MockAPI](https://mockapi.io) crea gratis una API REST que sí guarda datos.

### 8.2 Confirma tu recurso `pets`

Tu proyecto de MockAPI ya existe: su dirección está en tu `.env`. Entra a mockapi.io, abre ese proyecto y confirma que tiene un recurso llamado exactamente `pets` (minúscula) con estos campos (el `id` lo agrega MockAPI solo):

| Campo | Tipo |
| --- | --- |
| `name` | texto (String) |
| `description` | texto |
| `breed` | texto |
| `age` | texto |
| `gender` | texto |
| `image` | texto |
| `listing` | texto |
| `price` | número (Number) |

Si el recurso se llama distinto o le faltan campos, créalo o corrígelo. Si te ofrece generar registros aleatorios, no los necesitas: cargaremos los nuestros con un script.

**Compruébalo en el navegador:** abre la URL de tu `.env` con `/pets` al final (por ejemplo `https://TU-ID.mockapi.io/api/v1/pets`). Debe verse JSON: una lista, aunque esté vacía (`[]`). Si dice "Not found", el recurso no se llama `pets`.

> Verifica los límites del plan gratis en mockapi.io. Una fuente externa consultada en junio de 2026 reportaba 1 proyecto y 2 recursos; solo necesitamos 1 recurso. Los nombres exactos de los botones pueden cambiar. No pude abrir MockAPI desde mi entorno, así que esta parte debes confirmarla tú.

### 8.3 Tu `.env` (ya lo tienes)

Tu commit "semana 4" ya creó `.env` y `.env.example`, así que **en este paso no hay commit**. Solo revisa:

- `.env` tiene **una sola línea**, sin comillas, sin espacios y **sin `/pets` al final**: `EXPO_PUBLIC_API_URL=https://TU-ID.mockapi.io/api/v1`
- `.env.example` tiene `EXPO_PUBLIC_API_URL=` (vacío).

> **Sobre `.env` en GitHub.** Está subido porque se agregó a la fuerza (tu `.gitignore` ignora `.env*`). Aquí solo contiene la URL de una API de práctica, no una clave, y los valores `EXPO_PUBLIC_` terminan dentro de la app de todos modos, así que lo dejé como está: así tu repo funciona apenas se clona. Si más adelante quieres sacarlo del repositorio: copia el archivo a otro lugar, ejecuta `git rm --cached .env`, haz commit y vuelve a crearlo. Ten en cuenta que al cambiar entre ramas donde está y no está, Git lo borra de tu carpeta. Y nunca pongas claves ahí.

### 8.4 Cargar las mascotas de ejemplo

Crea la carpeta `scripts` y dentro el archivo `seed.mjs` con este contenido (trae tus 13 mascotas de la semana 4, ahora con tipo adopción/venta y precio):

```js
// scripts/seed.mjs
// Carga mascotas de ejemplo en tu API de MockAPI.
//
// Uso (desde la raíz del proyecto):
//   node scripts/seed.mjs https://TU-ID.mockapi.io/api/v1
//
// Es seguro repetirlo: primero borra lo que haya en /pets y luego sube la lista.

const baseUrl = (process.argv[2] ?? process.env.EXPO_PUBLIC_API_URL ?? '').replace(/\/$/, '');

if (!baseUrl) {
  console.error('Falta la URL base. Ejemplo:');
  console.error('  node scripts/seed.mjs https://TU-ID.mockapi.io/api/v1');
  process.exit(1);
}

const PHOTO = 'https://images.unsplash.com/';

// [name, description, breed, age, gender, listing, price, image]
const ROWS = [
  ['Firulais', 'Un perrito tierno y muy amigable que busca un hogar lleno de amor.', 'Criollo', '2 años', 'Macho', 'adoption', 0, `${PHOTO}photo-1543466835-00a7907e9de1?w=400`],
  ['Luna', 'Gatita juguetona y tranquila, le encanta dormir en el sol.', 'Angora', '1 año', 'Hembra', 'adoption', 0, `${PHOTO}photo-1514888286974-6c03e2ca1dba?w=400`],
  ['Bugs', 'Conejo tierno y curioso, le encanta comer zanahorias frescas.', 'Cabeza de León', '8 meses', 'Macho', 'sale', 150000, `${PHOTO}photo-1585110396000-c9ffd4e4b308?w=400`],
  ['Remmy', 'Rata doméstica muy inteligente, limpia y sociable.', 'Fancy Rat', '6 meses', 'Macho', 'sale', 60000, `${PHOTO}photo-1425082661705-1834fbd49dca?w=400`],
  ['Rocky', 'Perrito enérgico ideal para salir a correr y pasear al parque.', 'Labrador', '3 años', 'Macho', 'adoption', 0, `${PHOTO}photo-1587300003388-59208cc962cb?w=400`],
  ['Mila', 'Perrita dulce y obediente, se lleva muy bien con los niños.', 'Beagle', '2 años', 'Hembra', 'adoption', 0, `${PHOTO}photo-1537151608828-ea2b11777ee8?w=400`],
  ['Simba', 'Gato aventurero y muy cariñoso con los humanos.', 'Tabby', '2 años', 'Macho', 'adoption', 0, `${PHOTO}photo-1519052537078-e6302a4968d4?w=400`],
  ['Nieve', 'Coneja blanca, suave y muy tranquila.', 'Nueva Zelanda', '1 año', 'Hembra', 'sale', 120000, `${PHOTO}photo-1535294021176-e4d51c7f2128?w=400`],
  ['Squeak', 'Ratita juguetona y muy activa por las tardes.', 'Dumbo', '5 meses', 'Hembra', 'sale', 50000, `${PHOTO}photo-1555685812-4b943f1cb0eb?w=400`],
  ['Max', 'Perro guardián pero de gran corazón y nobleza.', 'Pastor Alemán', '4 años', 'Macho', 'adoption', 0, `${PHOTO}photo-1589941013453-ec89f33b5e95?w=400`],
  ['Cleo', 'Gata elegante con ojos verdes impactantes.', 'Siamés', '3 años', 'Hembra', 'sale', 350000, `${PHOTO}photo-1513360371669-4adf3dd7dff8?w=400`],
  ['Copito', 'Conejo miniatura muy amigable y casero.', 'Mini Lop', '7 meses', 'Macho', 'sale', 130000, `${PHOTO}photo-1533738363-b7f9aef128ce?w=400`],
  ['Lola', 'Perrita rescatada que adora recibir caricias en la panza.', 'Poodle', '5 años', 'Hembra', 'adoption', 0, `${PHOTO}photo-1583511655857-d19b40a7a54e?w=400`],
];

const pets = ROWS.map(([name, description, breed, age, gender, listing, price, image]) => ({
  name,
  description,
  breed,
  age,
  gender,
  listing,
  price,
  image,
}));

async function request(path, options) {
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json' },
  });
  return response;
}

async function main() {
  console.log(`Usando ${baseUrl}/pets`);

  // 1. Borrar lo que exista (si la lista está vacía, MockAPI puede responder 404).
  const list = await request('/pets', { method: 'GET' });
  const existing = list.ok ? await list.json() : [];
  for (const pet of existing) {
    await request(`/pets/${pet.id}`, { method: 'DELETE' });
  }
  console.log(`Borrados: ${existing.length}`);

  // 2. Crear las mascotas de ejemplo, una por una.
  for (const pet of pets) {
    const response = await request('/pets', { method: 'POST', body: JSON.stringify(pet) });
    if (!response.ok) {
      console.error(`Error ${response.status} creando ${pet.name}`);
      process.exit(1);
    }
    console.log(`Creada: ${pet.name}`);
  }
  console.log(`Listo: ${pets.length} mascotas.`);
}

main().catch((error) => {
  console.error('No se pudo conectar:', error.message);
  process.exit(1);
});
```

Ejecútalo con **tu** URL base (la de tu `.env`):

```bash
node scripts/seed.mjs https://TU-ID.mockapi.io/api/v1
```

Verás `Creada: Firulais`, `Creada: Luna`… hasta `Listo: 13 mascotas.` Puedes repetirlo cuando quieras: primero borra lo que haya y luego sube las 13 (útil después de probar la demo).

**Compruébalo:** abre en el navegador la URL de tu API con `/pets` al final. Debe verse una lista JSON con 13 mascotas.

```bash
git add scripts/seed.mjs
git commit -m "chore(api): add seed script for the pets resource" -m "For: fill MockAPI with realistic pets instead of random fake data" -m "Impact: node scripts/seed.mjs resets /pets to 13 sample pets"
```

## 9. Paso 4 — Dejar las dependencias con versión exacta

Axios y TanStack Query ya los instalaste en tu commit "semana 4": no hay que volver a instalarlos. Pero `@tanstack/react-query` quedó con `^` y la regla del proyecto es versión exacta (hallazgo 11).

1. Abre `package.json` y cambia esta línea:

```diff
-    "@tanstack/react-query": "^5.108.0",
+    "@tanstack/react-query": "5.108.0",
```

2. Actualiza el lockfile y comprueba:

```bash
pnpm install
git diff --stat
```

`git diff --stat` debe mostrar solo `package.json` y `pnpm-lock.yaml`, con 1 línea cambiada cada uno.

3. Commit:

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore(deps): pin tanstack react-query to an exact version" -m "For: the project keeps exact dependency versions, no ^ or ~" -m "Impact: react-query stays at 5.108.0 and the lockfile matches package.json"
```

Corrí `pnpm audit --prod` con Axios 1.21.1 (la tuya) y TanStack Query 5.107.1 (una versión menor anterior a la tuya): no reportó nada en ninguno de los dos. Solo marcó dos avisos moderados dentro de las herramientas de Expo (`glob` y `minimatch`, de `@expo/cli`), que no dependen de ti.

## 10. Paso 5 — El cliente Axios
Crea la carpeta `src/services/` y dentro el archivo `api.ts`. Es **el único lugar** que sabe a qué servidor hablar.

```ts
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
```

Qué hace cada parte:

- `process.env.EXPO_PUBLIC_API_URL` lee la URL de tu `.env`.
- `axios.create({...})` fabrica el cliente con `baseURL`, `timeout` (10 s) y cabeceras JSON.
- El interceptor `apiClient.interceptors.response.use` mira cada respuesta; si falla, escribe en la terminal qué estado devolvió el servidor.
- `getErrorMessage` traduce un error técnico (`Network Error`, `Request failed with status code 404`) a un texto entendible para el usuario.

```bash
pnpm typecheck
git add src/services/api.ts
git commit -m "feat(api): add axios instance with base url and error helper" -m "For: a single client for every request, configured from EXPO_PUBLIC_API_URL" -m "Impact: hooks can call apiClient and show readable error messages"
```

## 11. Paso 6 — `QueryClientProvider` en `App.tsx`
`QueryClientProvider` le da a **toda** la app acceso a la caché. Reemplaza el contenido de `App.tsx`:

```tsx
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
```

Puntos clave:

- `new QueryClient(...)` va **fuera** del componente. Si estuviera dentro, se crearía uno nuevo en cada render y la caché se borraría.
- `staleTime: 2 minutos`: durante ese tiempo no se vuelve a pedir lo que ya está en caché.
- `retry: 2`: si una petición falla, reintenta 2 veces antes de mostrar el error. Por eso, con la URL mal puesta, el error aparece unos 3 segundos después: es lo normal.
- `QueryClientProvider` va por fuera de `NavigationContainer`.

```bash
pnpm typecheck
git add App.tsx
git commit -m "feat(app): wrap the app in QueryClientProvider" -m "For: TanStack Query needs a QueryClient at the root to cache server data" -m "Impact: any screen can now use useQuery and useMutation"
```

## 12. Paso 7 — Estados de red y lista con `useQuery`
Toda pantalla que lee de la red tiene tres estados además del "todo bien": **cargando**, **error** y **vacío**. Para no repetir código en cada pantalla, creamos tres componentes pequeños. Créalos en `src/components/`.

`src/components/LoadingView.tsx`:

```tsx
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
```

`src/components/ErrorView.tsx` (con botón **Reintentar**):

```tsx
// src/components/ErrorView.tsx
// Pantalla de error reutilizable con botón "Reintentar".

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../theme';

interface ErrorViewProps {
  message: string;
  onRetry: () => void;
}

export function ErrorView({ message, onRetry }: ErrorViewProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>No se pudo cargar</Text>
      <Text style={styles.message}>{message}</Text>
      <Pressable
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        onPress={() => onRetry()}
        testID="retry-button"
      >
        <Text style={styles.buttonText}>Reintentar</Text>
      </Pressable>
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
  title: {
    ...TYPOGRAPHY.h3,
    color: COLORS.error,
  },
  message: {
    ...TYPOGRAPHY.caption,
    textAlign: 'center',
  },
  button: {
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
  },
  buttonPressed: {
    opacity: 0.7,
  },
  buttonText: {
    ...TYPOGRAPHY.body,
    color: COLORS.background,
    fontWeight: '600',
  },
});
```

`src/components/EmptyView.tsx`:

```tsx
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
```

Fíjate en `onPress={() => onRetry()}` en `ErrorView`: si pasaras `onRetry` directo a `onPress`, React Native le enviaría el evento del toque como argumento a `refetch`, y no queremos eso.

```bash
pnpm typecheck
git add src/components
git commit -m "feat(ui): add loading, error and empty state views" -m "For: every screen that reads from the network needs the same three states" -m "Impact: LoadingView, ErrorView with retry and EmptyView are reusable"
```

### El hook `useItems`

Crea la carpeta `src/hooks/` y el archivo `useItems.ts`. Las pantallas usan este hook; **nunca** llaman a Axios directamente.

```ts
// src/hooks/useItems.ts
// Hooks que leen datos del servidor. Las pantallas usan estos hooks,
// nunca llaman a apiClient directamente.

import { useQuery } from '@tanstack/react-query';

import { apiClient } from '../services/api';
import type { Item } from '../types';

// "Etiqueta" de la caché. Todo lo que se guarde bajo ['pets'] se invalida junto.
// Está en un solo lugar para no cometer errores de escritura al invalidar.
export const ITEMS_QUERY_KEY = ['pets'] as const;

// Lista de mascotas: GET {baseURL}/pets
export function useItems() {
  return useQuery({
    queryKey: ITEMS_QUERY_KEY,
    queryFn: async (): Promise<Item[]> => {
      const { data } = await apiClient.get<Item[]>('/pets');
      return data;
    },
  });
}
```

- `ITEMS_QUERY_KEY = ['pets']` es el nombre semántico con el que se archiva la lista. Está exportado para que `useCreateItem` pueda invalidarlo sin escribir el texto otra vez (así no hay errores de dedo).
- `queryFn` hace `GET /pets` y devuelve el arreglo. TypeScript infiere que `data` es `Item[] | undefined`.

### `HomeScreen` conectada a la API

Abre `src/screens/HomeScreen.tsx`. El componente `ItemCard` y los `styles` se quedan igual; cambian los imports, el inicio de la función y las props del `FlatList`:

Archivo `src/screens/HomeScreen.tsx`:

```diff
@@ -10,9 +10,13 @@ import {
   type ListRenderItem,
 } from 'react-native';
 import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
 import { useNavigation } from '@react-navigation/native';
-import { ITEMS } from '../data/mockData';
+import { EmptyView } from '../components/EmptyView';
+import { ErrorView } from '../components/ErrorView';
+import { LoadingView } from '../components/LoadingView';
+import { useItems } from '../hooks/useItems';
+import { getErrorMessage } from '../services/api';
 import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../theme';
 import type { Item } from '../types';
 import type { HomeStackParamList } from '../navigation/types';
 
@@ -45,9 +49,22 @@ function ItemCard({ item, onPress }: ItemCardProps): React.JSX.Element {
 }
 
 export function HomeScreen(): React.JSX.Element {
   const navigation = useNavigation<HomeScreenNavProp>();
-  const items = ITEMS;
+  const { data, isLoading, isError, error, isFetching, refetch } = useItems();
+
+  // 1) Primera carga: todavía no hay nada que mostrar.
+  if (isLoading) {
+    return <LoadingView message="Buscando mascotas..." />;
+  }
+
+  // 2) Falló la petición: mensaje claro + botón para volver a intentar.
+  if (isError) {
+    return <ErrorView message={getErrorMessage(error)} onRetry={refetch} />;
+  }
+
+  // 3) Éxito. `data` puede ser undefined para TypeScript, por eso el `?? []`.
+  const items = data ?? [];
 
   const renderItem: ListRenderItem<Item> = ({ item }) => (
     <ItemCard
       item={item}
@@ -64,8 +81,16 @@ export function HomeScreen(): React.JSX.Element {
         keyExtractor={(item) => item.id}
         renderItem={renderItem}
         contentContainerStyle={styles.list}
         ItemSeparatorComponent={() => <View style={styles.separator} />}
+        refreshing={isFetching}
+        onRefresh={refetch}
+        ListEmptyComponent={
+          <EmptyView
+            title="Aún no hay mascotas"
+            subtitle="Toca el + de arriba para registrar la primera."
+          />
+        }
         ListHeaderComponent={
           <Text style={styles.sectionLabel}>
             {items.length} Mascotas disponibles en el refugio
           </Text>
```

Cómo funciona:

- Los hooks (`useNavigation`, `useItems`) van **siempre arriba**, antes de cualquier `return`. Es una regla de React.
- `isLoading` es `true` solo en la **primera carga** (todavía no hay datos): mostramos `LoadingView`.
- `isError` es `true` si la petición falló después de los reintentos: mostramos `ErrorView` con el mensaje de `getErrorMessage` y el botón que llama a `refetch`.
- `data ?? []`: `data` puede ser `undefined` para TypeScript; así garantizamos un arreglo.
- `refreshing={isFetching}` + `onRefresh={refetch}` = **pull-to-refresh**: al arrastrar la lista hacia abajo se vuelve a pedir y gira el indicador mientras `isFetching` sea `true`.
- `ListEmptyComponent` se muestra solo cuando el arreglo viene vacío.
- La pantalla de detalle todavía usa `mockData`, por eso ese archivo se borra más adelante (paso 9).

```bash
pnpm typecheck
git add src/hooks src/screens/HomeScreen.tsx
git commit -m "feat(pets): list pets from the api with useQuery" -m "For: replace the local mock list with real server data and its states" -m "Impact: HomeScreen shows loading, error with retry, empty and pull-to-refresh"
```

**Pruébalo ahora** (primera vez con la API):

```bash
pnpm exec expo start -c
```

El `-c` limpia la caché de Metro: es necesario cada vez que cambias `.env`. Escanea el QR con Expo Go. Debes ver un spinner un instante y luego las 13 mascotas. Arrastra la lista hacia abajo y verás el indicador de refresco.

## 13. Paso 8 — Crear una mascota con `useMutation`
### El tipo del formulario y el hook

Un `POST` envía todo **menos el `id`** (lo asigna el servidor). Agrega al final de `src/types/index.ts`:

Archivo `src/types/index.ts`:

```diff
@@ -5,5 +5,8 @@ export interface Item {
   breed: string;
   age: string;
   gender: string;
   image: string;
-}
\ No newline at end of file
+}
+// Lo que se envía en el POST para crear una mascota: todo menos el `id`,
+// porque el id lo asigna el servidor.
+export type CreateItemPayload = Omit<Item, 'id'>;
```

Crea `src/hooks/useCreateItem.ts`:

```ts
// src/hooks/useCreateItem.ts
// Hook que ESCRIBE datos en el servidor (crear una mascota).

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { apiClient } from '../services/api';
import type { CreateItemPayload, Item } from '../types';
import { ITEMS_QUERY_KEY } from './useItems';

export function useCreateItem() {
  const queryClient = useQueryClient();

  return useMutation({
    // Qué petición hacer: POST {baseURL}/pets con los datos del formulario.
    mutationFn: async (payload: CreateItemPayload): Promise<Item> => {
      const { data } = await apiClient.post<Item>('/pets', payload);
      return data;
    },
    // Cuando el servidor responde OK: marcar la lista como "vieja" (invalidar).
    // TanStack Query la vuelve a pedir sola y la pantalla se actualiza.
    // El `return` hace que isPending siga en true hasta que la lista termine de recargar.
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ITEMS_QUERY_KEY }),
  });
}
```

- `mutationFn` hace `POST /pets` con los datos del formulario.
- `onSuccess` invalida `['pets']`: TanStack Query marca la lista como vieja y la vuelve a pedir. Esa es toda la "magia" de que la lista se actualice sola.
- El `return` de `invalidateQueries` mantiene `isPending` en `true` hasta que la lista termina de recargar, así el botón no se habilita antes de tiempo.

```bash
pnpm typecheck
git add src/types/index.ts src/hooks/useCreateItem.ts
git commit -m "feat(pets): add useCreateItem mutation with cache invalidation" -m "For: creating a pet must refresh the list without reloading the app" -m "Impact: onSuccess invalidates the pets query so the list refetches"
```

### La pantalla del formulario

Crea `src/screens/CreateScreen.tsx`:

```tsx
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

type CreateScreenNavProp = NativeStackNavigationProp<HomeStackParamList, 'Create'>;

type Gender = 'Macho' | 'Hembra';
const GENDERS: Gender[] = ['Macho', 'Hembra'];

export function CreateScreen(): React.JSX.Element {
  const navigation = useNavigation<CreateScreenNavProp>();
  const { mutate: createItem, isPending } = useCreateItem();

  const [name, setName] = useState('');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<Gender>('Macho');
  const [description, setDescription] = useState('');

  // El botón solo se activa con nombre y mientras NO se esté enviando.
  const canSubmit = name.trim().length > 0 && !isPending;

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
```

Lo importante:

- `const { mutate: createItem, isPending } = useCreateItem();` te da la función para enviar y la bandera `isPending`.
- `canSubmit` deshabilita el botón si el nombre está vacío **o** si ya se está enviando (rúbrica: "botón deshabilitado mientras `isPending === true`").
- `createItem(datos, { onSuccess, onError })`: el `onSuccess` de aquí corre **después** del `onSuccess` del hook, es decir, cuando la lista ya se refrescó. Por eso al volver ya ves la mascota nueva.
- `onError` muestra una alerta con el motivo (extra del bootcamp).
- La foto es temporal (`picsum.photos`); en la semana 11 se cambia por la cámara.

### La ruta y el botón `+`

Agrega la pantalla a los tipos de navegación y al `RootNavigator`:

Archivo `src/navigation/types.ts`:

```diff
@@ -8,5 +8,6 @@ export type HomeStackParamList = {
   HomeDetail: {
     id: string;
     name: string;
   };
+  Create: undefined;
 };
\ No newline at end of file
```

Archivo `src/navigation/RootNavigator.tsx`:

```diff
@@ -2,8 +2,10 @@
 import React from 'react';
 import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
 import { createNativeStackNavigator } from '@react-navigation/native-stack';
 import { Ionicons } from '@expo/vector-icons';
+import { Pressable, StyleSheet, Text } from 'react-native';
+import { CreateScreen } from '../screens/CreateScreen';
 import { DetailScreen } from '../screens/DetailScreen';
 import { HomeScreen } from '../screens/HomeScreen';
 import { SavedScreen } from '../screens/SavedScreen';
 import { COLORS } from '../theme';
@@ -23,15 +25,31 @@ function HomeStackNavigator(): React.JSX.Element {
     >
       <HomeStack.Screen
         name="HomeList"
         component={HomeScreen}
-        options={{ title: 'Refugio' }}
+        options={({ navigation }) => ({
+          title: 'Refugio',
+          headerRight: () => (
+            <Pressable
+              onPress={() => navigation.navigate('Create')}
+              accessibilityLabel="Agregar mascota"
+              testID="add-button"
+            >
+              <Text style={styles.headerButton}>+</Text>
+            </Pressable>
+          ),
+        })}
       />
       <HomeStack.Screen
         name="HomeDetail"
         component={DetailScreen}
         options={({ route }) => ({ title: route.params.name })}
       />
+      <HomeStack.Screen
+        name="Create"
+        component={CreateScreen}
+        options={{ title: 'Nueva mascota', presentation: 'modal' }}
+      />
     </HomeStack.Navigator>
   );
 }
 
@@ -72,5 +90,14 @@ export function RootNavigator(): React.JSX.Element {
         }}
       />
     </Tab.Navigator>
   );
-}
\ No newline at end of file
+}
+
+const styles = StyleSheet.create({
+  headerButton: {
+    color: COLORS.accent,
+    fontSize: 28,
+    fontWeight: '300',
+    paddingHorizontal: 8,
+  },
+});
```

```bash
pnpm typecheck
git add src/screens/CreateScreen.tsx src/navigation
git commit -m "feat(pets): add create pet screen and header add button" -m "For: let the user register a pet through a form that posts to the api" -m "Impact: submit button is disabled while pending and goes back on success"
```

**Pruébalo:** toca el `+` de la esquina superior, escribe un nombre, guarda. El botón se bloquea un momento, la pantalla se cierra y la mascota aparece en la lista **sin recargar a mano**. Confírmalo también en el panel de MockAPI (el registro nuevo está ahí).

## 14. Paso 9 — Detalle con `useItemById` y adiós a `mockData`
El detalle ahora pide **su** mascota al servidor, con su propio estado de carga y error. Agrega el hook al final de `src/hooks/useItems.ts` y actualiza `DetailScreen`:

Archivo `src/hooks/useItems.ts`:

```diff
@@ -20,4 +20,17 @@ export function useItems() {
       return data;
     },
   });
 }
+
+// Una sola mascota por id: GET {baseURL}/pets/:id
+// La queryKey incluye el id, así cada mascota tiene su propia entrada en la caché.
+export function useItemById(id: string) {
+  return useQuery({
+    queryKey: [...ITEMS_QUERY_KEY, id],
+    queryFn: async (): Promise<Item> => {
+      const { data } = await apiClient.get<Item>(`/pets/${id}`);
+      return data;
+    },
+    enabled: id.length > 0,
+  });
+}
```

Archivo `src/screens/DetailScreen.tsx`:

```diff
@@ -4,18 +4,21 @@ import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-nati
 import { useRoute, type RouteProp } from '@react-navigation/native';
 import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../theme';
 import type { HomeStackParamList } from '../navigation/types';
 import { useSavedStore } from '../stores/savedStore';
-import { ITEMS } from '../data/mockData';
-import type { Item } from '../types';
+import { ErrorView } from '../components/ErrorView';
+import { LoadingView } from '../components/LoadingView';
+import { useItemById } from '../hooks/useItems';
+import { getErrorMessage } from '../services/api';
 
 type DetailRouteProp = RouteProp<HomeStackParamList, 'HomeDetail'>;
 
 export function DetailScreen(): React.JSX.Element {
   const route = useRoute<DetailRouteProp>();
   const { id } = route.params;
 
-  const item: Item | undefined = ITEMS.find((i) => i.id === id);
+  // Datos frescos del servidor para esta mascota (con su propio loading/error).
+  const { data: item, isLoading, isError, error, refetch } = useItemById(id);
 
   const isItemSaved = useSavedStore((state) => state.isItemSaved);
   const addItem = useSavedStore((state) => state.addItem);
   const removeItem = useSavedStore((state) => state.removeItem);
@@ -29,8 +32,16 @@ export function DetailScreen(): React.JSX.Element {
       addItem(item);
     }
   };
 
+  if (isLoading) {
+    return <LoadingView message="Cargando detalle..." />;
+  }
+
+  if (isError) {
+    return <ErrorView message={getErrorMessage(error)} onRetry={refetch} />;
+  }
+
   if (!item) {
     return (
       <View style={styles.container}>
         <Text style={styles.title}>Mascota no encontrada</Text>
```

- La `queryKey` es `['pets', id]`: cada mascota tiene su propia entrada en la caché. Como empieza con `'pets'`, cuando invalidas `['pets']` también se refrescan los detalles.
- `enabled: id.length > 0` evita pedir si por error llega un id vacío.

```bash
pnpm typecheck
git add src/hooks/useItems.ts src/screens/DetailScreen.tsx
git commit -m "feat(pets): load pet detail from the api with useItemById" -m "For: the detail screen must show fresh server data, not a local list" -m "Impact: detail has its own loading, error with retry and cache entry per id"
```

Ya nadie importa la lista local. Bórrala:

```bash
git rm src/data/mockData.ts
pnpm typecheck
git commit -m "refactor(pets): remove local mock data" -m "For: all pet data now comes from the api" -m "Impact: src/data/mockData.ts is deleted; seed script keeps the sample pets"
```

Si `pnpm typecheck` marca que algún archivo todavía importa `mockData`, ese archivo se te quedó sin migrar: vuelve al paso anterior.

## 15. Paso 10 — Favoritos: Zustand solo guarda ids
Este paso evita la penalización de **−10** ("estado del servidor guardado en Zustand"). En la semana 4 guardabas el objeto completo de cada mascota. Ahora que las mascotas viven en la caché de TanStack Query, copiarlas a Zustand las dejaría desactualizadas (si cambian en el servidor, tu copia seguiría vieja). Solución: guardar solo los **ids** y buscar los datos en la caché.

Reemplaza todo `src/stores/savedStore.ts`:

```ts
// src/stores/savedStore.ts
// Favoritos. REGLA DE LA SEMANA: aquí solo se guardan los IDs.
// Los datos de las mascotas viven en la caché de TanStack Query, no en Zustand.
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SavedStore {
  savedIds: string[];
  toggleSaved: (id: string) => void;
  removeSaved: (id: string) => void;
  clearAll: () => void;
}

// Forma que tenía lo guardado en la semana 4 (mascotas completas).
interface LegacySavedState {
  items?: { id: string }[];
}

export const useSavedStore = create<SavedStore>()(
  persist(
    (set) => ({
      savedIds: [],
      toggleSaved: (id) => {
        set((state) => ({
          savedIds: state.savedIds.includes(id)
            ? state.savedIds.filter((savedId) => savedId !== id)
            : [...state.savedIds, id],
        }));
      },
      removeSaved: (id) => {
        set((state) => ({ savedIds: state.savedIds.filter((savedId) => savedId !== id) }));
      },
      clearAll: () => set({ savedIds: [] }),
    }),
    {
      name: 'pets-saved-storage',
      // version 1: cambió la forma de lo guardado (de `items` a `savedIds`).
      version: 1,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ savedIds: state.savedIds }),
      // Si el teléfono tiene datos de la semana 4, los convertimos a ids.
      migrate: (persisted) => {
        const legacy = persisted as LegacySavedState | null;
        return { savedIds: (legacy?.items ?? []).map((item) => item.id) };
      },
    },
  ),
);
```

- `savedIds: string[]` reemplaza a `items: Item[]`.
- `version: 1` + `migrate`: si el teléfono ya tiene favoritos guardados de la semana 4 (formato viejo), se convierten a ids en vez de perderse. Lo probé con datos viejos, datos nuevos y sin datos.
- `toggleSaved` agrega o quita: con una sola función reemplaza a `addItem` y `removeItem`.

Ahora actualiza las tres pantallas que usaban el store:

`SavedScreen` (Favoritos) toma las mascotas de la **misma query** que la lista (no hace otra petición: sale de la caché) y filtra por los ids favoritos:

Archivo `src/screens/SavedScreen.tsx`:

```diff
@@ -11,8 +11,12 @@ import {
 } from 'react-native';
 import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../theme';
 import type { Item } from '../types';
 import { useSavedStore } from '../stores/savedStore';
+import { ErrorView } from '../components/ErrorView';
+import { LoadingView } from '../components/LoadingView';
+import { useItems } from '../hooks/useItems';
+import { getErrorMessage } from '../services/api';
 
 interface SavedItemProps {
   item: Item;
   onRemove: () => void;
@@ -41,14 +45,27 @@ function SavedItem({ item, onRemove }: SavedItemProps): React.JSX.Element {
   );
 }
 
 export function SavedScreen(): React.JSX.Element {
-  const items = useSavedStore((state) => state.items);
-  const removeItem = useSavedStore((state) => state.removeItem);
+  // Los datos vienen de la caché de TanStack Query (misma query que la lista).
+  const { data, isLoading, isError, error, isFetching, refetch } = useItems();
+  // Zustand solo aporta los ids marcados como favoritos.
+  const savedIds = useSavedStore((state) => state.savedIds);
+  const removeSaved = useSavedStore((state) => state.removeSaved);
   const clearAll = useSavedStore((state) => state.clearAll);
 
+  if (isLoading) {
+    return <LoadingView message="Cargando favoritos..." />;
+  }
+
+  if (isError) {
+    return <ErrorView message={getErrorMessage(error)} onRetry={refetch} />;
+  }
+
+  const items = (data ?? []).filter((item) => savedIds.includes(item.id));
+
   const renderItem: ListRenderItem<Item> = ({ item }) => (
-    <SavedItem item={item} onRemove={() => removeItem(item.id)} />
+    <SavedItem item={item} onRemove={() => removeSaved(item.id)} />
   );
 
   return (
     <View style={styles.container}>
@@ -57,8 +74,10 @@ export function SavedScreen(): React.JSX.Element {
         keyExtractor={(item) => item.id}
         renderItem={renderItem}
         contentContainerStyle={styles.list}
         ItemSeparatorComponent={() => <View style={styles.separator} />}
+        refreshing={isFetching}
+        onRefresh={refetch}
         ListHeaderComponent={() => 
           items.length > 0 ? (
             <View style={styles.header}>
               <Text style={styles.sectionLabel}>
```

`DetailScreen`: el botón ahora se actualiza al instante (hallazgo 7: seleccionamos un dato en lugar de una función):

Archivo `src/screens/DetailScreen.tsx`:

```diff
@@ -18,20 +18,15 @@ export function DetailScreen(): React.JSX.Element {
 
   // Datos frescos del servidor para esta mascota (con su propio loading/error).
   const { data: item, isLoading, isError, error, refetch } = useItemById(id);
 
-  const isItemSaved = useSavedStore((state) => state.isItemSaved);
-  const addItem = useSavedStore((state) => state.addItem);
-  const removeItem = useSavedStore((state) => state.removeItem);
-
-  const isSaved = isItemSaved(id);
+  // Se selecciona un DATO (true/false), no una función: así el botón se
+  // actualiza al instante cuando cambian los favoritos.
+  const isSaved = useSavedStore((state) => state.savedIds.includes(id));
+  const toggleSaved = useSavedStore((state) => state.toggleSaved);
 
   const handleToggleSave = (): void => {
-    if (isSaved) {
-      removeItem(id);
-    } else if (item) {
-      addItem(item);
-    }
+    toggleSaved(id);
   };
 
   if (isLoading) {
     return <LoadingView message="Cargando detalle..." />;
```

`RootNavigator`: el contador del tab Favoritos usa `savedIds`:

Archivo `src/navigation/RootNavigator.tsx`:

```diff
@@ -55,9 +55,9 @@ function HomeStackNavigator(): React.JSX.Element {
 
 const Tab = createBottomTabNavigator<RootTabParamList>();
 
 export function RootNavigator(): React.JSX.Element {
-  const savedCount = useSavedStore((state) => state.items.length);
+  const savedCount = useSavedStore((state) => state.savedIds.length);
 
   return (
     <Tab.Navigator
       screenOptions={({ route }) => ({
```

```bash
pnpm typecheck
git add -A
git commit -m "refactor(store): keep only pet ids in zustand favorites" -m "For: server data must live in TanStack Query, not in Zustand (week-05 rule)" -m "Impact: favorites persist ids, migrate old data, and read pets from the query cache"
```

**Pruébalo:** abre una mascota, toca el corazón (el texto del botón cambia al instante), mira que el tab Favoritos muestra el número y que la mascota aparece ahí. Cierra y abre la app: los favoritos siguen.

## 16. Paso 11 — Los campos de tu dominio: adopción o venta y precio
Tu dominio es **tienda de mascotas y adopción**, así que cada mascota se entrega en adopción (gratis) o se vende (con precio). Esto corresponde al extra "campos adicionales de tu dominio".

> Antes de este paso, vuelve a ejecutar el seed (`node scripts/seed.mjs https://TU-ID.mockapi.io/api/v1`). Las mascotas que creaste probando en el paso 8 **no tienen** `listing` ni `price`; el seed las borra y deja las 13 completas.

Crea `src/utils/format.ts` (funciones para mostrar el precio, por ejemplo `$150.000`):

```ts
// src/utils/format.ts
// Funciones pequeñas para mostrar datos del dominio.

import type { Item } from '../types';

// 150000 -> "$150.000"
export function formatPrice(price: number): string {
  return `$${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
}

// "Adopción · Gratis" o "Venta · $150.000"
export function formatListing(item: Pick<Item, 'listing' | 'price'>): string {
  return item.listing === 'sale' ? `Venta · ${formatPrice(item.price)}` : 'Adopción · Gratis';
}
```

Actualiza el tipo `Item`:

Archivo `src/types/index.ts`:

```diff
@@ -1,12 +1,17 @@
+// 'adoption' = se entrega en adopción (gratis). 'sale' = se vende en la tienda.
+export type Listing = 'adoption' | 'sale';
+
 export interface Item {
   id: string;
   name: string;
   description: string;
   breed: string;
   age: string;
   gender: string;
   image: string;
+  listing: Listing;
+  price: number;
 }
 // Lo que se envía en el POST para crear una mascota: todo menos el `id`,
 // porque el id lo asigna el servidor.
 export type CreateItemPayload = Omit<Item, 'id'>;
```

Muestra el tipo y el precio en las tarjetas (`HomeScreen`), en el detalle y agrega los campos al formulario:

Archivo `src/screens/HomeScreen.tsx`:

```diff
@@ -14,8 +14,9 @@ import { useNavigation } from '@react-navigation/native';
 import { EmptyView } from '../components/EmptyView';
 import { ErrorView } from '../components/ErrorView';
 import { LoadingView } from '../components/LoadingView';
 import { useItems } from '../hooks/useItems';
+import { formatListing } from '../utils/format';
 import { getErrorMessage } from '../services/api';
 import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../theme';
 import type { Item } from '../types';
 import type { HomeStackParamList } from '../navigation/types';
@@ -41,8 +42,11 @@ function ItemCard({ item, onPress }: ItemCardProps): React.JSX.Element {
         </Text>
         <Text style={styles.cardDescription} numberOfLines={2}>
           {item.description}
         </Text>
+        <Text style={[styles.cardBadge, item.listing === 'sale' && styles.cardBadgeSale]}>
+          {formatListing(item)}
+        </Text>
       </View>
       <Text style={styles.chevron}>›</Text>
     </Pressable>
   );
@@ -91,9 +95,9 @@ export function HomeScreen(): React.JSX.Element {
           />
         }
         ListHeaderComponent={
           <Text style={styles.sectionLabel}>
-            {items.length} Mascotas disponibles en el refugio
+            {items.length} mascotas en adopción y venta
           </Text>
         }
       />
     </View>
@@ -147,8 +151,15 @@ const styles = StyleSheet.create({
   },
   cardDescription: {
     ...TYPOGRAPHY.caption,
   },
+  cardBadge: {
+    ...TYPOGRAPHY.label,
+    color: COLORS.success,
+  },
+  cardBadgeSale: {
+    color: COLORS.warning,
+  },
   chevron: {
     ...TYPOGRAPHY.h2,
     color: COLORS.textMuted,
   },
```

Archivo `src/screens/DetailScreen.tsx`:

```diff
@@ -8,8 +8,9 @@ import { useSavedStore } from '../stores/savedStore';
 import { ErrorView } from '../components/ErrorView';
 import { LoadingView } from '../components/LoadingView';
 import { useItemById } from '../hooks/useItems';
 import { getErrorMessage } from '../services/api';
+import { formatListing } from '../utils/format';
 
 type DetailRouteProp = RouteProp<HomeStackParamList, 'HomeDetail'>;
 
 export function DetailScreen(): React.JSX.Element {
@@ -56,8 +57,9 @@ export function DetailScreen(): React.JSX.Element {
         <View style={styles.badgeContainer}>
           <Text style={styles.badge}>Raza: {item.breed}</Text>
           <Text style={styles.badge}>Edad: {item.age}</Text>
           <Text style={styles.badge}>Género: {item.gender}</Text>
+          <Text style={styles.badge}>{formatListing(item)}</Text>
         </View>
       </View>
 
       <Pressable
```

Archivo `src/screens/CreateScreen.tsx`:

```diff
@@ -20,14 +20,20 @@ import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
 import { useCreateItem } from '../hooks/useCreateItem';
 import { getErrorMessage } from '../services/api';
 import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../theme';
 import type { HomeStackParamList } from '../navigation/types';
+import type { Listing } from '../types';
 
 type CreateScreenNavProp = NativeStackNavigationProp<HomeStackParamList, 'Create'>;
 
 type Gender = 'Macho' | 'Hembra';
 const GENDERS: Gender[] = ['Macho', 'Hembra'];
 
+const LISTINGS: { value: Listing; label: string }[] = [
+  { value: 'adoption', label: 'Adopción' },
+  { value: 'sale', label: 'Venta' },
+];
+
 export function CreateScreen(): React.JSX.Element {
   const navigation = useNavigation<CreateScreenNavProp>();
   const { mutate: createItem, isPending } = useCreateItem();
 
@@ -35,11 +41,17 @@ export function CreateScreen(): React.JSX.Element {
   const [breed, setBreed] = useState('');
   const [age, setAge] = useState('');
   const [gender, setGender] = useState<Gender>('Macho');
   const [description, setDescription] = useState('');
+  const [listing, setListing] = useState<Listing>('adoption');
+  const [price, setPrice] = useState('');
+
+  // "150.000" o "150000" -> 150000 (se quitan todos los caracteres que no sean dígitos)
+  const priceNumber = Number(price.replace(/\D/g, ''));
 
-  // El botón solo se activa con nombre y mientras NO se esté enviando.
-  const canSubmit = name.trim().length > 0 && !isPending;
+  // El botón solo se activa con nombre, precio válido si es venta, y sin estar enviando.
+  const canSubmit =
+    name.trim().length > 0 && (listing === 'adoption' || priceNumber > 0) && !isPending;
 
   function handleSubmit(): void {
     if (!canSubmit) return;
     const cleanName = name.trim();
@@ -50,8 +62,10 @@ export function CreateScreen(): React.JSX.Element {
         breed: breed.trim() || 'Mestizo',
         age: age.trim() || 'Sin dato',
         gender,
         description: description.trim() || 'Sin descripción por ahora.',
+        listing,
+        price: listing === 'sale' ? priceNumber : 0,
         // Foto temporal. En la semana 11 se reemplaza por la cámara/galería.
         image: `https://picsum.photos/seed/${encodeURIComponent(cleanName)}/400/300`,
       },
       {
@@ -126,8 +140,43 @@ export function CreateScreen(): React.JSX.Element {
             ))}
           </View>
         </View>
 
+        <View style={styles.field}>
+          <Text style={styles.fieldLabel}>Tipo</Text>
+          <View style={styles.chipRow}>
+            {LISTINGS.map((option) => (
+              <Pressable
+                key={option.value}
+                style={[styles.chip, listing === option.value && styles.chipActive]}
+                onPress={() => setListing(option.value)}
+              >
+                <Text
+                  style={[styles.chipText, listing === option.value && styles.chipTextActive]}
+                >
+                  {option.label}
+                </Text>
+              </Pressable>
+            ))}
+          </View>
+        </View>
+
+        {listing === 'sale' && (
+          <View style={styles.field}>
+            <Text style={styles.fieldLabel}>
+              Precio (COP) <Text style={styles.required}>*</Text>
+            </Text>
+            <TextInput
+              style={styles.input}
+              value={price}
+              onChangeText={setPrice}
+              placeholder="Ej: 150000"
+              placeholderTextColor={COLORS.textMuted}
+              keyboardType="numeric"
+            />
+          </View>
+        )}
+
         <View style={styles.field}>
           <Text style={styles.fieldLabel}>Descripción</Text>
           <TextInput
             style={[styles.input, styles.multiline]}
```

Y el título del header, que ya no es solo un "refugio":

Archivo `src/navigation/RootNavigator.tsx`:

```diff
@@ -26,9 +26,9 @@ function HomeStackNavigator(): React.JSX.Element {
       <HomeStack.Screen
         name="HomeList"
         component={HomeScreen}
         options={({ navigation }) => ({
-          title: 'Refugio',
+          title: 'Huellitas',
           headerRight: () => (
             <Pressable
               onPress={() => navigation.navigate('Create')}
               accessibilityLabel="Agregar mascota"
```

```bash
pnpm typecheck
git add -A
git commit -m "feat(pets): add listing type and price for store and adoption" -m "For: the domain is a pet store plus adoption, so pets are given away or sold" -m "Impact: cards, detail and create form show adoption/sale and the price"
```

## 17. Paso 12 — README, handoff y verificación final
El bootcamp pide como extra un README con la descripción del dominio, la API y capturas. Copia estos dos archivos desde `proyecto/`:

- `README.md` (reemplaza el que tienes).
- `docs/handoffs/HANDOFF-week-05.md` (este mismo documento).

Contenido del `README.md`:

````markdown
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
````

**Las capturas las tomas tú** con la app corriendo: crea la carpeta `docs/screenshots/` y guarda ahí `home.png`, `create.png`, `detail.png` y `saved.png`. Hasta que lo hagas, el README mostrará imágenes rotas.

### Verificación final

```bash
pnpm typecheck
pnpm install --frozen-lockfile
git status
```

Busca que no quedó `as any` (la rúbrica resta 5 puntos):

```bash
# macOS / Linux / Git Bash
grep -rn "as any" src
# PowerShell
Get-ChildItem -Path src -Recurse -File | Select-String -Pattern "as any"
```

No debe devolver nada. Verifica también que `package.json` no tenga `^` ni `~` en `dependencies` ni `devDependencies`, salvo el `react-native-web` del hallazgo 9 si no lo corregiste.

```bash
git add README.md docs
git commit -m "docs(week-05): add readme and handoff" -m "For: document the domain, the api and how to run the app" -m "Impact: week-05 handoff and readme available in the repository"
git log --oneline
```

Debes ver **15 commits** nuevos encima de tu commit "semana 4".

## 18. La demo en vivo (guion de 5 a 7 minutos)

La entrega es una demo en el simulador y un checklist del instructor. **Lo que no se demuestra en clase no se evalúa.** Antes de empezar: wifi estable, `.env` con tu URL, seed ejecutado, app abierta una vez para comprobar que carga.

| # | Qué haces | Qué demuestra |
| --- | --- | --- |
| 1 | Abres la app y muestras la lista | `useQuery` con endpoint real; `QueryClientProvider` en `App.tsx` |
| 2 | Muestras `src/services/api.ts` | Instancia Axios con `baseURL` |
| 3 | Arrastras la lista hacia abajo | Pull-to-refresh con `refetch` |
| 4 | Tocas `+`, creas una mascota en **venta** con precio | `useMutation`; botón deshabilitado mientras envía |
| 5 | Al volver, la mascota ya está en la lista | `invalidateQueries` en `onSuccess` |
| 6 | Abres una mascota y marcas favorita; vas a Favoritos | Detalle con `useItemById`; Zustand solo con ids |
| 7 | Muestras los tres estados (abajo) | Loading, error y vacío en `HomeScreen` |

### Cómo mostrar cada estado a propósito

- **Error:** activa el modo avión y arrastra la lista hacia abajo; tras unos 3 segundos (los reintentos) aparece el error con el botón **Reintentar**. Quita el modo avión y toca Reintentar. Alternativa: pon mal tu URL en `.env`, reinicia con `pnpm exec expo start -c`.
- **Vacío:** en `src/hooks/useItems.ts` cambia temporalmente `return data;` por `return [];`, guarda y mira el mensaje "Aún no hay mascotas". Al terminar: `git restore src/hooks/useItems.ts`.
- **Cargando:** en el mismo archivo, antes de `return data;`, agrega `await new Promise((resolve) => setTimeout(resolve, 3000));` para ver el spinner 3 segundos. Al terminar: `git restore src/hooks/useItems.ts`.

Después de la demo, `git status` debe quedar limpio. Si se te olvidó restaurar, `git restore src/hooks/useItems.ts`.

## 19. Subir la rama `week-05` a GitHub

Yo no pude subirla por ti: esta sesión no tiene tu cuenta de GitHub conectada, así que no tengo permiso de escritura en tu repositorio. Se hace en cinco comandos desde tu computador.

1. Comprueba que todo está guardado y que el remoto apunta a tu repo:

```bash
git status
git branch --show-current
git remote -v
```

- `git status` debe decir `nothing to commit, working tree clean`.
- La rama debe ser `week-05`.
- `git remote -v` debe mostrar `origin` con la dirección de tu repositorio (por ejemplo `https://github.com/TU-USUARIO/pets-adoption-app.git`). Si no muestra nada: `git remote add origin https://github.com/TU-USUARIO/pets-adoption-app.git`.

2. Sube la rama **nueva** (primera vez, con `-u` para enlazarla):

```bash
git push -u origin week-05
```

3. Sube la etiqueta de cierre de semana (la guía maestra la pide):

```bash
git tag week-05-done
git push origin week-05-done
```

4. Compruébalo en GitHub: abre tu repositorio, despliega el selector de ramas (arriba a la izquierda) y elige `week-05`. Debes ver los 15 commits nuevos (botón **Commits**) encima de "semana 4".

5. Las ramas `week-01` a `week-04` no se tocan.

**Si Git te pide usuario y contraseña:** GitHub ya no acepta la contraseña de tu cuenta en la terminal. Usa uno de estos:

- GitHub CLI: instala `gh`, ejecuta `gh auth login` y elige HTTPS con el navegador.
- Git Credential Manager (viene con Git para Windows): la primera vez abre una ventana del navegador para iniciar sesión.
- Un token personal (Personal Access Token) como contraseña: GitHub → Settings → Developer settings → Personal access tokens, con permiso `repo`.

**Si dice `rejected` o `non-fast-forward`:** significa que ya existe una rama `week-05` en GitHub con otro contenido. No uses `--force`. Haz `git fetch origin` y `git log --oneline origin/week-05` para ver qué hay, y pídeme que lo revisemos juntos.

**Si prefieres que lo suba yo la próxima vez:** conecta GitHub en claude.ai → Settings → Connectors, y dame permiso en el repositorio. Aun así, el acceso a repositorios privados depende de que la aplicación de Claude en GitHub tenga acceso a ese repo.

### Camino A: aplicar los commits desde `semana-05.patch`

Si prefieres no escribir el código a mano:

```bash
git switch week-4
git switch -c week-05
git am --3way semana-05.patch
pnpm install
pnpm typecheck
```

`git am` crea los 15 commits con sus mensajes. No ejecuta tus hooks de commit, por eso corre `pnpm typecheck` después. Si `git am` dice que un parche no aplica (por ejemplo, por saltos de línea de Windows), ejecuta `git am --abort` y prueba `git am --3way --ignore-whitespace semana-05.patch`. Si sigue fallando, `git am --abort`, vuelve a `week-4` y usa el camino B, copiando archivos desde `proyecto/`. Los commits del parche incluyen la línea `Co-Authored-By: Claude` porque yo los escribí.

## 20. Problemas frecuentes

| Síntoma | Causa probable | Qué hacer |
| --- | --- | --- |
| `Network Error` en la lista | URL mal escrita o `.env` sin recargar | Revisa `.env` (sin `/pets` al final, sin comillas) y reinicia con `pnpm exec expo start -c` |
| `[api] Falta EXPO_PUBLIC_API_URL` en la terminal | No existe `.env` o el nombre de la variable está mal | Crea `.env` en la raíz con `EXPO_PUBLIC_API_URL=...` |
| La lista sale con error 404 | El recurso no se llama exactamente `pets` | En MockAPI el recurso debe ser `pets` (minúscula) |
| Creo una mascota y no aparece en la lista | La `queryKey` de `useCreateItem` no coincide con la de `useItems` | Ambas deben usar `ITEMS_QUERY_KEY` |
| El commit se rechaza con errores de TypeScript | El hook `pre-commit` ejecutó `pnpm typecheck` | Lee el error, corrígelo y repite `git add` y `git commit` |
| El commit se rechaza con `subject may not be empty` o `type may not be empty` | El mensaje no sigue Conventional Commits | Usa `tipo(alcance): descripción` en inglés, máximo 72 caracteres |
| `git am` falla | Tu `week-4` cambió o hay saltos de línea de Windows | `git am --abort`, prueba con `--3way --ignore-whitespace`, y si no, camino B |
| Expo Go dice que el proyecto es incompatible | El SDK de `package.json` no coincide con tu Expo Go | Usa un Expo Go que soporte ese SDK; no cambies versiones al azar |
| Mis favoritos de antes desaparecieron | Se limpió el almacenamiento del teléfono | La migración convierte los viejos a ids; si ya no existían, vuelve a marcarlos |
| `pnpm install --frozen-lockfile` falla | `package.json` y `pnpm-lock.yaml` no coinciden | Corre `pnpm install`, revisa el cambio y haz commit del lockfile |

## 21. Definition of Done

- [ ] `pnpm typecheck` sin errores
- [ ] La app corre en Expo Go o simulador sin errores al abrir
- [ ] `QueryClientProvider` en `App.tsx` e instancia Axios con `baseURL` en `src/services/api.ts`
- [ ] `HomeScreen` lista con `useQuery` y `queryKey` semántico (`['pets']`)
- [ ] Estados loading, error (con Reintentar) y vacío visibles
- [ ] `CreateScreen` crea con `useMutation` y la lista se actualiza con `invalidateQueries`
- [ ] Pull-to-refresh funcionando
- [ ] Zustand guarda solo ids; sin `as any`
- [ ] `package.json` sin `^` ni `~`; `pnpm-lock.yaml` commiteado; sin `package-lock.json`
- [ ] `.env.example` en el repo; `.env` solo con la URL de práctica (sin claves)
- [ ] 15 commits convencionales
- [ ] Rama `week-05` y etiqueta `week-05-done` en GitHub

## 22. Siguiente semana

`week-06` sale de `week-05` (`git switch -c week-06`). Tema del repo de referencia: **Formularios con React Hook Form + Zod**. En el dominio: formulario de solicitud de adopción y de registrar mascota con validación (el formulario de crear de esta semana se convierte en uno validado). Pide el **HANDOFF-week-06**.

## 23. Mensaje de arranque para un nuevo Claude

```text
Continúa el proyecto "Huellitas — tienda de mascotas y adopción" (React Native, Expo, TypeScript, pnpm versiones fijas, conventional commits, ramas week-XX).
Lee docs/00-GUIA-MAESTRA.md y docs/handoffs/HANDOFF-week-05.md. Retoma exactamente desde el bloque ESTADO.
No rehagas pasos marcados [x]. Al terminar cada paso, marca [x] y dame el bloque ESTADO actualizado.
Estoy aprendiendo: explica cada paso en detalle y con comandos.
```

## ESTADO (actualizar al avanzar)

- Pasos 0 a 12: **escritos y verificados en un entorno de pruebas** sobre un clon de tu rama `week-4` de GitHub (typecheck en cada commit, empaquetado Android con Metro, cliente Axios contra servidor local, migración de favoritos).
- Pendiente por la persona: confirmar el recurso `pets` en MockAPI, correr el seed, probar en Expo Go, tomar las capturas, subir `week-05` y la etiqueta `week-05-done`.
- Último commit esperado: `docs(week-05): add readme and handoff`.
- Bloqueos: no se pudo subir la rama desde la sesión (sin cuenta de GitHub conectada); se entregan los pasos y el archivo `semana-05.patch`.
- Notas para el siguiente Claude: el repo real tiene las ramas `week-01` a `week-04` y además `week-4` (= `week-04` + commit "semana 4" con Axios, React Query y `.env`); la semana 5 parte de `week-4`. `package.json` declara `expo 58.0.23` mientras la guía maestra dice SDK 57: confirmar y, si corresponde, actualizar la guía maestra. El `.env` está versionado a propósito (solo URL de práctica).
