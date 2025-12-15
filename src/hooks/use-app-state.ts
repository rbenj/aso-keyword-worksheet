import { useState, useEffect } from 'react';
import { arrayMove, type DragEndEvent } from '@dnd-kit/sortable';
import { db, type AppState, type SearchQuery } from '@/lib/db';

export function useAppState() {
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
        console.error('Failed to load state from database:', error); // eslint-disable-line no-console
      } finally {
        setIsLoading(false);
      }
    };

    loadState();
  }, []);

  // Persist state to Dexie whenever it changes
  useEffect(() => {
    if (isLoading) { return; } // Don't save during initial load

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
        console.error('Failed to save state to database:', error); // eslint-disable-line no-console
      }
    };

    saveState();
  }, [searchQueries, selectedCategory, selectedGameCategory, metaName, metaSubtitle, metaKeywords, isLoading]);

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
    setSearchQueries(prevSearchQueries =>
      prevSearchQueries.map(p => (p.id === updatedSearchQuery.id ? updatedSearchQuery : p)),
    );
    setEditingSearchQuery(null);
  };

  const handleDeleteSearchQuery = (searchQueryId: number) => {
    setSearchQueries(prevSearchQueries => prevSearchQueries.filter(p => p.id !== searchQueryId));
  };

  const handleReset = () => {
    setSearchQueries([]);
    setSelectedCategory('');
    setSelectedGameCategory('');
    setMetaName('');
    setMetaSubtitle('');
    setMetaKeywords('');
  };

  const handleUseDemoData = () => {
    const demoSearchQueries: SearchQuery[] = [
      {
        id: Date.now() + 1,
        text: 'mega man',
        popularity: 42,
        competitiveness: 48,
      },
      {
        id: Date.now() + 2,
        text: 'mega man game',
        popularity: 36,
        competitiveness: 54,
      },
      {
        id: Date.now() + 3,
        text: 'old nintendo games',
        popularity: 20,
        competitiveness: 34,
      },
      {
        id: Date.now() + 4,
        text: 'classic video games',
        popularity: 58,
        competitiveness: 85,
      },
      {
        id: Date.now() + 6,
        text: 'difficult capcom games',
        popularity: 7,
        competitiveness: 32,
      },
      {
        id: Date.now() + 6,
        text: 'rock man',
        popularity: 6,
        competitiveness: 14,
      },
      {
        id: Date.now() + 5,
        text: '8-bit side scroller',
        popularity: 5,
        competitiveness: 8,
      },
    ];

    setSearchQueries(demoSearchQueries);
    setSelectedCategory('Games');
    setSelectedGameCategory('Action');
    setMetaName('Mega Man 2: 8-Bit Classic');
    setMetaSubtitle('Retro side scroller action');
    setMetaKeywords('video,old,retro,nintendo,rock,nostalgic,challenging,pew,pixel');
  };

  return {
    // State
    searchQueries,
    searchQueryText,
    searchQueryPopularity,
    searchQueryCompetitiveness,
    selectedCategory,
    selectedGameCategory,
    metaName,
    metaSubtitle,
    metaKeywords,
    editingSearchQuery,
    isEditDialogOpen,
    isLoading,
    // Setters
    setSearchQueryText,
    setSearchQueryPopularity,
    setSearchQueryCompetitiveness,
    setSelectedCategory,
    setSelectedGameCategory,
    setMetaName,
    setMetaSubtitle,
    setMetaKeywords,
    setIsEditDialogOpen,
    // Handlers
    handleAddSearchQuery,
    handleDragEnd,
    handleCategoryChange,
    handleEditSearchQuery,
    handleSaveSearchQuery,
    handleDeleteSearchQuery,
    handleReset,
    handleUseDemoData,
  };
}
