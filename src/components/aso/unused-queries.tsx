import { Badge } from '@/components/ui/badge';
import { ExternalLink } from 'lucide-react';

interface UnusedQueriesProps {
  unusedSearchQueries: string[];
}

export function UnusedQueries({ unusedSearchQueries }: UnusedQueriesProps) {
  return (
    <div>
      <h2>
        Unused Search Queries
      </h2>

      <p>
        A variation of your search query may have a very different popularity-to-competitiveness ratio. Check variations in word order and pluralization. Here are some possibilities, investigate these and any others that make sense.
      </p>

      <div className="flex flex-wrap gap-2">
        {unusedSearchQueries.length > 0 ? (
          unusedSearchQueries.map((searchQuery, index) => (
            <Badge
              key={index}
              variant="outline"
              className="cursor-pointer hover:bg-muted"
              asChild
            >
              <a
                href={`https://appfigures.com/reports/keyword-inspector?keyword=${encodeURIComponent(searchQuery)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1"
              >
                {searchQuery}
                <ExternalLink className="h-3 w-3" />
              </a>
            </Badge>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">
            No unused search queries
          </p>
        )}
      </div>
    </div>
  );
}
