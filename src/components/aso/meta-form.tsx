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
      <h2>
        App Meta
      </h2>

      <p>
        These fields align with your app's information in App Store Connect. Keywords lose power from top to bottom and left to right. A keyword at the start of your app's name is worth much more than a keyword at the end of your keyword list.
      </p>

      <div className="space-y-2">
        <Label htmlFor="metaTitle">Name</Label>
        <Input
          id="metaTitle"
          value={metaName}
          onChange={e => onMetaNameChange(e.target.value)}
          maxLength={30}
        />
        <div className="text-xs text-muted-foreground text-right">
          {metaName.length}/30
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="metaSubTitle">Subtitle</Label>
        <Input
          id="metaSubTitle"
          value={metaSubtitle}
          onChange={e => onMetaSubtitleChange(e.target.value)}
          maxLength={30}
        />
        <div className="text-xs text-muted-foreground text-right">
          {metaSubtitle.length}/30
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select value={selectedCategory} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-[180px]">
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
        <div className="space-y-2">
          <Label htmlFor="gameCategory">Game Category</Label>
          <Select value={selectedGameCategory} onValueChange={onGameCategoryChange}>
            <SelectTrigger className="w-[180px]">
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

      <div className="space-y-2">
        <Label htmlFor="metaKeywords">Keyword List (single words, comma seperated, no spaces)</Label>
        <Input
          id="metaKeywords"
          value={metaKeywords}
          onChange={e => onMetaKeywordsChange(e.target.value)}
          maxLength={100}
        />
        <div className="text-xs text-muted-foreground text-right">
          {metaKeywords.length}/100
        </div>
      </div>
    </div>
  );
}
