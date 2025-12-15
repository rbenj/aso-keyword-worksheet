import { Badge } from '@/components/ui/badge';
import { ExternalLink } from 'lucide-react';

interface UnusedQueriesProps {
  unusedSearchQueries: string[];
}

export function UnusedQueries({ unusedSearchQueries }: UnusedQueriesProps) {
  // Ensure no dupes
  const queries = Array.from(new Set(unusedSearchQueries));

  return (
    <div className="flex flex-wrap gap-2">
      {queries.map((query) => (
        <Badge
          className="text-sm"
          key={query}
          variant="outline"
        >
          <a
            href={`https://appfigures.com/reports/keyword-inspector?keyword=${encodeURIComponent(query)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-muted-foreground hover:text-foreground "
          >
            {query}
            <ExternalLink className="h-3 w-3" />
          </a>
        </Badge>
      ))}
    </div>
  );
}
