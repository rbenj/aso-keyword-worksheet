import pluralize from 'pluralize';
import { STOP_WORDS } from '@/constants';
import { Keyword } from '@/models/Keyword';

/**
 * Check if a word is a stop word.
 */
export function isStopWord(text: string): boolean {
  return STOP_WORDS.has(text.toLowerCase());
}

/**
 * Sanitize a keyword text string.
 */
export function sanitizeKeywordText(dirty: string): string {
  let clean = dirty.toLowerCase().replace(/[^a-z0-9]/g, '');

  clean = pluralize.singular(clean);

  if (clean.length < 2) {
    return '';
  }

  return clean;
}

/**
 * Get all keywords from a text string.
 */
export function extractKeywords(text: string): Keyword[] {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, ' ')
    .split(/\s+/)
    .map(v => sanitizeKeywordText(v))
    .filter(v => v)
    .map(v => new Keyword({ text: v }));
}

/**
 * Get all keywords from a text string, without dupes or stop words.
 */
export function extractFilteredKeywords(text: string): Keyword[] {
  // get extracted keywords with no stop words or doubles
  return extractKeywords(text)
    .filter((keyword, index, self) =>
      index === self.findIndex(t => t.text === keyword.text),
    )
    .filter(keyword => !isStopWord(keyword.text));
}
