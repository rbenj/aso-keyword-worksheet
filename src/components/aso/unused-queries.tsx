import { Badges, type BadgeDef } from '@/components/Badges';

interface UnusedQueriesProps {
  unusedSearchQueries: string[];
}

export function UnusedQueries({ unusedSearchQueries }: UnusedQueriesProps) {
  const badges: BadgeDef[] = unusedSearchQueries.map(query => ({
    externalLink: `https://appfigures.com/reports/keyword-inspector?keyword=${encodeURIComponent(query)}`,
    isSecondary: true,
    label: query,
    showIcon: false,
  }));

  return (
    <Badges badges={badges} />
  );
}
