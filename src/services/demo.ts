import { Meta, type Category, type CategoryGame } from '@/models/Meta';
import { Query } from '@/models/Query';

type DemoQuery = [string, number, number];

const DEMO_QUERIES: DemoQuery[] = [
  ['mega man', 42, 48],
  ['mega man game', 36, 54],
  ['old nintendo games', 20, 34],
  ['classic video games', 58, 85],
  ['difficult capcom games', 7, 32],
  ['rock man', 6, 14],
  ['8-bit side scroller', 5, 8],
];

const DEMO_META = {
  name: 'Mega Man 2: 8-Bit Classic',
  subtitle: 'Retro side scroller action',
  keywords: 'video,old,retro,nintendo,rock,nostalgic,challenging,pew,pixel',
  category: 'Games' as Category,
  categoryGame: 'Action' as CategoryGame,
};

export function applyDemoData(
  setMeta: React.Dispatch<React.SetStateAction<Meta>>,
  setQueries: React.Dispatch<React.SetStateAction<Query[]>>,
): void {
  setMeta(new Meta({
    category: DEMO_META.category,
    categoryGame: DEMO_META.categoryGame,
    keywords: DEMO_META.keywords,
    name: DEMO_META.name,
    subtitle: DEMO_META.subtitle,
  }));
  setQueries(DEMO_QUERIES.map(([text, popularity, competitiveness]) => new Query({
    text,
    popularity,
    competitiveness,
  })));
}
