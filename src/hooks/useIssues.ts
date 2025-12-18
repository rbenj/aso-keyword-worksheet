import pluralize from 'pluralize';
import { useMemo } from 'react';
import { Keyword } from '@/models/Keyword';
import { isStopWord } from '@/services/aso';

export function useIssues(
  targetKeywords: Keyword[],
  metaKeywords: Keyword[],
  metaKeywordsField: string,
): {
  duplicateMetaKeywords: Keyword[];
  keywordFieldCapitalWords: string[];
  keywordFieldInvalidWords: string[];
  keywordFieldMultiWords: string[];
  keywordFieldPluralWords: string[];
  keywordFieldSpaceCount: number;
  stopMetaKeywords: Keyword[];
  unhitTargetedKeywords: Keyword[];
} {
  const unhitTargetedKeywords: Keyword[] = useMemo(() => {
    return targetKeywords.filter(
      keyword => !metaKeywords.some(metaKeyword => metaKeyword.text === keyword.text),
    );
  }, [targetKeywords, metaKeywords]);

  const {
    duplicateMetaKeywords,
    stopMetaKeywords,
  } = useMemo(() => {
    const duplicateMetaKeywords: Keyword[] = [];
    const stopMetaKeywords: Keyword[] = [];

    const counts = new Map<Keyword, number>();

    for (const keyword of metaKeywords) {
      let count = 0;

      for (const other of metaKeywords) {
        if (other.equals(keyword)) {
          count++;
        }
      }

      counts.set(keyword, count);
    }

    for (const keyword of metaKeywords) {
      if ((counts.get(keyword) ?? 0) > 1) {
        duplicateMetaKeywords.push(keyword);
      }

      if (isStopWord(keyword.text)) {
        stopMetaKeywords.push(keyword);
      }
    }

    return {
      duplicateMetaKeywords,
      stopMetaKeywords,
    };
  }, [metaKeywords]);

  const {
    keywordFieldCapitalWords,
    keywordFieldInvalidWords,
    keywordFieldMultiWords,
    keywordFieldPluralWords,
    keywordFieldSpaceCount,
  }: {
    keywordFieldCapitalWords: string[];
    keywordFieldInvalidWords: string[];
    keywordFieldMultiWords: string[];
    keywordFieldPluralWords: string[];
    keywordFieldSpaceCount: number;
  } = useMemo(() => {
    const tokens = Array.from(
      new Set(
        metaKeywordsField
          .replace(/\s+/g, ' ')
          .split(',')
          .map(t => t.trim())
          .filter(t => t.length > 0),
      ),
    );

    return {
      keywordFieldCapitalWords: tokens.filter(t => /[A-Z]/.test(t)),
      keywordFieldInvalidWords: tokens.filter(t => !/^[A-Za-z0-9 ]+$/.test(t)),
      keywordFieldMultiWords: tokens.filter(t => t.includes(' ')),
      keywordFieldPluralWords: tokens.filter(t => pluralize.isPlural(t)),
      keywordFieldSpaceCount: (metaKeywordsField.match(/\s/g) ?? []).length,
    };
  }, [metaKeywordsField]);

  return {
    duplicateMetaKeywords,
    keywordFieldCapitalWords,
    keywordFieldInvalidWords,
    keywordFieldMultiWords,
    keywordFieldPluralWords,
    keywordFieldSpaceCount,
    stopMetaKeywords,
    unhitTargetedKeywords,
  };
}
