import type { Item } from '../types';

export type RootTabParamList = {
  Home: undefined;
  Saved: undefined;
};

export type HomeStackParamList = {
  HomeList: undefined;
  HomeDetail: {
    id: string;
    name: string;
  };
  Create: undefined;
  Edit: {
    item: Item;
  };
};