import pluralize from 'pluralize';
import { useState, useMemo } from 'react';
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GripVertical } from 'lucide-react';

interface Phrase {
  id: number;
  text: string;
  score: string;
}

const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'app',
  'are', "aren't", 'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between',
  'both', 'but', 'by', "can't", 'cannot', 'could', "couldn't", 'did', "didn't", 'do', 'does',
  "doesn't", 'doing', "don't", 'down', 'during', 'each', 'few', 'for', 'from', 'further', 'had',
  "hadn't", 'has', "hasn't", 'have', "haven't", 'having', 'he', "he'd", "he'll", "he's", 'her',
  'here', "here's", 'hers', 'herself', 'him', 'himself', 'his', 'how', "how's", 'i', "i'd",
  "i'll", "i'm", "i've", 'if', 'in', 'into', 'is', "isn't", 'it', "it's", 'its', 'itself',
  "let's", 'me', 'more', 'most', "mustn't", 'my', 'myself', 'no', 'nor', 'not', 'of', 'off',
  'on', 'once', 'only', 'or', 'other', 'ought', 'our', 'ours', 'ourselves', 'out', 'over',
  'own', 'same', "shan't", 'she', "she'd", "she'll", "she's", 'should', "shouldn't", 'so',
  'some', 'such', 'than', 'that', "that's", 'the', 'their', 'theirs', 'them', 'themselves',
  'then', 'there', "there's", 'these', 'they', "they'd", "they'll", "they're", "they've",
  'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', "wasn't",
  'we', "we'd", "we'll", "we're", "we've", 'were', "weren't", 'what', "what's", 'when',
  "when's", 'where', "where's", 'which', 'while', 'who', "who's", 'whom', 'why', "why's",
  'with', "won't", 'would', "wouldn't", 'you', "you'd", "you'll", "you're", "you've", 'your',
  'yours', 'yourself', 'yourselves',
]);

function PhraseItem({ phrase }: { phrase: Phrase }) {
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: phrase.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between p-2 border rounded bg-background"
    >
      <div className="flex items-center gap-2">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
        >
          <GripVertical className="h-4 w-4" />
        </button>

        <div className="font-medium">
          {phrase.text}
        </div>
      </div>

      <div className="text-sm text-muted-foreground">
        {phrase.score}
      </div>
    </div>
  );
}

function App() {
  const [phrases, setPhrases] = useState<Phrase[]>([]);
  const [phraseText, setPhraseText] = useState('');
  const [phraseScore, setPhraseScore] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // Extract unique words from all phrases (excluding stop words)
  const keywords = useMemo(() => {
    const allWords = phrases.flatMap(phrase =>
      phrase.text
        .split(/\s+/)
        .map(word => word.trim())
        .filter(word => word.length > 0)
        .filter(word => !STOP_WORDS.has(word.toLowerCase())),
    );

    // Remove duplicates by converting to a Set and then back to an array
    return Array.from(new Set(allWords));
  }, [phrases]);

  // Generate unused phrase combinations using pluralization
  const unusedPhrases = useMemo(() => {
    if (phrases.length === 0) return [];

    // Get existing phrase texts (normalized to lowercase for comparison)
    const existingPhrases = new Set(
      phrases.map(phrase => phrase.text.toLowerCase().trim())
    );

    const combinations: string[] = [];

    // Go through each phrase and generate plural variations
    for (const phrase of phrases) {
      const words = phrase.text
        .split(/\s+/)
        .map(word => word.trim())
        .filter(word => word.length > 0);

      if (words.length === 0) continue;

      // Generate all combinations where at least one word is pluralized
      // For each word, we can either keep it or pluralize it
      // We need at least one pluralization (exclude the case where all are kept)
      const numWords = words.length;
      const numCombinations = Math.pow(2, numWords);

      for (let i = 1; i < numCombinations; i++) {
        // Skip i=0 (all words kept, no pluralization)
        const variation: string[] = [];
        for (let j = 0; j < numWords; j++) {
          const shouldPluralize = (i & (1 << j)) !== 0;
          if (shouldPluralize) {
            variation.push(pluralize(words[j]));
          } else {
            variation.push(words[j]);
          }
        }
        const newPhrase = variation.join(' ');
        combinations.push(newPhrase);
      }
    }

    // Filter out combinations that already exist in phrases
    const unused = combinations.filter(
      combo => !existingPhrases.has(combo.toLowerCase().trim())
    );

    // Remove duplicates and limit to 100 results
    const uniqueUnused = Array.from(new Set(unused));
    return uniqueUnused.slice(0, 100);
  }, [phrases]);

  const handleAddPhrase = () => {
    if (phraseText.trim() && phraseScore.trim()) {
      const newPhrase: Phrase = {
        id: Date.now(),
        text: phraseText.trim(),
        score: phraseScore.trim(),
      };
      setPhrases([...phrases, newPhrase]);
      setPhraseText('');
      setPhraseScore('');
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setPhrases((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <>
      <div className="w-full min-h-screen bg-background">
        <header className="w-full h-16">
          ASO Keyword Worksheet
        </header>

        <div className="w-full h-20 flex items-center px-4">
          <h1>
            Page Title
          </h1>
        </div>

        <div className="w-full flex gap-4 px-4">
          {/* Left col */}
          <div className="flex-1 flex flex-col gap-10">
            {/* Meta */}
            <div className="flex flex-col gap-4">
              <div className="space-y-2">
                <Label htmlFor="metaTitle">Title</Label>
                <Input id="metaTitle" defaultValue="---" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="metaSubTitle">Sub title</Label>
                <Input id="metaSubTitle" defaultValue="---" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="metaKeywords">Keywords</Label>
                <Input id="metaKeywords" defaultValue="---" />
              </div>
            </div>

            {/* Phrases */}
            <div>
              <h2>
                Phrases
              </h2>

              {/* Phrases Input */}
              <div className="space-y-2">
                <Input
                  id="addPhraseText"
                  onChange={e => setPhraseText(e.target.value)}
                  placeholder="Phrase text"
                  value={phraseText}
                />

                <Input
                  id="addPhraseScore"
                  onChange={e => setPhraseScore(e.target.value)}
                  placeholder="Phrase score"
                  value={phraseScore}
                />

                <Button id="addPhraseButton" onClick={handleAddPhrase}>
                  Add
                </Button>
              </div>

              {/* Phrases items */}
              <div className="mt-4 space-y-2">
                <DndContext
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                  sensors={sensors}
                >
                  <SortableContext
                    items={phrases.map(p => p.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {phrases.map(phrase => (
                      <PhraseItem key={phrase.id} phrase={phrase} />
                    ))}
                  </SortableContext>
                </DndContext>

                {phrases.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    Add a phrase to get started
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right col */}
          <div className="flex-1 flex flex-col gap-10">
            {/* Keywords */}
            <div>
              <h2>
                Keywords
              </h2>

              {/* Items */}
              <div className="flex flex-wrap gap-2">
                {keywords.length > 0 ? (
                  keywords.map((keyword, index) => (
                    <Badge key={index}>{keyword}</Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No keywords yet
                  </p>
                )}
              </div>
            </div>

            {/* Unused */}
            <div>
              <h2>
                Unused Phrases
              </h2>
            </div>

            {/* Items */}
            <div className="flex flex-wrap gap-2">
              {unusedPhrases.length > 0 ? (
                unusedPhrases.map((phrase, index) => (
                  <Badge key={index} variant="outline">
                    {phrase}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No unused phrases
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
