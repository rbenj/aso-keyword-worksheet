import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell, LabelList } from 'recharts';

interface RankChartData {
  idealRank: number;
  deviation: number;
  keyword: string;
}

interface RankChartProps {
  rankChartData: RankChartData[];
  keywords: string[];
}

export function RankChart({ rankChartData, keywords }: RankChartProps) {
  if (keywords.length === 0) {
    return null;
  }

  return (
    <ChartContainer
      config={{
        deviation: {
          label: 'Deviation',
        },
      }}
    >
      <BarChart
        accessibilityLayer
        data={rankChartData}
        margin={{ top: 20, right: 10, left: 0, bottom: 0 }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="idealRank"
          type="number"
          label={{ value: 'Ideal Rank', position: 'insideBottom', offset: -5 }}
          domain={[1, keywords.length]}
        />
        <YAxis
          label={{ value: 'Deviation from Ideal', angle: -90, position: 'insideLeft' }}
          domain={['auto', 'auto']}
          allowDataOverflow={false}
        />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              hideLabel
              hideIndicator
              labelFormatter={(_value, payload) => {
                if (payload && payload[0]?.payload?.keyword) {
                  const item = payload[0].payload;
                  const deviation = item.deviation;
                  const idealRank = item.idealRank;
                  const ownedRank = idealRank + deviation;
                  return (
                    <div>
                      <div className="font-medium">Keyword: {item.keyword}</div>
                      <div className="text-muted-foreground">
                        Ideal: {idealRank}, Owned: {ownedRank > keywords.length ? 'Missing' : ownedRank}
                      </div>
                      <div className={deviation === 0 ? 'text-green-600' : deviation > 0 ? 'text-orange-600' : 'text-blue-600'}>
                        Deviation: {deviation > 0 ? '+' : ''}{deviation}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
          }
        />
        <Bar dataKey="deviation">
          <LabelList
            position="top"
            dataKey="keyword"
            fillOpacity={1}
            className="text-xs"
          />
          {rankChartData.map((item, index) => (
            <Cell
              key={`cell-${index}`}
              fill={
                item.deviation === 0
                  ? 'hsl(var(--chart-3))' // Green for perfect match
                  : item.deviation > 0
                    ? 'hsl(var(--chart-2))' // Orange/red for later than ideal
                    : 'hsl(var(--chart-1))' // Blue for earlier than ideal
              }
            />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
