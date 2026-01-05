import { CATEGORIES, GAME_CATEGORIES } from '@/constants';

const NAME_MAX_LENGTH = 30;
const SUBTITLE_MAX_LENGTH = 30;
const KEYWORDS_MAX_LENGTH = 100;

export type Category = (typeof CATEGORIES)[number];
export type CategoryGame = (typeof GAME_CATEGORIES)[number];

export interface MetaInput {
  name?: string;
  subtitle?: string;
  keywords?: string;
  category?: Category | '';
  categoryGame?: CategoryGame | '';
}

/**
 * The meta associated with an iOS app in App Store Connect.
 */
export class Meta {
  /** App name, max 30 characters */
  readonly name: string;
  /** App subtitle, max 30 characters */
  readonly subtitle: string;
  /** Comma-separated keyword list, max 100 characters */
  readonly keywords: string;
  /** Primary App Store category */
  readonly category: Category | '';
  /** Game sub-category (only valid when for Games category) */
  readonly categoryGame: CategoryGame | '';

  constructor(input: MetaInput = {}) {
    const name = input.name ?? '';
    if (name.trim().length > NAME_MAX_LENGTH) {
      throw new Error(`Name cannot exceed ${NAME_MAX_LENGTH} characters.`);
    }
    this.name = name;

    const subtitle = input.subtitle ?? '';
    if (subtitle.trim().length > SUBTITLE_MAX_LENGTH) {
      throw new Error(`Subtitle cannot exceed ${SUBTITLE_MAX_LENGTH} characters.`);
    }
    this.subtitle = subtitle;

    const keywords = input.keywords ?? '';
    if (keywords.trim().length > KEYWORDS_MAX_LENGTH) {
      throw new Error(`Keywords cannot exceed ${KEYWORDS_MAX_LENGTH} characters.`);
    }
    this.keywords = keywords;

    this.category = input.category ?? '';

    this.categoryGame = input.categoryGame ?? '';
    if (this.categoryGame && this.category !== 'Games') {
      this.categoryGame = '';
    }
  }

  /** Create a new instance with updated values. Pass null to clear category fields. */
  update(input: Partial<MetaInput>): Meta {
    return new Meta({
      name: input.name ?? this.name,
      subtitle: input.subtitle ?? this.subtitle,
      keywords: input.keywords ?? this.keywords,
      category: input.category ?? this.category,
      categoryGame: input.categoryGame ?? this.categoryGame,
    });
  }

  /** Get all text from all fields in the proper importance order. */
  getAllTextOrdered(): string {
    return [
      this.name,
      this.subtitle,
      this.category,
      this.categoryGame,
      this.keywords,
    ].join(' ');
  }
}
