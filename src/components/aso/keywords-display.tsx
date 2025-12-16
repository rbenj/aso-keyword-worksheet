import { Badges, type BadgeDef } from '@/components/Badges';

interface KeywordsDisplayProps {
  keywords: string[];
  satisfiedKeywords: Set<string>;
}

export function KeywordsDisplay({
  keywords,
  satisfiedKeywords,
}: KeywordsDisplayProps) {
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
