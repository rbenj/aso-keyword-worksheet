import Dexie, { type Table } from 'dexie';
import { Meta, type Category, type CategoryGame } from '@/models/Meta';
import { Query } from '@/models/Query';

const DB_NAME = 'ASOKeywordWorksheet';
const TABLE_NAME = 'documents';
const ONLY_RECORD_ID_FOR_NOW = 1;

interface DocumentSchema {
  id: number;
  metaCategory: Category | '';
  metaCategoryGame: CategoryGame | '';
  metaKeywords: string;
  metaName: string;
  metaSubtitle: string;
  queries: {
    competitiveness?: number;
    popularity?: number;
    text: string;
  }[];
}

class Database {
  private dexie: Dexie;
  private table: Table<DocumentSchema, number>;

  constructor() {
    this.dexie = new Dexie(DB_NAME);
    this.dexie.version(1).stores({
      [TABLE_NAME]: '++id',
    });
    this.table = this.dexie.table(TABLE_NAME);
  }

  async load(): Promise<{ meta: Meta; queries: Query[] } | null> {
    const doc = await this.table.get(ONLY_RECORD_ID_FOR_NOW);

    if (!doc) {
      return null;
    }

    const meta = new Meta({
      category: doc.metaCategory,
      categoryGame: doc.metaCategoryGame,
      keywords: doc.metaKeywords,
      name: doc.metaName,
      subtitle: doc.metaSubtitle,
    });

    const queries = doc.queries.map(q => new Query({
      competitiveness: q.competitiveness ?? undefined,
      popularity: q.popularity ?? undefined,
      text: q.text,
    }));

    return { meta, queries };
  }

  async save(meta: Meta, queries: Query[]): Promise<void> {
    const doc: DocumentSchema = {
      id: ONLY_RECORD_ID_FOR_NOW,
      metaCategory: meta.category,
      metaCategoryGame: meta.categoryGame,
      metaKeywords: meta.keywords,
      metaName: meta.name,
      metaSubtitle: meta.subtitle,
      queries: queries.map(q => ({
        competitiveness: q.competitiveness,
        popularity: q.popularity,
        text: q.text,
      })),
    };

    await this.table.put(doc);
  }
}

export const db = new Database();
