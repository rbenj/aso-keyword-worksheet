import type { MetaAnalysis } from '@/types';
import { ActionBox } from '@/components/ActionBox';
import { Issue, type IssueProps } from './Issue';

interface IssuesProps {
  keywordListValue: string;
  metaAnalysis: MetaAnalysis;
}

export function Issues({
  keywordListValue,
  metaAnalysis,
}: IssuesProps) {
  const IssuesData: IssueProps[] = [];

  if (metaAnalysis.duplicateKeywords.size > 0) {
    IssuesData.push({
      keywords: Array.from(metaAnalysis.duplicateKeywords),
      label: 'Duplicated Keywords',
      text: 'Duplicate keywords are ignored and take up character count.',
    });
  }

  if (metaAnalysis.wastedWords.size > 0) {
    IssuesData.push({
      keywords: Array.from(metaAnalysis.wastedWords),
      label: 'Untargeted Keywords',
      text: 'These keywords do not appear in your seach queries. Are they neccesary?',
    });
  }

  if (metaAnalysis.stopWords.size > 0) {
    IssuesData.push({
      keywords: Array.from(metaAnalysis.stopWords),
      label: 'Stop Words',
      text: 'These words are ignored. Are they neccesary?',
    });
  }

  if (metaAnalysis.multiWordKeywords.size > 0) {
    IssuesData.push({
      keywords: Array.from(metaAnalysis.multiWordKeywords),
      label: 'Multiword Keywords',
      text: 'Only use single, comma separated words in the keyword list.',
    });
  }

  if (metaAnalysis.pluralKeywords.size > 0) {
    IssuesData.push({
      keywords: Array.from(metaAnalysis.pluralKeywords),
      label: 'Plural Keywords',
      text: 'Only use non-plural forms of words in the keyword list.',
    });
  }

  if (keywordListValue.length > 0 && !/^([A-Za-z0-9]+)(,[A-Za-z0-9]+)*$/.test(keywordListValue.trim())) {
    IssuesData.push({
      label: 'Keyword List Format',
      text: 'Keyword list should only contain letters, numbers, and commas.',
    });
  }

  if (/\s/.test(keywordListValue)) {
    IssuesData.push({
      label: 'Excess Whitespace',
      text: 'There should be no whitespace in the keyword list.',
    });
  }

  if (/[A-Z]/.test(keywordListValue)) {
    IssuesData.push({
      label: 'Capital Letters',
      text: 'All letters in the keyword list should be lowercase.',
    });
  }

  return (
    <div className="flex flex-col gap-2">
      {IssuesData.length > 0 ? (
        <>
          {IssuesData.map(issue => (
            <Issue key={issue.label} {...issue} />
          ))}
        </>
      ) : (
        <ActionBox>
          No issues found. 👍
        </ActionBox>
      )}
    </div>
  );
}
