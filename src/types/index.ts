export interface Item {
  id: string;
  name: string;
  description: string;
  breed: string;
  age: string;
  gender: string;
  image: string;
}
// Lo que se envía en el POST para crear una mascota: todo menos el `id`,
// porque el id lo asigna el servidor.
export type CreateItemPayload = Omit<Item, 'id'>;
