import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CATEGORIES, GAME_CATEGORIES } from '@/constants/aso';

interface MetaFormProps {
  metaName: string;
  metaSubtitle: string;
  metaKeywords: string;
  selectedCategory: string;
  selectedGameCategory: string;
  onMetaNameChange: (value: string) => void;
  onMetaSubtitleChange: (value: string) => void;
  onMetaKeywordsChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onGameCategoryChange: (value: string) => void;
}

export function MetaForm({
  metaName,
  metaSubtitle,
  metaKeywords,
  selectedCategory,
  selectedGameCategory,
  onMetaNameChange,
  onMetaSubtitleChange,
  onMetaKeywordsChange,
  onCategoryChange,
  onGameCategoryChange,
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
          value={metaName}
          onChange={e => onMetaNameChange(e.target.value)}
          maxLength={30}
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
          value={metaSubtitle}
          onChange={e => onMetaSubtitleChange(e.target.value)}
          maxLength={30}
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
          <Label htmlFor="metaKeywords">Keyword List (single words, comma seperated, no spaces)</Label>
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
