import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface QueryFormProps {
  onAdd: () => void;
  onSearchQueryCompetitivenessChange: (value: string) => void;
  onSearchQueryPopularityChange: (value: string) => void;
  onSearchQueryTextChange: (value: string) => void;
  searchQueryCompetitiveness: string;
  searchQueryPopularity: string;
  searchQueryText: string;
}

export function QueryForm({
  onAdd,
  onSearchQueryCompetitivenessChange,
  onSearchQueryPopularityChange,
  onSearchQueryTextChange,
  searchQueryCompetitiveness,
  searchQueryPopularity,
  searchQueryText,
}: QueryFormProps) {
  return (
    <div className="space-y-2">
      <div className="flex-1 space-y-2">
        <Label htmlFor="addSearchQueryText">Search Query</Label>
        <Input
          id="addSearchQueryText"
          onChange={e => onSearchQueryTextChange(e.target.value)}
          value={searchQueryText}
        />
      </div>

      <div className="flex gap-2 items-end">
        <div className="flex-1 max-w-35 space-y-2">
          <Label htmlFor="addSearchQueryPopularity">Popularity</Label>
          <Input
            id="addSearchQueryPopularity"
            max="100"
            min="0"
            onChange={e => onSearchQueryPopularityChange(e.target.value)}
            type="number"
            value={searchQueryPopularity}
          />
        </div>

        <div className="flex-1 max-w-35 space-y-2">
          <Label htmlFor="addSearchQueryCompetitiveness">Competitiveness</Label>
          <Input
            id="addSearchQueryCompetitiveness"
            max="100"
            min="0"
            onChange={e => onSearchQueryCompetitivenessChange(e.target.value)}
            type="number"
            value={searchQueryCompetitiveness}
          />
        </div>

        <Button className="ml-auto" id="addSearchQueryButton" onClick={onAdd}>Add</Button>
      </div>
    </div>
  );
}
