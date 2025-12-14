import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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
      <Input
        id="addSearchQueryText"
        onChange={e => onSearchQueryTextChange(e.target.value)}
        placeholder="Search query text"
        value={searchQueryText}
      />

      <div className="flex gap-2">
        <Input
          id="addSearchQueryPopularity"
          type="number"
          min="0"
          max="100"
          onChange={e => onSearchQueryPopularityChange(e.target.value)}
          placeholder="Popularity (0-100)"
          value={searchQueryPopularity}
        />

        <Input
          id="addSearchQueryCompetitiveness"
          type="number"
          min="0"
          max="100"
          onChange={e => onSearchQueryCompetitivenessChange(e.target.value)}
          placeholder="Competitiveness (0-100)"
          value={searchQueryCompetitiveness}
        />
      </div>

      <Button id="addSearchQueryButton" onClick={onAdd}>
        Add
      </Button>
    </div>
  );
}
