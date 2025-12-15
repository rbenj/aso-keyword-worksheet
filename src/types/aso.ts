export interface WordAnalysis {
  word: string;
  type: 'normal' | 'stop' | 'wasted' | 'whitespace' | 'duplicate' | 'multiword' | 'plural';
  startIndex: number;
  endIndex: number;
}

export interface MetaAnalysis {
  stopWords: Set<string>;
  wastedWords: Set<string>;
  duplicateKeywords: Set<string>;
  multiWordKeywords: Set<string>;
  pluralKeywords: Set<string>;
}
