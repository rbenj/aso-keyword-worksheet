import { provider } from '@/aso-providers';
import { Badges, type BadgeDef } from '@/components/Badges';

interface AlternateQueriesProps {
  queries: string[];
}

export function AlternateQueries({
  queries,
}: AlternateQueriesProps) {
  const badges: BadgeDef[] = queries.map(query => ({
    externalLink: provider.getQueryURL(query),
    isSecondary: true,
    label: query,
    showIcon: false,
  }));

  return (
    <Badges badges={badges} />
  );
}
