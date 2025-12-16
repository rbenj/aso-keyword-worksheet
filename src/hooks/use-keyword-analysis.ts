import { useMemo } from 'react';
import {
  extractKeywordsFromSearchQueries,
  extractOwnedKeywords,
  extractOwnedKeywordsOrdered,
  computeRankChartData,
  computeSatisfiedKeywords,
  computeDuplicateKeywords,
  analyzeText,
  analyzeKeywords,
  computeMetaAnalysis,
  generateUnusedSearchQueries,
} from '@/lib/keyword-analysis';
import type { SearchQuery } from '@/lib/db';
import type { MetaAnalysis } from '@/types';

interface UseKeywordAnalysisParams {
  searchQueries: SearchQuery[];
  metaName: string;
  metaSubtitle: string;
  metaKeywords: string;
  selectedCategory: string;
  selectedGameCategory: string;
}

export function useKeywordAnalysis({
  searchQueries,
  metaName,
  metaSubtitle,
  metaKeywords,
  selectedCategory,
  selectedGameCategory,
}: UseKeywordAnalysisParams) {
  // Extract unique words from all searchQueries (excluding stop words) and convert to singular
  const keywords = useMemo(() => {
    return extractKeywordsFromSearchQueries(searchQueries);
  }, [searchQueries]);

  // Convert keywords to Set for faster lookup
  const keywordsSet = useMemo(() => new Set(keywords), [keywords]);

  // Extract and maintain owned keywords from meta fields (updated when meta changes)
  const ownedKeywords = useMemo(() => {
    return extractOwnedKeywords(
      metaName,
      metaSubtitle,
      metaKeywords,
      selectedCategory,
      selectedGameCategory,
    );
  }, [metaName, metaSubtitle, metaKeywords, selectedCategory, selectedGameCategory]);

  // Convert ownedKeywords to Set for faster lookup (without counts)
  const ownedKeywordsSet = useMemo(() => new Set(ownedKeywords.keys()), [ownedKeywords]);

  // Extract owned keywords in order to compute ranks
  const ownedKeywordsOrdered = useMemo(() => {
    return extractOwnedKeywordsOrdered(
      metaName,
      metaSubtitle,
      metaKeywords,
      selectedCategory,
      selectedGameCategory,
    );
  }, [metaName, metaSubtitle, metaKeywords, selectedCategory, selectedGameCategory]);

  // Find duplicate needed keywords across all meta fields
  const duplicateKeywords = useMemo(() => {
    return computeDuplicateKeywords(ownedKeywords);
  }, [ownedKeywords]);

  // Find which keywords are satisfied (appear in meta fields)
  const satisfiedKeywords = useMemo(() => {
    return computeSatisfiedKeywords(keywords, ownedKeywordsSet);
  }, [keywords, ownedKeywordsSet]);

  // Compute rank comparison chart data
  const rankChartData = useMemo(() => {
    return computeRankChartData(keywords, ownedKeywordsOrdered);
  }, [keywords, ownedKeywordsOrdered]);

  // Create analysis functions that use current state
  const analyzeTextFn = useMemo(() => {
    return (text: string) => analyzeText(text, keywordsSet, duplicateKeywords);
  }, [keywordsSet, duplicateKeywords]);

  const analyzeKeywordsFn = useMemo(() => {
    return (text: string) => analyzeKeywords(text, keywordsSet, duplicateKeywords);
  }, [keywordsSet, duplicateKeywords]);

  // Analyze all meta fields
  const metaAnalysis = useMemo((): MetaAnalysis => {
    return computeMetaAnalysis(
      metaName,
      metaSubtitle,
      metaKeywords,
      duplicateKeywords,
      analyzeTextFn,
      analyzeKeywordsFn,
    );
  }, [metaName, metaSubtitle, metaKeywords, duplicateKeywords, analyzeTextFn, analyzeKeywordsFn]);

  // Generate unused searchQuery combinations using pluralization
  const unusedSearchQueries = useMemo(() => {
    return generateUnusedSearchQueries(searchQueries);
  }, [searchQueries]);

  return {
    keywords,
    keywordsSet,
    ownedKeywords,
    ownedKeywordsSet,
    ownedKeywordsOrdered,
    duplicateKeywords,
    satisfiedKeywords,
    rankChartData,
    metaAnalysis,
    unusedSearchQueries,
    analyzeTextFn,
    analyzeKeywordsFn,
  };
}
