import Dexie, { type Table } from 'dexie';

export interface SearchQuery {
  id: number;
  text: string;
  popularity?: number;
  competitiveness?: number;
}

export interface AppState {
  id?: number;
  searchQueries: SearchQuery[];
  selectedCategory: string;
  selectedGameCategory: string;
  metaName: string;
  metaSubtitle: string;
  metaKeywords: string;
}

class AppDatabase extends Dexie {
  appState!: Table<AppState, number>;

  constructor() {
    super('ASOKeywordWorksheet');
    this.version(1).stores({
      appState: '++id',
    });
  }
}

export const db = new AppDatabase();
