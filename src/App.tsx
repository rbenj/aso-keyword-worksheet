import pluralize from 'pluralize';
import * as React from 'react';
import { useState, useMemo, useEffect } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { GripVertical, AlertTriangle, Star, Shield, ExternalLink, Pencil, Trash2 } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell, LabelList } from 'recharts';
import { useMediaQuery } from '@/hooks/use-media-query';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { cn } from '@/lib/utils';
import { db, type AppState } from '@/lib/db';

interface SearchQuery {
  id: number;
  text: string;
  popularity?: number; // 0-100
  competitiveness?: number; // 0-100
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

// Add all stop words as uncountable to prevent pluralization
STOP_WORDS.forEach((word) => {
  pluralize.addUncountableRule(word);
});

const CATEGORIES = [
  'Books',
  'Business',
  'Developer Tools',
  'Education',
  'Entertainment',
  'Finance',
  'Food & Drink',
  'Games',
  'Graphics & Design',
  'Health & Fitness',
  'Lifestyle',
  'Magazines & Newspapers',
  'Medical',
  'Music',
  'Navigation',
  'News',
  'Photo & Video',
  'Productivity',
  'Reference',
  'Social Networking',
  'Shopping',
  'Sports',
  'Travel',
  'Utilities',
  'Weather',
];

const GAME_CATEGORIES = [
  'Action',
  'Adventure',
  'Board',
  'Card',
  'Casino',
  'Casual',
  'Family',
  'Music',
  'Puzzle',
  'Racing',
  'Role Playing',
  'Simulation',
  'Sports',
  'Strategy',
  'Trivia',
  'Word',
];

function SearchQueryItem({ searchQuery, onEdit, onDelete }: { searchQuery: SearchQuery; onEdit: () => void; onDelete: () => void }) {
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: searchQuery.id });

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
          {searchQuery.text}
        </div>
      </div>

      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        {searchQuery.popularity !== undefined && (
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4" />
            <span>{searchQuery.popularity}</span>
          </div>
        )}
        {searchQuery.competitiveness !== undefined && (
          <div className="flex items-center gap-1">
            <Shield className="h-4 w-4" />
            <span>{searchQuery.competitiveness}</span>
          </div>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="text-muted-foreground hover:text-foreground"
        >
          <Pencil className="h-4 w-4" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="text-muted-foreground hover:text-foreground"
        >
          <Trash2 className="h-4 w-4" />
        </button>
        <a
          href={`https://appfigures.com/reports/keyword-inspector?keyword=${encodeURIComponent(searchQuery.text)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-foreground"
          onClick={(e) => e.stopPropagation()}
        >
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}

interface WordAnalysis {
  word: string;
  type: 'normal' | 'stop' | 'wasted' | 'whitespace' | 'duplicate' | 'multiword' | 'plural';
  startIndex: number;
  endIndex: number;
}

interface MetaAnalysis {
  stopWords: Set<string>;
  wastedWords: Set<string>;
  duplicateKeywords: Set<string>;
  multiWordKeywords: Set<string>;
  pluralKeywords: Set<string>;
  wastedCharCount: number;
}

function EditSearchQueryDialog({
  searchQuery,
  open,
  onOpenChange,
  onSave
}: {
  searchQuery: SearchQuery | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (searchQuery: SearchQuery) => void;
}) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [text, setText] = useState('');
  const [popularity, setPopularity] = useState('');
  const [competitiveness, setCompetitiveness] = useState('');

  // Update form when searchQuery changes
  React.useEffect(() => {
    if (searchQuery) {
      setText(searchQuery.text);
      setPopularity(searchQuery.popularity?.toString() || '');
      setCompetitiveness(searchQuery.competitiveness?.toString() || '');
    }
  }, [searchQuery]);

  const handleSave = () => {
    if (!searchQuery || !text.trim()) return;

    // Normalize searchQuery: lowercase, trim, and remove extra whitespace
    const normalizedText = text
      .trim()
      .toLowerCase()
      .replace(/\s+/g, ' ');

    // Parse popularity (0-100)
    const popularityValue = popularity.trim()
      ? Math.max(0, Math.min(100, parseInt(popularity.trim(), 10) || 0))
      : undefined;

    // Parse competitiveness (0-100)
    const competitivenessValue = competitiveness.trim()
      ? Math.max(0, Math.min(100, parseInt(competitiveness.trim(), 10) || 0))
      : undefined;

    onSave({
      ...searchQuery,
      text: normalizedText,
      popularity: popularityValue,
      competitiveness: competitivenessValue,
    });
    onOpenChange(false);
  };

  if (!searchQuery) return null;

  const SearchQueryForm = ({ className }: { className?: string }) => (
    <form
      className={cn("grid items-start gap-4", className)}
      onSubmit={(e) => {
        e.preventDefault();
        handleSave();
      }}
    >
      <div className="grid gap-2">
        <Label htmlFor="edit-search-query-text">Search Query Text</Label>
        <Input
          id="edit-search-query-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Search query text"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="edit-search-query-popularity">Popularity (0-100)</Label>
        <Input
          id="edit-search-query-popularity"
          type="number"
          min="0"
          max="100"
          value={popularity}
          onChange={(e) => setPopularity(e.target.value)}
          placeholder="Popularity (0-100)"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="edit-search-query-competitiveness">Competitiveness (0-100)</Label>
        <Input
          id="edit-search-query-competitiveness"
          type="number"
          min="0"
          max="100"
          value={competitiveness}
          onChange={(e) => setCompetitiveness(e.target.value)}
          placeholder="Competitiveness (0-100)"
        />
      </div>
      <Button type="submit">Save changes</Button>
    </form>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit search query</DialogTitle>
            <DialogDescription>
              Make changes to your search query here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <SearchQueryForm />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Edit search query</DrawerTitle>
          <DrawerDescription>
            Make changes to your search query here. Click save when you're done.
          </DrawerDescription>
        </DrawerHeader>
        <SearchQueryForm className="px-4" />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function HighlightedText({ text, words }: { text: string; words: WordAnalysis[] }) {
  if (words.length === 0) {
    return <span>{text}</span>;
  }

  const parts: React.ReactElement[] = [];
  let lastIndex = 0;

  words.forEach((word, index) => {
    // Add text before this word
    if (word.startIndex > lastIndex) {
      parts.push(
        <span key={`text-${index}`}>{text.substring(lastIndex, word.startIndex)}</span>,
      );
    }

    // Add the highlighted word
    let bgColor = '';
    if (word.type === 'stop') {
      bgColor = 'bg-gray-200';
    } else if (word.type === 'wasted') {
      bgColor = 'bg-gray-400';
    } else if (word.type === 'whitespace') {
      bgColor = 'bg-red-200';
    } else if (word.type === 'duplicate') {
      bgColor = 'bg-purple-200';
    } else if (word.type === 'multiword') {
      bgColor = 'bg-red-800 text-white';
    } else if (word.type === 'plural') {
      bgColor = 'bg-blue-200';
    }
    parts.push(
      <span key={`word-${index}`} className={bgColor}>
        {word.word}
      </span>,
    );

    lastIndex = word.endIndex;
  });

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(<span key="text-end">{text.substring(lastIndex)}</span>);
  }

  return <span>{parts}</span>;
}

function App() {
  const [searchQueries, setSearchQueries] = useState<SearchQuery[]>([]);
  const [searchQueryText, setSearchQueryText] = useState('');
  const [searchQueryPopularity, setSearchQueryPopularity] = useState('');
  const [searchQueryCompetitiveness, setSearchQueryCompetitiveness] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedGameCategory, setSelectedGameCategory] = useState<string>('');
  const [metaName, setMetaName] = useState<string>('');
  const [metaSubtitle, setMetaSubtitle] = useState<string>('');
  const [metaKeywords, setMetaKeywords] = useState<string>('');
  const [editingSearchQuery, setEditingSearchQuery] = useState<SearchQuery | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // Load state from Dexie on mount
  useEffect(() => {
    const loadState = async () => {
      try {
        const savedState = await db.appState.get(1);
        if (savedState) {
          setSearchQueries(savedState.searchQueries || []);
          setSelectedCategory(savedState.selectedCategory || '');
          setSelectedGameCategory(savedState.selectedGameCategory || '');
          setMetaName(savedState.metaName || '');
          setMetaSubtitle(savedState.metaSubtitle || '');
          setMetaKeywords(savedState.metaKeywords || '');
        }
      } catch (error) {
        console.error('Failed to load state from database:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadState();
  }, []);

  // Persist state to Dexie whenever it changes
  useEffect(() => {
    if (isLoading) return; // Don't save during initial load

    const saveState = async () => {
      try {
        const state: AppState = {
          id: 1,
          searchQueries,
          selectedCategory,
          selectedGameCategory,
          metaName,
          metaSubtitle,
          metaKeywords,
        };
        await db.appState.put(state, 1);
      } catch (error) {
        console.error('Failed to save state to database:', error);
      }
    };

    saveState();
  }, [searchQueries, selectedCategory, selectedGameCategory, metaName, metaSubtitle, metaKeywords, isLoading]);

  // Extract unique words from all searchQueries (excluding stop words) and convert to singular
  const keywords = useMemo(() => {
    const allWords: string[] = [];

    // Extract words from searchQueries
    searchQueries.forEach((searchQuery) => {
      searchQuery.text
        .trim()
        .replace(/[^a-zA-Z0-9]/g, ' ')
        .split(/\s+/)
        .map(word => word.toLowerCase())
        .filter(word => word.length > 0)
        .filter(word => !STOP_WORDS.has(word))
        .map(word => pluralize.singular(word)) // Convert to singular
        .forEach(word => allWords.push(word));
    });

    // Remove duplicates by converting to a Set and then back to an array
    return Array.from(new Set(allWords));
  }, [searchQueries]);

  // Convert keywords to Set for faster lookup
  const keywordsSet = useMemo(() => new Set(keywords), [keywords]);

  // Extract and maintain owned keywords from meta fields (updated when meta changes)
  // This is cached to avoid re-extracting on every comparison
  // Order: name, subtitle, category (if not in name/subtitle), gameCategory (if not in name/subtitle), keywords
  const ownedKeywords = useMemo(() => {
    const owned = new Map<string, number>(); // Map to track counts for duplicate detection

    // Helper function to extract keywords from text and add to owned map
    const extractKeywords = (text: string) => {
      const regex = /\b\w+\b/g;
      let match;
      while ((match = regex.exec(text)) !== null) {
        const wordLower = match[0].toLowerCase();
        if (!STOP_WORDS.has(wordLower)) {
          const wordSingular = pluralize.singular(wordLower);
          owned.set(wordSingular, (owned.get(wordSingular) || 0) + 1);
        }
      }
    };

    // Helper function to check if a keyword is already in name or subtitle
    const isKeywordInNameOrSubtitle = (keyword: string): boolean => {
      const nameSubtitleText = [metaName, metaSubtitle].join(' ').toLowerCase();
      const regex = /\b\w+\b/g;
      let match;
      while ((match = regex.exec(nameSubtitleText)) !== null) {
        const wordLower = match[0].toLowerCase();
        const wordSingular = pluralize.singular(wordLower);
        if (wordSingular === keyword) {
          return true;
        }
      }
      return false;
    };

    // Extract from name and subtitle first
    extractKeywords(metaName);
    extractKeywords(metaSubtitle);

    // Extract from category (only if not already in name/subtitle)
    if (selectedCategory) {
      const categoryWords = selectedCategory
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]/g, ' ')
        .split(/\s+/)
        .filter(word => word.length > 0 && !STOP_WORDS.has(word));

      categoryWords.forEach((word) => {
        const wordSingular = pluralize.singular(word);
        if (!isKeywordInNameOrSubtitle(wordSingular)) {
          owned.set(wordSingular, (owned.get(wordSingular) || 0) + 1);
        }
      });
    }

    // Extract from game category (only if not already in name/subtitle)
    if (selectedGameCategory) {
      const gameCategoryWords = selectedGameCategory
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]/g, ' ')
        .split(/\s+/)
        .filter(word => word.length > 0 && !STOP_WORDS.has(word));

      gameCategoryWords.forEach((word) => {
        const wordSingular = pluralize.singular(word);
        if (!isKeywordInNameOrSubtitle(wordSingular)) {
          owned.set(wordSingular, (owned.get(wordSingular) || 0) + 1);
        }
      });
    }

    // Extract from keywords field
    extractKeywords(metaKeywords);

    return owned;
  }, [metaName, metaSubtitle, metaKeywords, selectedCategory, selectedGameCategory]);

  // Convert ownedKeywords to Set for faster lookup (without counts)
  const ownedKeywordsSet = useMemo(() => new Set(ownedKeywords.keys()), [ownedKeywords]);

  // Extract owned keywords in order to compute ranks
  // Order: name, subtitle, category (if not in name/subtitle), gameCategory (if not in name/subtitle), keywords
  const ownedKeywordsOrdered = useMemo(() => {
    const ordered: string[] = [];
    const seen = new Set<string>();

    // Helper function to extract keywords from text and add to ordered list
    const extractKeywords = (text: string) => {
      const regex = /\b\w+\b/g;
      let match;
      while ((match = regex.exec(text)) !== null) {
        const wordLower = match[0].toLowerCase();
        if (!STOP_WORDS.has(wordLower)) {
          const wordSingular = pluralize.singular(wordLower);
          if (!seen.has(wordSingular)) {
            ordered.push(wordSingular);
            seen.add(wordSingular);
          }
        }
      }
    };

    // Helper function to check if a keyword is already in name or subtitle
    const isKeywordInNameOrSubtitle = (keyword: string): boolean => {
      const nameSubtitleText = [metaName, metaSubtitle].join(' ').toLowerCase();
      const regex = /\b\w+\b/g;
      let match;
      while ((match = regex.exec(nameSubtitleText)) !== null) {
        const wordLower = match[0].toLowerCase();
        const wordSingular = pluralize.singular(wordLower);
        if (wordSingular === keyword) {
          return true;
        }
      }
      return false;
    };

    // Extract from name and subtitle first
    extractKeywords(metaName);
    extractKeywords(metaSubtitle);

    // Extract from category (only if not already in name/subtitle)
    if (selectedCategory) {
      const categoryWords = selectedCategory
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]/g, ' ')
        .split(/\s+/)
        .filter(word => word.length > 0 && !STOP_WORDS.has(word));

      categoryWords.forEach((word) => {
        const wordSingular = pluralize.singular(word);
        if (!isKeywordInNameOrSubtitle(wordSingular) && !seen.has(wordSingular)) {
          ordered.push(wordSingular);
          seen.add(wordSingular);
        }
      });
    }

    // Extract from game category (only if not already in name/subtitle)
    if (selectedGameCategory) {
      const gameCategoryWords = selectedGameCategory
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]/g, ' ')
        .split(/\s+/)
        .filter(word => word.length > 0 && !STOP_WORDS.has(word));

      gameCategoryWords.forEach((word) => {
        const wordSingular = pluralize.singular(word);
        if (!isKeywordInNameOrSubtitle(wordSingular) && !seen.has(wordSingular)) {
          ordered.push(wordSingular);
          seen.add(wordSingular);
        }
      });
    }

    // Extract from keywords field
    extractKeywords(metaKeywords);

    return ordered;
  }, [metaName, metaSubtitle, metaKeywords, selectedCategory, selectedGameCategory]);

  // Compute rank comparison chart data
  // Deviation = ownedRank - idealRank (positive = later than ideal, negative = earlier than ideal)
  const rankChartData = useMemo(() => {
    if (keywords.length === 0) { return []; }

    // Create a map of keyword to its rank in owned keywords (1-based)
    const ownedRankMap = new Map<string, number>();
    ownedKeywordsOrdered.forEach((keyword, index) => {
      ownedRankMap.set(keyword, index + 1);
    });

    const missingRank = keywords.length + 1;

    const data = keywords.map((keyword, idealIndex) => {
      const idealRank = idealIndex + 1; // 1-based ideal rank
      const ownedRank = ownedRankMap.get(keyword) ?? missingRank;
      const deviation = ownedRank - idealRank; // Positive = later, negative = earlier
      return {
        idealRank: idealRank,
        deviation: deviation,
        keyword: keyword,
      };
    });

    // Sort by idealRank
    return data.sort((a, b) => a.idealRank - b.idealRank);
  }, [keywords, ownedKeywordsOrdered]);

  // Find which keywords are satisfied (appear in meta fields)
  // Compare using singularized versions since Apple treats plurals and non-plurals the same
  const satisfiedKeywords = useMemo(() => {
    const satisfied = new Set<string>();

    keywords.forEach((keyword) => {
      // Check if keyword appears in owned keywords
      if (ownedKeywordsSet.has(keyword)) {
        satisfied.add(keyword);
      }
    });

    return satisfied;
  }, [keywords, ownedKeywordsSet]);

  // Find duplicate needed keywords across all meta fields
  // Compare using singularized versions since Apple treats plurals and non-plurals the same
  const duplicateKeywords = useMemo(() => {
    const duplicates = new Set<string>();

    // Check owned keywords that are also in needed keywords and appear more than once
    ownedKeywords.forEach((count, keyword) => {
      if (keywordsSet.has(keyword) && count > 1) {
        duplicates.add(keyword);
      }
    });

    return duplicates;
  }, [ownedKeywords, keywordsSet]);

  // Analyze words in a text string
  const analyzeText = (text: string): WordAnalysis[] => {
    const words: WordAnalysis[] = [];
    const regex = /\b\w+\b/g;
    let match;

    while ((match = regex.exec(text)) !== null) {
      const word = match[0];
      const wordLower = word.toLowerCase();
      const wordSingular = pluralize.singular(wordLower);
      let type: 'normal' | 'stop' | 'wasted' | 'duplicate' = 'normal';

      if (STOP_WORDS.has(wordLower)) {
        type = 'stop';
      } else {
        // Compare using singularized version
        const isInKeywords = keywordsSet.has(wordSingular);
        const isDuplicate = duplicateKeywords.has(wordSingular);

        if (!isInKeywords) {
          type = 'wasted';
        } else if (isDuplicate) {
          type = 'duplicate';
        }
      }

      words.push({
        word: word,
        type,
        startIndex: match.index,
        endIndex: match.index + word.length,
      });
    }

    return words;
  };

  // Analyze keywords field with whitespace detection
  const analyzeKeywords = (text: string): WordAnalysis[] => {
    const analyses: WordAnalysis[] = [];

    // Find all matches (words and whitespace) in order
    const allMatches: Array<{ text: string; index: number; isWhitespace: boolean }> = [];

    // Find all words
    const wordRegex = /\b\w+\b/g;
    let match;
    while ((match = wordRegex.exec(text)) !== null) {
      allMatches.push({
        text: match[0],
        index: match.index,
        isWhitespace: false,
      });
    }

    // Find all whitespace
    const whitespaceRegex = /\s+/g;
    while ((match = whitespaceRegex.exec(text)) !== null) {
      allMatches.push({
        text: match[0],
        index: match.index,
        isWhitespace: true,
      });
    }

    // Sort by index
    allMatches.sort((a, b) => a.index - b.index);

    // Process matches and create analyses
    allMatches.forEach((match) => {
      if (match.isWhitespace) {
        analyses.push({
          word: match.text,
          type: 'whitespace',
          startIndex: match.index,
          endIndex: match.index + match.text.length,
        });
      } else {
        const wordLower = match.text.toLowerCase();
        const wordSingular = pluralize.singular(wordLower);
        const isPlural = wordSingular !== wordLower;
        let type: 'normal' | 'stop' | 'wasted' | 'duplicate' | 'plural' = 'normal';

        if (STOP_WORDS.has(wordLower)) {
          type = 'stop';
        } else {
          // Compare using singularized version
          const isInKeywords = keywordsSet.has(wordSingular);
          const isDuplicate = duplicateKeywords.has(wordSingular);

          if (!isInKeywords) {
            type = 'wasted';
          } else if (isDuplicate) {
            type = 'duplicate';
          } else if (isPlural) {
            type = 'plural';
          }
        }

        analyses.push({
          word: match.text,
          type,
          startIndex: match.index,
          endIndex: match.index + match.text.length,
        });
      }
    });

    // Detect multi-word sequences (2+ words separated by single spaces)
    // Find sequences like: word space word (space word)*
    const multiWordSequences: Array<{ startIndex: number; endIndex: number; text: string }> = [];

    for (let i = 0; i < allMatches.length - 2; i++) {
      const current = allMatches[i];
      const next = allMatches[i + 1];
      const afterNext = allMatches[i + 2];

      // Check if we have: word + single space + word
      if (!current.isWhitespace &&
        next.isWhitespace &&
        next.text === ' ' && // single space only
        !afterNext.isWhitespace) {

        // Found start of multi-word sequence
        const sequenceStart = current.index;
        let sequenceText = current.text;
        let sequenceEnd = afterNext.index + afterNext.text.length;
        sequenceText += ' ' + afterNext.text;

        // Continue checking for more words in the sequence
        let j = i + 3;
        while (j < allMatches.length - 1) {
          const checkSpace = allMatches[j];
          const checkWord = allMatches[j + 1];

          if (checkSpace.isWhitespace &&
            checkSpace.text === ' ' &&
            !checkWord.isWhitespace) {
            sequenceEnd = checkWord.index + checkWord.text.length;
            sequenceText += ' ' + checkWord.text;
            j += 2;
          } else {
            break;
          }
        }

        multiWordSequences.push({
          startIndex: sequenceStart,
          endIndex: sequenceEnd,
          text: sequenceText,
        });
      }
    }

    // Mark all analyses that are part of multi-word sequences (only words, not whitespace)
    multiWordSequences.forEach((sequence) => {
      analyses.forEach((analysis) => {
        if (analysis.startIndex >= sequence.startIndex &&
          analysis.endIndex <= sequence.endIndex &&
          analysis.type !== 'whitespace') {
          analysis.type = 'multiword';
        }
      });
    });

    return analyses;
  };

  // Analyze all meta fields
  const metaAnalysis = useMemo((): MetaAnalysis => {
    const stopWords = new Set<string>();
    const wastedWords = new Set<string>();
    const multiWordKeywords = new Set<string>();
    const pluralKeywords = new Set<string>();
    let wastedCharCount = 0;

    // Analyze name and subtitle
    [metaName, metaSubtitle].forEach((text) => {
      const words = analyzeText(text);
      words.forEach((word) => {
        const wordLower = word.word.toLowerCase();
        if (word.type === 'stop') {
          stopWords.add(wordLower);
          wastedCharCount += word.word.length;
        } else if (word.type === 'wasted') {
          wastedWords.add(wordLower);
          wastedCharCount += word.word.length;
        }
      });
    });

    // Analyze keywords (includes whitespace and multi-word detection)
    const keywordsAnalysis = analyzeKeywords(metaKeywords);

    // Extract multi-word sequences from the analysis
    let currentSequence: string[] = [];
    keywordsAnalysis.forEach((item) => {
      const wordLower = item.word.toLowerCase();

      if (item.type === 'multiword') {
        if (item.word.match(/\s/)) {
          // It's whitespace, skip
        } else {
          // It's a word in a multi-word sequence
          currentSequence.push(item.word);
        }
      } else {
        // End of sequence or not part of multi-word
        if (currentSequence.length > 1) {
          multiWordKeywords.add(currentSequence.join(' '));
        }
        currentSequence = [];
      }

      if (item.type === 'stop') {
        stopWords.add(wordLower);
        wastedCharCount += item.word.length;
      } else if (item.type === 'wasted') {
        wastedWords.add(wordLower);
        wastedCharCount += item.word.length;
      } else if (item.type === 'whitespace') {
        wastedCharCount += item.word.length;
      } else if (item.type === 'plural') {
        pluralKeywords.add(item.word);
      }
    });

    // Handle case where multi-word sequence is at the end
    if (currentSequence.length > 1) {
      multiWordKeywords.add(currentSequence.join(' '));
    }

    return {
      stopWords,
      wastedWords,
      duplicateKeywords,
      multiWordKeywords,
      pluralKeywords,
      wastedCharCount,
    };
  }, [metaName, metaSubtitle, metaKeywords, keywordsSet, duplicateKeywords]);

  // Generate unused searchQuery combinations using pluralization
  const unusedSearchQueries = useMemo(() => {
    if (searchQueries.length === 0) { return []; }

    // Get existing searchQuery texts (already normalized: lowercase, trimmed, single spaces)
    const existingSearchQueries = new Set(
      searchQueries.map(searchQuery => searchQuery.text),
    );

    const combinations: string[] = [];

    // Go through each searchQuery and generate plural variations
    for (const searchQuery of searchQueries) {
      const words = searchQuery.text
        .split(/\s+/)
        .map(word => word.trim())
        .filter(word => word.length > 0);

      if (words.length === 0) { continue; }

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
            const word = words[j];
            // Only pluralize if the word ends with a-z
            if (/[a-z]$/i.test(word)) {
              variation.push(pluralize(word));
            } else {
              variation.push(word);
            }
          } else {
            variation.push(words[j]);
          }
        }
        const newSearchQuery = variation.join(' ');
        combinations.push(newSearchQuery);
      }
    }

    // Filter out combinations that already exist in searchQueries
    // Normalize combinations: lowercase, trim, and remove extra whitespace
    const unused = combinations
      .map(combo => combo.trim().toLowerCase().replace(/\s+/g, ' '))
      .filter(combo => !existingSearchQueries.has(combo));

    // Remove duplicates and limit to 100 results
    const uniqueUnused = Array.from(new Set(unused));
    return uniqueUnused.slice(0, 100);
  }, [searchQueries]);

  const handleAddSearchQuery = () => {
    if (searchQueryText.trim()) {
      // Normalize searchQuery: lowercase, trim, and remove extra whitespace
      const normalizedText = searchQueryText
        .trim()
        .toLowerCase()
        .replace(/\s+/g, ' ');

      // Parse popularity (0-100)
      const popularity = searchQueryPopularity.trim()
        ? Math.max(0, Math.min(100, parseInt(searchQueryPopularity.trim(), 10) || 0))
        : undefined;

      // Parse competitiveness (0-100)
      const competitiveness = searchQueryCompetitiveness.trim()
        ? Math.max(0, Math.min(100, parseInt(searchQueryCompetitiveness.trim(), 10) || 0))
        : undefined;

      const newSearchQuery: SearchQuery = {
        id: Date.now(),
        text: normalizedText,
        popularity,
        competitiveness,
      };
      setSearchQueries([...searchQueries, newSearchQuery]);
      setSearchQueryText('');
      setSearchQueryPopularity('');
      setSearchQueryCompetitiveness('');
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setSearchQueries((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    if (value !== 'Games') {
      setSelectedGameCategory('');
    }
  };

  const handleEditSearchQuery = (searchQuery: SearchQuery) => {
    setEditingSearchQuery(searchQuery);
    setIsEditDialogOpen(true);
  };

  const handleSaveSearchQuery = (updatedSearchQuery: SearchQuery) => {
    setSearchQueries((prevSearchQueries) =>
      prevSearchQueries.map((p) => (p.id === updatedSearchQuery.id ? updatedSearchQuery : p))
    );
    setEditingSearchQuery(null);
  };

  const handleDeleteSearchQuery = (searchQueryId: number) => {
    setSearchQueries((prevSearchQueries) => prevSearchQueries.filter((p) => p.id !== searchQueryId));
  };

  return (
    <>
      <div className="w-full min-h-screen bg-background">
        <header className="w-full h-16">
          ASO Keyword Worksheet
        </header>

        <div className="w-full h-20 flex items-center px-4">
          <h1>
            Worksheet
          </h1>

          <p>
            This worksheet is intended to be used in conjunction with Appfigures while doing keyword research. This <a href="https://appfigures.com/resources/guides/which-keywords-to-optimize-for" target="_blank">Appfigures blog post</a> outlines the general approach.
          </p>
        </div>

        <div className="w-full flex gap-4 px-4">
          {/* Left col */}
          <div className="flex-1 flex flex-col gap-10">
            {/* Meta */}
            <div className="flex flex-col gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={selectedCategory} onValueChange={handleCategoryChange}>
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
                  <Select value={selectedGameCategory} onValueChange={setSelectedGameCategory}>
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
                <Label htmlFor="metaTitle">Name</Label>
                <Input
                  id="metaTitle"
                  value={metaName}
                  onChange={e => setMetaName(e.target.value)}
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
                  onChange={e => setMetaSubtitle(e.target.value)}
                  maxLength={30}
                />
                <div className="text-xs text-muted-foreground text-right">
                  {metaSubtitle.length}/30
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="metaKeywords">Keywords</Label>
                <Input
                  id="metaKeywords"
                  value={metaKeywords}
                  onChange={e => setMetaKeywords(e.target.value)}
                  maxLength={100}
                />
                <div className="text-xs text-muted-foreground text-right">
                  {metaKeywords.length}/100
                </div>
              </div>

              {/* Analysis Box */}
              {(metaName || metaSubtitle || metaKeywords || metaAnalysis.stopWords.size > 0 || metaAnalysis.wastedWords.size > 0 || metaAnalysis.duplicateKeywords.size > 0 || metaAnalysis.multiWordKeywords.size > 0 || metaAnalysis.pluralKeywords.size > 0 || metaAnalysis.wastedCharCount > 0 || /[A-Z]/.test(metaKeywords)) && (
                <div className="p-4 border rounded bg-muted">
                  <h3 className="font-semibold mb-4">Analysis</h3>

                  {/* Preview Section */}
                  {(metaName || metaSubtitle || metaKeywords) && (
                    <div className="mb-4 space-y-2">
                      <h4 className="text-sm font-medium mb-2">Preview:</h4>
                      {metaName && (
                        <div className="text-sm">
                          <HighlightedText text={metaName} words={analyzeText(metaName)} />
                        </div>
                      )}
                      {metaSubtitle && (
                        <div className="text-sm">
                          <HighlightedText text={metaSubtitle} words={analyzeText(metaSubtitle)} />
                        </div>
                      )}
                      {metaKeywords && (
                        <div className="text-sm">
                          <HighlightedText text={metaKeywords} words={analyzeKeywords(metaKeywords)} />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Analysis Section */}
                  {(metaAnalysis.stopWords.size > 0 || metaAnalysis.wastedWords.size > 0 || metaAnalysis.duplicateKeywords.size > 0 || metaAnalysis.multiWordKeywords.size > 0 || metaAnalysis.pluralKeywords.size > 0 || metaAnalysis.wastedCharCount > 0 || /[A-Z]/.test(metaKeywords)) && (
                    <div className="space-y-3">
                      {/[A-Z]/.test(metaKeywords) && (
                        <div className="flex items-center gap-2 p-2 bg-yellow-100 border border-yellow-300 rounded">
                          <AlertTriangle className="h-4 w-4 text-yellow-600 flex-shrink-0" />
                          <p className="text-sm text-yellow-800">Keywords field contains uppercase characters. Apple keywords should be lowercase.</p>
                        </div>
                      )}
                      {metaAnalysis.pluralKeywords.size > 0 && (
                        <div>
                          <p className="text-sm font-medium mb-1">Plural Keywords (Apple treats plurals and non-plurals the same):</p>
                          <div className="flex flex-wrap gap-1">
                            {Array.from(metaAnalysis.pluralKeywords).map((keyword, index) => (
                              <Badge key={index} variant="outline" className="bg-blue-200">
                                {keyword}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {metaAnalysis.multiWordKeywords.size > 0 && (
                        <div>
                          <p className="text-sm font-medium mb-1">Multi-Word Keywords (should be single words):</p>
                          <div className="flex flex-wrap gap-1">
                            {Array.from(metaAnalysis.multiWordKeywords).map((keyword, index) => (
                              <Badge key={index} variant="outline" className="bg-red-800 text-white">
                                {keyword}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {metaAnalysis.duplicateKeywords.size > 0 && (
                        <div>
                          <p className="text-sm font-medium mb-1">Duplicate Keywords:</p>
                          <div className="flex flex-wrap gap-1">
                            {Array.from(metaAnalysis.duplicateKeywords).map((word, index) => (
                              <Badge key={index} variant="outline" className="bg-purple-200">
                                {word}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {metaAnalysis.stopWords.size > 0 && (
                        <div>
                          <p className="text-sm font-medium mb-1">Stop Words Found:</p>
                          <div className="flex flex-wrap gap-1">
                            {Array.from(metaAnalysis.stopWords).map((word, index) => (
                              <Badge key={index} variant="outline" className="bg-gray-200">
                                {word}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {metaAnalysis.wastedWords.size > 0 && (
                        <div>
                          <p className="text-sm font-medium mb-1">Wasted Words (not in needed keywords):</p>
                          <div className="flex flex-wrap gap-1">
                            {Array.from(metaAnalysis.wastedWords).map((word, index) => (
                              <Badge key={index} variant="outline" className="bg-gray-400">
                                {word}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {metaAnalysis.wastedCharCount > 0 && (
                        <div>
                          <p className="text-sm font-medium">
                            Wasted Character Count:
                            <span className="font-bold">{metaAnalysis.wastedCharCount}</span>
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Search Queries */}
            <div>
              <h2>
                Search Queries
              </h2>

              {/* Search Queries Input */}
              <div className="space-y-2">
                <Input
                  id="addSearchQueryText"
                  onChange={e => setSearchQueryText(e.target.value)}
                  placeholder="Search query text"
                  value={searchQueryText}
                />

                <div className="flex gap-2">
                  <Input
                    id="addSearchQueryPopularity"
                    type="number"
                    min="0"
                    max="100"
                    onChange={e => setSearchQueryPopularity(e.target.value)}
                    placeholder="Popularity (0-100)"
                    value={searchQueryPopularity}
                  />

                  <Input
                    id="addSearchQueryCompetitiveness"
                    type="number"
                    min="0"
                    max="100"
                    onChange={e => setSearchQueryCompetitiveness(e.target.value)}
                    placeholder="Competitiveness (0-100)"
                    value={searchQueryCompetitiveness}
                  />
                </div>

                <Button id="addSearchQueryButton" onClick={handleAddSearchQuery}>
                  Add
                </Button>
              </div>

              {/* Search Queries items */}
              <div className="mt-4 space-y-2">
                <DndContext
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                  sensors={sensors}
                >
                  <SortableContext
                    items={searchQueries.map(p => p.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {searchQueries.map(searchQuery => (
                      <SearchQueryItem
                        key={searchQuery.id}
                        searchQuery={searchQuery}
                        onEdit={() => handleEditSearchQuery(searchQuery)}
                        onDelete={() => handleDeleteSearchQuery(searchQuery.id)}
                      />
                    ))}
                  </SortableContext>
                </DndContext>

                {searchQueries.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    Add a search query to get started
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
                Keywords Needed in Meta
              </h2>

              {/* Items */}
              <div className="flex flex-wrap gap-2">
                {keywords.length > 0 ? (
                  keywords.map((keyword, index) => (
                    <Badge
                      key={index}
                      className={satisfiedKeywords.has(keyword) ? 'bg-green-200' : ''}
                    >
                      {keyword}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No keywords yet
                  </p>
                )}
              </div>
            </div>

            {/* Rank Comparison Chart */}
            {keywords.length > 0 && (
              <div>
                <h2>
                  Keyword Rank Comparison
                </h2>
                <Card>
                  <CardHeader>
                    <CardTitle>Ideal vs Owned Rank</CardTitle>
                    <CardDescription>
                      Compare the ideal keyword order with the actual order in meta fields
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={{
                        deviation: {
                          label: 'Deviation',
                        },
                      }}
                    >
                      <BarChart
                        accessibilityLayer
                        data={rankChartData}
                        margin={{ top: 20, right: 10, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid vertical={false} />
                        <XAxis
                          dataKey="idealRank"
                          type="number"
                          label={{ value: 'Ideal Rank', position: 'insideBottom', offset: -5 }}
                          domain={[1, keywords.length]}
                        />
                        <YAxis
                          label={{ value: 'Deviation from Ideal', angle: -90, position: 'insideLeft' }}
                          domain={['auto', 'auto']}
                          allowDataOverflow={false}
                        />
                        <ChartTooltip
                          cursor={false}
                          content={
                            <ChartTooltipContent
                              hideLabel
                              hideIndicator
                              labelFormatter={(_value, payload) => {
                                if (payload && payload[0]?.payload?.keyword) {
                                  const item = payload[0].payload;
                                  const deviation = item.deviation;
                                  const idealRank = item.idealRank;
                                  const ownedRank = idealRank + deviation;
                                  return (
                                    <div>
                                      <div className="font-medium">Keyword: {item.keyword}</div>
                                      <div className="text-muted-foreground">
                                        Ideal: {idealRank}, Owned: {ownedRank > keywords.length ? 'Missing' : ownedRank}
                                      </div>
                                      <div className={deviation === 0 ? 'text-green-600' : deviation > 0 ? 'text-orange-600' : 'text-blue-600'}>
                                        Deviation: {deviation > 0 ? '+' : ''}{deviation}
                                      </div>
                                    </div>
                                  );
                                }
                                return null;
                              }}
                            />
                          }
                        />
                        <Bar dataKey="deviation">
                          <LabelList
                            position="top"
                            dataKey="keyword"
                            fillOpacity={1}
                            className="text-xs"
                          />
                          {rankChartData.map((item, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={
                                item.deviation === 0
                                  ? 'hsl(var(--chart-3))' // Green for perfect match
                                  : item.deviation > 0
                                    ? 'hsl(var(--chart-2))' // Orange/red for later than ideal
                                    : 'hsl(var(--chart-1))' // Blue for earlier than ideal
                              }
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Unused */}
            <div>
              <h2>
                Unused Search Queries
              </h2>
            </div>

            {/* Items */}
            <div className="flex flex-wrap gap-2">
              {unusedSearchQueries.length > 0 ? (
                unusedSearchQueries.map((searchQuery, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="cursor-pointer hover:bg-muted"
                    asChild
                  >
                    <a
                      href={`https://appfigures.com/reports/keyword-inspector?keyword=${encodeURIComponent(searchQuery)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1"
                    >
                      {searchQuery}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No unused search queries
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <EditSearchQueryDialog
        searchQuery={editingSearchQuery}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSave={handleSaveSearchQuery}
      />
    </>
  );
}

export default App;
