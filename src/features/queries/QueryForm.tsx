import { useId, useState } from 'react';
import { Query } from '@/models/Query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface QueryFormProps {
  competitiveness?: number;
  id?: string;
  onSubmit: (query: Query) => void;
  popularity?: number;
  submitLabel: string;
  text?: string;
}

export function QueryForm({
  competitiveness,
  id,
  onSubmit,
  popularity,
  submitLabel,
  text = '',
}: QueryFormProps) {
  const [queryText, setQueryText] = useState(text);
  const [queryPopularity, setQueryPopularity] = useState(popularity);
  const [queryCompetitiveness, setQueryCompetitiveness] = useState(competitiveness);

  const elId = useId();
  const textFieldId = `${elId}-text`;
  const popularityFieldId = `${elId}-popularity`;
  const competitivenessFieldId = `${elId}-competitiveness`;

  const onChangeText = (value: string) => {
    setQueryText(value);
  };

  const onChangePopularity = (value: string) => {
    setQueryPopularity(Math.max(0, Math.min(100, parseInt(value, 10) || 0)));
  };

  const onChangeCompetitiveness = (value: string) => {
    setQueryCompetitiveness(Math.max(0, Math.min(100, parseInt(value, 10) || 0)));
  };

  const handleSubmit = () => {
    if (queryText.trim()) {
      const normalizedText = queryText
        .trim()
        .toLowerCase()
        .replace(/\s+/g, ' ');

      const popularity = queryPopularity ?? undefined;
      const competitiveness = queryCompetitiveness ?? undefined;

      onSubmit(new Query({
        id,
        text: normalizedText,
        popularity,
        competitiveness,
      }));

      setQueryText('');
      setQueryPopularity(undefined);
      setQueryCompetitiveness(undefined);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex-1 space-y-2">
        <Label htmlFor={textFieldId}>
          Search Query
        </Label>
        <Input
          id={textFieldId}
          onChange={event => onChangeText(event.target.value)}
          value={queryText}
        />
      </div>

      <div className="flex gap-2 items-end">
        <div className="flex-1 max-w-35 space-y-2">
          <Label htmlFor={popularityFieldId}>
            Popularity
          </Label>
          <Input
            className="w-20"
            id={popularityFieldId}
            max="100"
            min="0"
            onChange={event => onChangePopularity(event.target.value)}
            type="number"
            value={queryPopularity ?? ''}
          />
        </div>

        <div className="flex-1 max-w-35 space-y-2">
          <Label htmlFor={competitivenessFieldId}>
            Competitiveness
          </Label>
          <Input
            className="w-20"
            id={competitivenessFieldId}
            max="100"
            min="0"
            onChange={event => onChangeCompetitiveness(event.target.value)}
            type="number"
            value={queryCompetitiveness ?? ''}
          />
        </div>

        <Button
          className="ml-auto"
          disabled={!queryText.trim()}
          onClick={handleSubmit}
        >
          {submitLabel}
        </Button>
      </div>
    </div>
  );
}
