import type { Keyword } from '@/models/Keyword';
import { Badges, type BadgeDef } from '@/components/Badges';

interface TargetKeywordsProps {
  targetKeywords: Keyword[];
  metaKeywords: Keyword[];
}

function isTargeted(targetKeyword: Keyword, metaKeywords: Keyword[]): boolean {
  return metaKeywords.some(metaKeyword => metaKeyword.text === targetKeyword.text);
}

export function TargetKeywords({
  targetKeywords,
  metaKeywords,
}: TargetKeywordsProps) {
  if (targetKeywords.length <= 0) {
    return null;
  }

  const badges: BadgeDef[] = targetKeywords.map(keyword => ({
    isOn: isTargeted(keyword, metaKeywords),
    label: keyword.text,
    showIcon: true,
  }));

  return (
    <Badges badges={badges} />
  );
}
