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

  // Extract unique words from all phrases
  const keywords = useMemo(() => {
    const allWords = phrases.flatMap(phrase =>
      phrase.text
        .split(/\s+/)
        .map(word => word.trim())
        .filter(word => word.length > 0),
    );

    // Remove duplicates by converting to a Set and then back to an array
    return Array.from(new Set(allWords));
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
            <div>
              <h2>
                Keywords
              </h2>

              {/* Keywords */}
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

            <div>
              Unused Phrases
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
