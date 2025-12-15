import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface SearchQueryFormProps {
  searchQueryText: string;
  searchQueryPopularity: string;
  searchQueryCompetitiveness: string;
  onSearchQueryTextChange: (value: string) => void;
  onSearchQueryPopularityChange: (value: string) => void;
  onSearchQueryCompetitivenessChange: (value: string) => void;
  onAdd: () => void;
}

export function SearchQueryForm({
  searchQueryText,
  searchQueryPopularity,
  searchQueryCompetitiveness,
  onSearchQueryTextChange,
  onSearchQueryPopularityChange,
  onSearchQueryCompetitivenessChange,
  onAdd,
}: SearchQueryFormProps) {
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
            type="number"
            min="0"
            max="100"
            onChange={e => onSearchQueryPopularityChange(e.target.value)}
            value={searchQueryPopularity}
          />
        </div>

        <div className="flex-1 max-w-35 space-y-2">
          <Label htmlFor="addSearchQueryCompetitiveness">Competitiveness</Label>
          <Input
            id="addSearchQueryCompetitiveness"
            type="number"
            min="0"
            max="100"
            onChange={e => onSearchQueryCompetitivenessChange(e.target.value)}
            value={searchQueryCompetitiveness}
          />
        </div>

        <Button className="ml-auto" id="addSearchQueryButton" onClick={onAdd}>
          Add
        </Button>
      </div>
    </div>
  );
}
