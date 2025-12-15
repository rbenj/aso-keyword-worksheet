import { Badge } from '@/components/ui/badge';

interface KeywordsDisplayProps {
  keywords: string[];
  satisfiedKeywords: Set<string>;
}

export function KeywordsDisplay({ keywords, satisfiedKeywords }: KeywordsDisplayProps) {
  return (
    <div className="flex flex-wrap gap-2 border border-gray-200 rounded-md p-4">
      {keywords.length > 0 ? (
        keywords.map((keyword, index) => (
          <Badge
            key={index}
            className={satisfiedKeywords.has(keyword) ? 'bg-green-200' : ''}
          >
            {keyword}
          </Badge>
        ))
      ) : (
        <p className="text-sm text-muted-foreground">
          Start by entering a search query
        </p>
      )}
    </div>
  );
}
