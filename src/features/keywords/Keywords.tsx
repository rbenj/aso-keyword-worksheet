import { Badges, type BadgeDef } from '@/components/Badges';

interface KeywordsProps {
  keywords: string[];
  satisfiedKeywords: Set<string>;
}

export function Keywords({
  keywords,
  satisfiedKeywords,
}: KeywordsProps) {
  if (keywords.length <= 0) {
    return null;
  }

  const badges: BadgeDef[] = keywords.map(keyword => ({
    isOn: satisfiedKeywords.has(keyword),
    label: keyword,
    showIcon: true,
  }));

  return (
    <Badges badges={badges} />
  );
}
