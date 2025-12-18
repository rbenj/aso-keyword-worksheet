import pluralize from 'pluralize';
import { isIntValid } from '@/lib/validation';

const ALTERNATE_TRANSFORM_WORDS = ['app', 'game'];
const SCORE_MAX = 100;
const SCORE_MIN = 0;

export interface QueryInput {
  id?: string;
  text: string;
  popularity?: number;
  competitiveness?: number;
}

/**
 * A search query phrase and associated meta data.
 */
export class Query {
  /** Unique identifier */
  readonly id: string;
  /** Lower case with normalized whitespace */
  readonly text: string;
  /** Optional score from 0-100 */
  readonly popularity?: number;
  /** Optional score from 0-100 */
  readonly competitiveness?: number;
  /** Options for alternative text */
  readonly alternates: string[];

  constructor(input: QueryInput) {
    this.id = input.id ?? crypto.randomUUID();

    const normalizedText = input.text
      .trim()
      .toLowerCase()
      .replace(/\s+/g, ' ');

    if (!normalizedText) {
      throw new Error('Text cannot be empty.');
    }
    this.text = normalizedText;

    if (input.popularity !== undefined) {
      if (!isIntValid(input.popularity, SCORE_MIN, SCORE_MAX)) {
        throw new Error(`Popularity must be an integer between ${SCORE_MIN} and ${SCORE_MAX}.`);
      }
      this.popularity = input.popularity;
    }

    if (input.competitiveness !== undefined) {
      if (!isIntValid(input.competitiveness, SCORE_MIN, SCORE_MAX)) {
        throw new Error(`Competitiveness must be an integer between ${SCORE_MIN} and ${SCORE_MAX}.`);
      }
      this.competitiveness = input.competitiveness;
    }

    this.alternates = this.getAlternates();
  }

  /** Create a new instance with updated values. Use null to clear optional fields. */
  update(input: Partial<{
    text: string;
    popularity: number | null;
    competitiveness: number | null;
  }>): Query {
    return new Query({
      text: input.text ?? this.text,
      popularity: input.popularity === null ? undefined : (input.popularity ?? this.popularity),
      competitiveness: input.competitiveness === null ? undefined : (input.competitiveness ?? this.competitiveness),
    });
  }

  /** Get some possible (hopefully good) alternate text suggestions. */
  private getAlternates(): string[] {
    const alternates: string[] = [];

    const words = this.text.split(/\s+/);
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      if (
        ALTERNATE_TRANSFORM_WORDS.includes(word) // Transform designated words
        || i === words.length - 1 // Transform the last word
      ) {
        const singularAlternate = this.text.replace(word, pluralize.singular(word));
        if (singularAlternate !== this.text) {
          alternates.push(singularAlternate);
        }

        const pluralAlternate = this.text.replace(word, pluralize(word));
        if (pluralAlternate !== this.text) {
          alternates.push(pluralAlternate);
        }
      }
    }

    return Array.from(new Set(alternates));
  }
}
