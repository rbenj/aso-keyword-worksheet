import { Bar, BarChart, XAxis, YAxis } from 'recharts';
import type { Keyword } from '@/models/Keyword';
import { ChartContainer, ChartLegendContent, ChartLegend, type ChartConfig } from '@/components/ui/chart';

const truncate = (value: string, max: number) => {
  return value.length > max ? `${value.slice(0, max - 3)}…` : value;
};

interface TargetKeywordsChartProps {
  targetKeywords: Keyword[];
  metaKeywords: Keyword[];
}

export function TargetKeywordsChart({
  targetKeywords,
  metaKeywords,
}: TargetKeywordsChartProps) {
  if (targetKeywords.length === 0) {
    return null;
  }

  const chartData = targetKeywords.map((targetKeyword, i) => {
    const filteredMetaKeywords = metaKeywords.filter(metaKeyword =>
      targetKeywords.some(targetKeyword2 => targetKeyword2.text === metaKeyword.text),
    );
    const indexInFilteredMetaKeywords = filteredMetaKeywords.findIndex(
      metaKeyword => metaKeyword.text === targetKeyword.text,
    );
    const actual = indexInFilteredMetaKeywords >= 0
      ? targetKeywords.length - indexInFilteredMetaKeywords
      : 0;
    const expected = targetKeywords.length - i;

    return {
      actual: actual,
      expected: Math.max(0, expected - actual),
      keyword: targetKeyword.text,
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
