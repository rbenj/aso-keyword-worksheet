export interface KeywordInput {
  readonly text: string;
}

/**
 * A solitary, singular form keyword.
 */
export class Keyword {
  /** Lower case alphanumeric characters only */
  readonly text: string;

  constructor(input: KeywordInput) {
    const normalizedText = input.text
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '')
      .replace(/[^a-z0-9]/g, '');

    if (!normalizedText) {
      throw new Error('Text cannot be empty.');
    }
    this.text = normalizedText;
  }

  equals(other: Keyword): boolean {
    return this.text === other.text;
  }

  clone(): Keyword {
    return new Keyword({ text: this.text });
  }

  toString(): string {
    return this.text;
  }

  toJSON(): KeywordInput {
    return { text: this.text };
  }

  static fromJSON(json: KeywordInput): Keyword {
    return new Keyword({ text: json.text });
  }
}
