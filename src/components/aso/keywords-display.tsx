import { Badge } from '@/components/ui/badge';

interface KeywordsDisplayProps {
  keywords: string[];
  satisfiedKeywords: Set<string>;
}

export function KeywordsDisplay({ keywords, satisfiedKeywords }: KeywordsDisplayProps) {
  return (
    <div>
      <h2>
        Target Keywords
      </h2>

      <p>
        These are the keywords that should be included in your app's meta. They are ordered to match the priority of your search queries. Only singular versions are listed (Apple does not differentiate between singular and plural words).
      </p>

      <div className="flex flex-wrap gap-2">
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
            No keywords yet
          </p>
        )}
      </div>
    </div>
  );
}
