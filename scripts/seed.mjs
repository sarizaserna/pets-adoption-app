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
