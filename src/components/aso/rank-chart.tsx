import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis } from 'recharts';

interface RankChartProps {
  keywords: string[];
  ownedKeywordsOrdered: string[];
}

export function RankChart({ keywords, ownedKeywordsOrdered }: RankChartProps) {
  if (keywords.length === 0) {
    return null;
  }

  const chartData = keywords.map((keyword) => {
    return {
      keyword: keyword,
      ownedRank: ownedKeywordsOrdered.indexOf(keyword) !== -1 ? ownedKeywordsOrdered.indexOf(keyword) : 0,
    };
  });

  return (
    <ChartContainer
      config={{
        ownedRank: {
          label: 'Position in Owned Keywords',
        },
      }}
    >
      <BarChart
        accessibilityLayer
        data={chartData}
        layout="vertical"
        margin={{
          left: 0,
        }}
      >
        <YAxis
          dataKey="keyword"
          type="category"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />
        <XAxis dataKey="ownedRank" type="number" hide />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Bar dataKey="ownedRank" layout="vertical" radius={5} />
      </BarChart>
    </ChartContainer>
  );
}
