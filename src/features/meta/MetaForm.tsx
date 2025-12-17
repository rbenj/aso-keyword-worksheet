import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CATEGORIES, GAME_CATEGORIES } from '@/constants';

interface MetaFormProps {
  metaKeywords: string;
  metaName: string;
  metaSubtitle: string;
  onCategoryChange: (value: string) => void;
  onGameCategoryChange: (value: string) => void;
  onMetaKeywordsChange: (value: string) => void;
  onMetaNameChange: (value: string) => void;
  onMetaSubtitleChange: (value: string) => void;
  selectedCategory: string;
  selectedGameCategory: string;
}

export function MetaForm({
  metaKeywords,
  metaName,
  metaSubtitle,
  onCategoryChange,
  onGameCategoryChange,
  onMetaKeywordsChange,
  onMetaNameChange,
  onMetaSubtitleChange,
  selectedCategory,
  selectedGameCategory,
}: MetaFormProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="metaTitle">Name</Label>
          <span className="text-xs text-muted-foreground">
            {metaName.length}/30
          </span>
        </div>
        <Input
          id="metaTitle"
          maxLength={30}
          onChange={e => onMetaNameChange(e.target.value)}
          value={metaName}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="metaSubTitle">Subtitle</Label>
          <span className="text-xs text-muted-foreground">
            {metaSubtitle.length}/30
          </span>
        </div>
        <Input
          id="metaSubTitle"
          maxLength={30}
          onChange={e => onMetaSubtitleChange(e.target.value)}
          value={metaSubtitle}
        />
      </div>

      <div className="flex gap-4">
        <div className="space-y-2 flex-1">
          <Label htmlFor="category">Category</Label>
          <Select value={selectedCategory} onValueChange={onCategoryChange}>
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

        {selectedCategory === 'Games' && (
          <div className="space-y-2 flex-1">
            <Label htmlFor="gameCategory">Game Category</Label>
            <Select value={selectedGameCategory} onValueChange={onGameCategoryChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select game category" />
              </SelectTrigger>
              <SelectContent>
                {GAME_CATEGORIES.map(gameCategory => (
                  <SelectItem key={gameCategory} value={gameCategory}>
                    {gameCategory}
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
            {metaKeywords.length}/100
          </span>
        </div>
        <Input
          id="metaKeywords"
          value={metaKeywords}
          onChange={e => onMetaKeywordsChange(e.target.value)}
          maxLength={100}
        />
      </div>
    </div>
  );
}
