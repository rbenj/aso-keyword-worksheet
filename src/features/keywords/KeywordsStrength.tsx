import { Bar, BarChart, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartLegendContent, ChartLegend, type ChartConfig } from '@/components/ui/chart';

const truncate = (value: string, max: number) => {
  return value.length > max ? `${value.slice(0, max - 3)}…` : value;
};

interface KeywordsStrengthProps {
  keywords: string[];
  ownedKeywordsOrdered: string[];
}

export function KeywordsStrength({
  keywords,
  ownedKeywordsOrdered,
}: KeywordsStrengthProps) {
  if (keywords.length === 0) {
    return null;
  }

  const chartData = keywords.map((keyword, i) => {
    const filteredOwnedKeywords = ownedKeywordsOrdered.filter(k => keywords.includes(k));
    const actual = filteredOwnedKeywords.indexOf(keyword) !== -1 ? keywords.length - filteredOwnedKeywords.indexOf(keyword) : 0;
    const expected = keywords.length - i;

    return {
      actual: actual,
      expected: Math.max(0, expected - actual),
      keyword: keyword,
    };
  });

  const chartConfig = {
    actual: { label: 'Actual' },
    expected: { label: 'Expected' },
  } satisfies ChartConfig;

  return (
    <ChartContainer config={chartConfig} className="w-full max-w-lg">
      <BarChart
        accessibilityLayer
        data={chartData}
        layout="vertical"
        maxBarSize={30}
      >
        <Bar
          dataKey="actual"
          fill="var(--chart-2)"
          layout="vertical"
          stackId="a"
        />
        <Bar
          dataKey="expected"
          fill="var(--chart-1)"
          layout="vertical"
          stackId="a"
        />
        <ChartLegend
          content={<ChartLegendContent />}
        />
        <XAxis
          dataKey="actual"
          hide
          type="number"
        />
        <YAxis
          axisLine={false}
          dataKey="keyword"
          interval={0}
          tickFormatter={value => truncate(value, 10)}
          tickLine={false}
          tickMargin={10}
          type="category"
          width={80}
        />
      </BarChart>
    </ChartContainer>
  );
}
