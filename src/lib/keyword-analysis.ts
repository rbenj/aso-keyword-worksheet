import pluralize from 'pluralize';
import { STOP_WORDS } from '@/constants/aso';
import type { WordAnalysis, MetaAnalysis } from '@/types/aso';
import type { SearchQuery } from '@/lib/db';

/**
 * Extract unique keywords from search queries (excluding stop words) and convert to singular
 */
export function extractKeywordsFromSearchQueries(searchQueries: SearchQuery[]): string[] {
  const allWords: string[] = [];

  // Extract words from searchQueries
  searchQueries.forEach((searchQuery) => {
    searchQuery.text
      .trim()
      .replace(/[^a-zA-Z0-9]/g, ' ')
      .split(/\s+/)
      .map(word => word.toLowerCase())
      .filter(word => word.length > 1)
      .filter(word => !STOP_WORDS.has(word))
      .map(word => pluralize.singular(word)) // Convert to singular
      .forEach(word => allWords.push(word));
  });

  // Remove duplicates by converting to a Set and then back to an array
  return Array.from(new Set(allWords));
}

/**
 * Extract owned keywords from meta fields with counts for duplicate detection
 * Order: name, subtitle, category (if not in name/subtitle), gameCategory (if not in name/subtitle), keywords
 */
export function extractOwnedKeywords(
  metaName: string,
  metaSubtitle: string,
  metaKeywords: string,
  selectedCategory: string,
  selectedGameCategory: string,
): Map<string, number> {
  const owned = new Map<string, number>(); // Map to track counts for duplicate detection

  // Helper function to extract keywords from text and add to owned map
  const extractKeywords = (text: string) => {
    const regex = /\b\w+\b/g;
    let match;
    while ((match = regex.exec(text)) !== null) {
      const wordLower = match[0].toLowerCase();
      if (!STOP_WORDS.has(wordLower)) {
        const wordSingular = pluralize.singular(wordLower);
        owned.set(wordSingular, (owned.get(wordSingular) || 0) + 1);
      }
    }
  };

  // Helper function to check if a keyword is already in name or subtitle
  const isKeywordInNameOrSubtitle = (keyword: string): boolean => {
    const nameSubtitleText = [metaName, metaSubtitle].join(' ').toLowerCase();
    const regex = /\b\w+\b/g;
    let match;
    while ((match = regex.exec(nameSubtitleText)) !== null) {
      const wordLower = match[0].toLowerCase();
      const wordSingular = pluralize.singular(wordLower);
      if (wordSingular === keyword) {
        return true;
      }
    }
    return false;
  };

  // Extract from name and subtitle first
  extractKeywords(metaName);
  extractKeywords(metaSubtitle);

  // Extract from category (only if not already in name/subtitle)
  if (selectedCategory) {
    const categoryWords = selectedCategory
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 0 && !STOP_WORDS.has(word));

    categoryWords.forEach((word) => {
      const wordSingular = pluralize.singular(word);
      if (!isKeywordInNameOrSubtitle(wordSingular)) {
        owned.set(wordSingular, (owned.get(wordSingular) || 0) + 1);
      }
    });
  }

  // Extract from game category (only if not already in name/subtitle)
  if (selectedGameCategory) {
    const gameCategoryWords = selectedGameCategory
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 0 && !STOP_WORDS.has(word));

    gameCategoryWords.forEach((word) => {
      const wordSingular = pluralize.singular(word);
      if (!isKeywordInNameOrSubtitle(wordSingular)) {
        owned.set(wordSingular, (owned.get(wordSingular) || 0) + 1);
      }
    });
  }

  // Extract from keywords field
  extractKeywords(metaKeywords);

  return owned;
}

/**
 * Extract owned keywords in order to compute ranks
 * Order: name, subtitle, category (if not in name/subtitle), gameCategory (if not in name/subtitle), keywords
 */
export function extractOwnedKeywordsOrdered(
  metaName: string,
  metaSubtitle: string,
  metaKeywords: string,
  selectedCategory: string,
  selectedGameCategory: string,
): string[] {
  const ordered: string[] = [];
  const seen = new Set<string>();

  // Helper function to extract keywords from text and add to ordered list
  const extractKeywords = (text: string) => {
    const regex = /\b\w+\b/g;
    let match;
    while ((match = regex.exec(text)) !== null) {
      const wordLower = match[0].toLowerCase();
      if (!STOP_WORDS.has(wordLower)) {
        const wordSingular = pluralize.singular(wordLower);
        if (!seen.has(wordSingular)) {
          ordered.push(wordSingular);
          seen.add(wordSingular);
        }
      }
    }
  };

  // Helper function to check if a keyword is already in name or subtitle
  const isKeywordInNameOrSubtitle = (keyword: string): boolean => {
    const nameSubtitleText = [metaName, metaSubtitle].join(' ').toLowerCase();
    const regex = /\b\w+\b/g;
    let match;
    while ((match = regex.exec(nameSubtitleText)) !== null) {
      const wordLower = match[0].toLowerCase();
      const wordSingular = pluralize.singular(wordLower);
      if (wordSingular === keyword) {
        return true;
      }
    }
    return false;
  };

  // Extract from name and subtitle first
  extractKeywords(metaName);
  extractKeywords(metaSubtitle);

  // Extract from category (only if not already in name/subtitle)
  if (selectedCategory) {
    const categoryWords = selectedCategory
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 0 && !STOP_WORDS.has(word));

    categoryWords.forEach((word) => {
      const wordSingular = pluralize.singular(word);
      if (!isKeywordInNameOrSubtitle(wordSingular) && !seen.has(wordSingular)) {
        ordered.push(wordSingular);
        seen.add(wordSingular);
      }
    });
  }

  // Extract from game category (only if not already in name/subtitle)
  if (selectedGameCategory) {
    const gameCategoryWords = selectedGameCategory
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 0 && !STOP_WORDS.has(word));

    gameCategoryWords.forEach((word) => {
      const wordSingular = pluralize.singular(word);
      if (!isKeywordInNameOrSubtitle(wordSingular) && !seen.has(wordSingular)) {
        ordered.push(wordSingular);
        seen.add(wordSingular);
      }
    });
  }

  // Extract from keywords field
  extractKeywords(metaKeywords);

  return ordered;
}

/**
 * Compute rank comparison chart data
 * Deviation = ownedRank - idealRank (positive = later than ideal, negative = earlier than ideal)
 */
export function computeRankChartData(
  keywords: string[],
  ownedKeywordsOrdered: string[],
): Array<{ idealRank: number; deviation: number; keyword: string }> {
  if (keywords.length === 0) { return []; }

  // Create a map of keyword to its rank in owned keywords (1-based)
  const ownedRankMap = new Map<string, number>();
  ownedKeywordsOrdered.forEach((keyword, index) => {
    ownedRankMap.set(keyword, index + 1);
  });

  const missingRank = keywords.length + 1;

  const data = keywords.map((keyword, idealIndex) => {
    const idealRank = idealIndex + 1; // 1-based ideal rank
    const ownedRank = ownedRankMap.get(keyword) ?? missingRank;
    const deviation = ownedRank - idealRank; // Positive = later, negative = earlier
    return {
      idealRank: idealRank,
      deviation: deviation,
      keyword: keyword,
    };
  });

  // Sort by idealRank
  return data.sort((a, b) => a.idealRank - b.idealRank);
}

/**
 * Find which keywords are satisfied (appear in meta fields)
 */
export function computeSatisfiedKeywords(
  keywords: string[],
  ownedKeywordsSet: Set<string>,
): Set<string> {
  const satisfied = new Set<string>();

  keywords.forEach((keyword) => {
    // Check if keyword appears in owned keywords
    if (ownedKeywordsSet.has(keyword)) {
      satisfied.add(keyword);
    }
  });

  return satisfied;
}

/**
 * Find duplicate needed keywords across all meta fields
 */
export function computeDuplicateKeywords(
  ownedKeywords: Map<string, number>,
  keywordsSet: Set<string>,
): Set<string> {
  const duplicates = new Set<string>();

  // Check owned keywords that appear more than once (across all meta fields)
  // This includes duplicates between subtitle and keywords field, etc.
  ownedKeywords.forEach((count, keyword) => {
    if (count > 1) {
      duplicates.add(keyword);
    }
  });

  return duplicates;
}

/**
 * Analyze words in a text string
 */
export function analyzeText(
  text: string,
  keywordsSet: Set<string>,
  duplicateKeywords: Set<string>,
): WordAnalysis[] {
  const words: WordAnalysis[] = [];
  const regex = /\b\w+\b/g;
  let match;

  while ((match = regex.exec(text)) !== null) {
    const word = match[0];
    const wordLower = word.toLowerCase();
    const wordSingular = pluralize.singular(wordLower);
    let type: 'normal' | 'stop' | 'wasted' | 'duplicate' = 'normal';

    if (STOP_WORDS.has(wordLower)) {
      type = 'stop';
    } else if (word.length < 2) {
      // Skip words less than 2 characters - don't mark as wasted
      type = 'normal';
    } else {
      // Compare using singularized version
      const isInKeywords = keywordsSet.has(wordSingular);
      const isDuplicate = duplicateKeywords.has(wordSingular);

      if (!isInKeywords) {
        type = 'wasted';
      } else if (isDuplicate) {
        type = 'duplicate';
      }
    }

    words.push({
      word: word,
      type,
      startIndex: match.index!,
      endIndex: match.index! + word.length,
    });
  }

  return words;
}

/**
 * Analyze keywords field with whitespace detection
 */
export function analyzeKeywords(
  text: string,
  keywordsSet: Set<string>,
  duplicateKeywords: Set<string>,
): WordAnalysis[] {
  const analyses: WordAnalysis[] = [];

  // Find all matches (words and whitespace) in order
  const allMatches: Array<{ text: string; index: number; isWhitespace: boolean }> = [];

  // Find all words
  const wordRegex = /\b\w+\b/g;
  let match;
  while ((match = wordRegex.exec(text)) !== null) {
    allMatches.push({
      text: match[0],
      index: match.index!,
      isWhitespace: false,
    });
  }

  // Find all whitespace
  const whitespaceRegex = /\s+/g;
  while ((match = whitespaceRegex.exec(text)) !== null) {
    allMatches.push({
      text: match[0],
      index: match.index!,
      isWhitespace: true,
    });
  }

  // Sort by index
  allMatches.sort((a, b) => a.index - b.index);

  // Process matches and create analyses
  allMatches.forEach((match) => {
    if (match.isWhitespace) {
      analyses.push({
        word: match.text,
        type: 'whitespace',
        startIndex: match.index,
        endIndex: match.index + match.text.length,
      });
    } else {
      const wordLower = match.text.toLowerCase();
      const wordSingular = pluralize.singular(wordLower);
      const isPlural = wordSingular !== wordLower;
      let type: 'normal' | 'stop' | 'wasted' | 'duplicate' | 'plural' = 'normal';

      if (STOP_WORDS.has(wordLower)) {
        type = 'stop';
      } else if (match.text.length < 2) {
        // Skip words less than 2 characters - don't mark as wasted
        type = 'normal';
      } else {
        // Compare using singularized version
        const isInKeywords = keywordsSet.has(wordSingular);
        const isDuplicate = duplicateKeywords.has(wordSingular);

        if (!isInKeywords) {
          type = 'wasted';
        } else if (isDuplicate) {
          type = 'duplicate';
        } else if (isPlural) {
          type = 'plural';
        }
      }

      analyses.push({
        word: match.text,
        type,
        startIndex: match.index,
        endIndex: match.index + match.text.length,
      });
    }
  });

  // Detect multi-word sequences (2+ words separated by single spaces)
  // Find sequences like: word space word (space word)*
  const multiWordSequences: Array<{ startIndex: number; endIndex: number; text: string }> = [];

  for (let i = 0; i < allMatches.length - 2; i++) {
    const current = allMatches[i];
    const next = allMatches[i + 1];
    const afterNext = allMatches[i + 2];

    // Check if we have: word + single space + word
    if (!current.isWhitespace &&
      next.isWhitespace &&
      next.text === ' ' && // single space only
      !afterNext.isWhitespace) {

      // Found start of multi-word sequence
      const sequenceStart = current.index;
      let sequenceText = current.text;
      let sequenceEnd = afterNext.index + afterNext.text.length;
      sequenceText += ' ' + afterNext.text;

      // Continue checking for more words in the sequence
      let j = i + 3;
      while (j < allMatches.length - 1) {
        const checkSpace = allMatches[j];
        const checkWord = allMatches[j + 1];

        if (checkSpace.isWhitespace &&
          checkSpace.text === ' ' &&
          !checkWord.isWhitespace) {
          sequenceEnd = checkWord.index + checkWord.text.length;
          sequenceText += ' ' + checkWord.text;
          j += 2;
        } else {
          break;
        }
      }

      multiWordSequences.push({
        startIndex: sequenceStart,
        endIndex: sequenceEnd,
        text: sequenceText,
      });
    }
  }

  // Mark all analyses that are part of multi-word sequences (only words, not whitespace)
  multiWordSequences.forEach((sequence) => {
    analyses.forEach((analysis) => {
      if (analysis.startIndex >= sequence.startIndex &&
        analysis.endIndex <= sequence.endIndex &&
        analysis.type !== 'whitespace') {
        analysis.type = 'multiword';
      }
    });
  });

  return analyses;
}

/**
 * Analyze all meta fields
 */
export function computeMetaAnalysis(
  metaName: string,
  metaSubtitle: string,
  metaKeywords: string,
  keywordsSet: Set<string>,
  duplicateKeywords: Set<string>,
  analyzeTextFn: (text: string) => WordAnalysis[],
  analyzeKeywordsFn: (text: string) => WordAnalysis[],
): MetaAnalysis {
  const stopWords = new Set<string>();
  const wastedWords = new Set<string>();
  const multiWordKeywords = new Set<string>();
  const pluralKeywords = new Set<string>();
  let wastedCharCount = 0;

  // Analyze name and subtitle
  [metaName, metaSubtitle].forEach((text) => {
    const words = analyzeTextFn(text);
    words.forEach((word) => {
      const wordLower = word.word.toLowerCase();
      if (word.type === 'stop') {
        stopWords.add(wordLower);
        wastedCharCount += word.word.length;
      } else if (word.type === 'wasted') {
        wastedWords.add(wordLower);
        wastedCharCount += word.word.length;
      }
    });
  });

  // Analyze keywords (includes whitespace and multi-word detection)
  const keywordsAnalysis = analyzeKeywordsFn(metaKeywords);

  // Extract multi-word sequences from the analysis
  let currentSequence: string[] = [];
  keywordsAnalysis.forEach((item) => {
    const wordLower = item.word.toLowerCase();

    if (item.type === 'multiword') {
      if (item.word.match(/\s/)) {
        // It's whitespace, skip
      } else {
        // It's a word in a multi-word sequence
        currentSequence.push(item.word);
      }
    } else {
      // End of sequence or not part of multi-word
      if (currentSequence.length > 1) {
        multiWordKeywords.add(currentSequence.join(' '));
      }
      currentSequence = [];
    }

    if (item.type === 'stop') {
      stopWords.add(wordLower);
      wastedCharCount += item.word.length;
    } else if (item.type === 'wasted') {
      wastedWords.add(wordLower);
      wastedCharCount += item.word.length;
    } else if (item.type === 'whitespace') {
      wastedCharCount += item.word.length;
    } else if (item.type === 'plural') {
      pluralKeywords.add(item.word);
    }
  });

  // Handle case where multi-word sequence is at the end
  if (currentSequence.length > 1) {
    multiWordKeywords.add(currentSequence.join(' '));
  }

  return {
    stopWords,
    wastedWords,
    duplicateKeywords,
    multiWordKeywords,
    pluralKeywords
  };
}

/**
 * Generate unused searchQuery combinations using pluralization
 */
export function generateUnusedSearchQueries(searchQueries: SearchQuery[]): string[] {
  if (searchQueries.length === 0) { return []; }

  // Get existing searchQuery texts (already normalized: lowercase, trimmed, single spaces)
  const existingSearchQueries = new Set(
    searchQueries.map(searchQuery => searchQuery.text),
  );

  const combinations: string[] = [];

  // Go through each searchQuery and generate plural variations
  for (const searchQuery of searchQueries) {
    const words = searchQuery.text
      .split(/\s+/)
      .map(word => word.trim())
      .filter(word => word.length > 0);

    if (words.length === 0) { continue; }

    // Generate all combinations where at least one word is pluralized
    // For each word, we can either keep it or pluralize it
    // We need at least one pluralization (exclude the case where all are kept)
    const numWords = words.length;
    const numCombinations = Math.pow(2, numWords);

    for (let i = 1; i < numCombinations; i++) {
      // Skip i=0 (all words kept, no pluralization)
      const variation: string[] = [];
      for (let j = 0; j < numWords; j++) {
        const shouldPluralize = (i & (1 << j)) !== 0;
        if (shouldPluralize) {
          const word = words[j];
          // Only pluralize if the word ends with a-z
          if (/[a-z]$/i.test(word)) {
            variation.push(pluralize(word));
          } else {
            variation.push(word);
          }
        } else {
          variation.push(words[j]);
        }
      }
      const newSearchQuery = variation.join(' ');
      combinations.push(newSearchQuery);
    }
  }

  // Filter out combinations that already exist in searchQueries
  // Normalize combinations: lowercase, trim, and remove extra whitespace
  const unused = combinations
    .map(combo => combo.trim().toLowerCase().replace(/\s+/g, ' '))
    .filter(combo => !existingSearchQueries.has(combo));

  // Remove duplicates and limit to 100 results
  const uniqueUnused = Array.from(new Set(unused));
  return uniqueUnused.slice(0, 100);
}
