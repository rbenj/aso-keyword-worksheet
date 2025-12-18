import { CATEGORIES, GAME_CATEGORIES } from '@/constants';
import { Meta, type Category, type CategoryGame } from '@/models/Meta';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface MetaFormProps {
  meta: Meta;
  onUpdate: (meta: Meta) => void;
}

export function MetaForm({
  meta,
  onUpdate,
}: MetaFormProps) {

  const handleNameChange = (value: string) => {
    onUpdate(meta.update({ name: value }));
  };

  const handleSubtitleChange = (value: string) => {
    onUpdate(meta.update({ subtitle: value }));
  };

  const handleKeywordsChange = (value: string) => {
    onUpdate(meta.update({ keywords: value }));
  };

  const handleCategoryChange = (value: string) => {
    onUpdate(meta.update({ category: value as Category }));
  };

  const handleCategoryGameChange = (value: string) => {
    onUpdate(meta.update({ categoryGame: value as CategoryGame }));
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="metaTitle">Name</Label>
          <span className="text-xs text-muted-foreground">
            {meta.name.length}/30
          </span>
        </div>
        <Input
          id="metaTitle"
          maxLength={30}
          onChange={e => handleNameChange(e.target.value)}
          value={meta.name}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="metaSubTitle">Subtitle</Label>
          <span className="text-xs text-muted-foreground">
            {meta.subtitle.length}/30
          </span>
        </div>
        <Input
          id="metaSubTitle"
          maxLength={30}
          onChange={e => handleSubtitleChange(e.target.value)}
          value={meta.subtitle}
        />
      </div>

      <div className="flex gap-4">
        <div className="space-y-2 flex-1">
          <Label htmlFor="category">Category</Label>
          <Select value={meta.category} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map(category => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {meta.category === 'Games' && (
          <div className="space-y-2 flex-1">
            <Label htmlFor="categoryGame">Game Category</Label>
            <Select value={meta.categoryGame} onValueChange={handleCategoryGameChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select game category" />
              </SelectTrigger>
              <SelectContent>
                {GAME_CATEGORIES.map(categoryGame => (
                  <SelectItem key={categoryGame} value={categoryGame}>
                    {categoryGame}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="metaKeywords">Keyword List</Label>
          <span className="text-xs text-muted-foreground">
            {meta.keywords.length}/100
          </span>
        </div>
        <Input
          id="metaKeywords"
          value={meta.keywords}
          onChange={e => handleKeywordsChange(e.target.value)}
          maxLength={100}
        />
      </div>
    </div>
  );
}
