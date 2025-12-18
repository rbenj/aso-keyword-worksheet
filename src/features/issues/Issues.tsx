import pluralize from 'pluralize';
import { Keyword } from '@/models/Keyword';
import { ActionBox } from '@/components/ActionBox';
import { Issue, type IssueProps } from './Issue';

interface IssuesProps {
  duplicateMetaKeywords: Keyword[];
  keywordFieldCapitalWords: string[];
  keywordFieldInvalidWords: string[];
  keywordFieldMultiWords: string[];
  keywordFieldPluralWords: string[];
  keywordFieldSpaceCount: number;
  stopMetaKeywords: Keyword[];
  unhitTargetedKeywords: Keyword[];
}

export function Issues({
  duplicateMetaKeywords,
  keywordFieldCapitalWords,
  keywordFieldInvalidWords,
  keywordFieldMultiWords,
  keywordFieldPluralWords,
  keywordFieldSpaceCount,
  stopMetaKeywords,
  unhitTargetedKeywords,
}: IssuesProps) {
  const IssuesData: IssueProps[] = [];

  if (duplicateMetaKeywords.length > 0) {
    IssuesData.push({
      keywords: duplicateMetaKeywords.map(keyword => keyword.text),
      label: 'Duplicated Keywords',
      text: 'Duplicate keywords are ignored and take up character count.',
    });
  }

  if (stopMetaKeywords.length > 0) {
    IssuesData.push({
      keywords: stopMetaKeywords.map(keyword => keyword.text),
      label: 'Stop Words',
      text: 'These words are ignored. Are they neccesary?',
    });
  }

  if (unhitTargetedKeywords.length > 0) {
    IssuesData.push({
      keywords: unhitTargetedKeywords.map(keyword => keyword.text),
      label: 'Untargeted Keywords',
      text: 'These keywords do not appear in your seach queries. Are they neccesary?',
    });
  }

  if (keywordFieldMultiWords.length > 0) {
    IssuesData.push({
      keywords: keywordFieldMultiWords,
      label: 'Multiword Keywords',
      text: 'Only use single, comma separated words in the keyword list.',
    });
  }

  if (keywordFieldPluralWords.length > 0) {
    IssuesData.push({
      keywords: keywordFieldPluralWords,
      label: 'Plural Keywords',
      text: 'Only use non-plural forms of words in the keyword list.',
    });
  }

  if (keywordFieldInvalidWords.length > 0) {
    IssuesData.push({
      keywords: keywordFieldInvalidWords,
      label: 'Keyword List Format',
      text: 'Keyword list should only contain letters, numbers, and commas.',
    });
  }

  if (keywordFieldSpaceCount > 0) {
    IssuesData.push({
      label: 'Whitespace In Keywords',
      text: `There ${keywordFieldSpaceCount > 1 ? 'are' : 'is'} ${keywordFieldSpaceCount} ${pluralize('space', keywordFieldSpaceCount)} in the keyword list. There should be none.`,
    });
  }

  if (keywordFieldCapitalWords.length > 0) {
    IssuesData.push({
      keywords: keywordFieldCapitalWords,
      label: 'Capital Letters In Keywords',
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
