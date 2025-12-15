import { ChartContainer, type ChartConfig, ChartLegendContent, ChartLegend } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis } from 'recharts';

interface RankChartProps {
  keywords: string[];
  ownedKeywordsOrdered: string[];
}

export function RankChart({ keywords, ownedKeywordsOrdered }: RankChartProps) {
  if (keywords.length === 0) {
    return null;
  }

  const chartData = keywords.map((keyword, i) => {
    const filteredOwnedKeywords = ownedKeywordsOrdered.filter(k => keywords.includes(k));

    const actual = filteredOwnedKeywords.indexOf(keyword) !== -1 ? keywords.length - filteredOwnedKeywords.indexOf(keyword) : 0;
    const ideal = keywords.length - i;

    return {
      keyword: keyword,
      actual: actual,
      ideal: Math.max(0, ideal - actual),
    };
  });

  // console.log(chartData);

  const chartConfig = {
    actual: {
      label: 'Actual',
    },
    ideal: {
      label: 'Ideal',
    },
  } satisfies ChartConfig;

  const truncate = (value: string, max: number) =>
    value.length > max ? `${value.slice(0, max - 3)}…` : value;

  return (
    <ChartContainer config={chartConfig} className="w-full">
      <BarChart
        accessibilityLayer
        data={chartData}
        layout="vertical"
        maxBarSize={30}
      >
        <Bar dataKey="actual" stackId="a" fill="var(--chart-2)" layout="vertical" />
        <Bar dataKey="ideal" stackId="a" fill="var(--chart-1)" layout="vertical" />
        <ChartLegend content={<ChartLegendContent />} />
        <YAxis
          dataKey="keyword"
          type="category"
          tickLine={false}
          tickMargin={10}
          width={80}
          axisLine={false}
          tickFormatter={(value) => truncate(value, 10)}
        />
        <XAxis dataKey="actual" type="number" hide />
      </BarChart>
    </ChartContainer>
  );
}
