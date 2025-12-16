import { WarningWordList } from './warning-word-list';
import type { MetaAnalysis } from '@/types';
import { DetailBox } from './detail-box';

interface MetaAnalysisProps {
  keywordListValue: string;
  metaAnalysis: MetaAnalysis;
}

export function MetaAnalysisComponent({ keywordListValue, metaAnalysis }: MetaAnalysisProps) {
  // Check that keywordListValue matches the pattern: [A-Za-z0-9],[A-Za-z0-9] repeated (no spaces, each keyword alphanumeric, separated by commas)
  const isFormatBad = keywordListValue.length > 0 && !/^([A-Za-z0-9]+)(,[A-Za-z0-9]+)*$/.test(keywordListValue.trim());
  const hasWhiteSpace = /\s/.test(keywordListValue);
  const hasCapitalLetters = /[A-Z]/.test(keywordListValue);

  const hasIssues =
    metaAnalysis.wastedWords.size > 0 ||
    metaAnalysis.duplicateKeywords.size > 0 ||
    metaAnalysis.stopWords.size > 0 ||
    metaAnalysis.multiWordKeywords.size > 0 ||
    metaAnalysis.pluralKeywords.size > 0 ||
    isFormatBad ||
    hasWhiteSpace ||
    hasCapitalLetters;

  return (
    <div className="flex flex-col gap-2">
      <WarningWordList
        label="Duplicated Keywords"
        words={Array.from(metaAnalysis.duplicateKeywords)}
        note="Duplicated keywords are ignored, and take up character count."
      />

      <WarningWordList
        label="Untargeted Keywords"
        words={Array.from(metaAnalysis.wastedWords)}
        note="These keywords do not appear in your seach queries. Are they neccesary?"
      />

      <WarningWordList
        label="Stop Words"
        words={Array.from(metaAnalysis.stopWords)}
        note="These words are ignored. Are they neccesary?"
      />

      <WarningWordList
        label="Multi-Word Keywords"
        words={Array.from(metaAnalysis.multiWordKeywords)}
        note="Only use single, comma separated words in the keyword list."
      />

      <WarningWordList
        label="Plural Keywords"
        words={Array.from(metaAnalysis.pluralKeywords)}
        note="Only use non plural forms of words in the keyword list."
      />

      {isFormatBad && (
        <WarningWordList
          label="Keyword List Format"
          note="Keywords list should only be comma seperated alphanumeric words."
        />
      )}

      {hasCapitalLetters && (
        <WarningWordList
          label="Excess Whitespace"
          note="There should be no whitespace at all, alphanumeric"
        />
      )}

      {hasCapitalLetters && (
        <WarningWordList
          label="Capital Letters"
          note="Keywords list should only contain lowercase letters."
        />
      )}

      {!hasIssues && (
        <DetailBox>
          No issues found. 👍
        </DetailBox>
      )}
    </div>
  );
}
