import { Ban, Check } from 'lucide-react';

import { Badge } from '@/components/ui/badge';

interface KeywordsDisplayProps {
  keywords: string[];
  satisfiedKeywords: Set<string>;
}

export function KeywordsDisplay({ keywords, satisfiedKeywords }: KeywordsDisplayProps) {
  if (keywords.length <= 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {keywords.map(keyword => (
        <Badge
          className="text-sm"
          key={keyword}
          variant={satisfiedKeywords.has(keyword) ? 'default' : 'outline'}
        >
          {satisfiedKeywords.has(keyword) ? (
            <Check />
          ) : (
            <Ban />
          )}
          {keyword}
        </Badge>
      ))}
    </div>
  );
}
