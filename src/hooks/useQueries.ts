import { useMemo } from 'react';
import { Keyword } from '@/models/Keyword';
import { Query } from '@/models/Query';
import { extractFilteredKeywords } from '@/services/aso';

export function useQueries(queries: Query[]): {
  alternateQueries: string[];
  targetKeywords: Keyword[];
} {
  return useMemo(() => {
    return {
      alternateQueries: queries.map(query => query.alternates).flat(),
      targetKeywords: extractFilteredKeywords(queries.map(query => query.text).join(' ')),
    };
  }, [queries]);
}
