import { Badge } from '@/components/ui/badge';

interface KeywordsDisplayProps {
  keywords: string[];
  satisfiedKeywords: Set<string>;
}

export function KeywordsDisplay({ keywords, satisfiedKeywords }: KeywordsDisplayProps) {
  return (
    <div>
      {keywords.length > 0 ? (
        <div className="flex gap-2">
          {keywords.map((keyword, index) => (
            <Badge
              key={index}
              className={satisfiedKeywords.has(keyword) ? 'bg-green-200' : ''}
            >
              {keyword}
            </Badge>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-2 rounded-lg border border-dashed border-gray-300 p-2">
          Add search queries to determine target keywords.
        </div>
      )}
    </div>
  );
}
