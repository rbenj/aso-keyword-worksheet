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
        text: 'weather app',
        popularity: 95,
        competitiveness: 85,
      },
      {
        id: Date.now() + 2,
        text: 'weather forecast',
        popularity: 88,
        competitiveness: 75,
      },
      {
        id: Date.now() + 3,
        text: 'weather radar',
        popularity: 72,
        competitiveness: 60,
      },
      {
        id: Date.now() + 4,
        text: 'hourly weather',
        popularity: 65,
        competitiveness: 50,
      },
      {
        id: Date.now() + 5,
        text: 'local weather',
        popularity: 80,
        competitiveness: 70,
      },
      {
        id: Date.now() + 6,
        text: 'weather widget',
        popularity: 55,
        competitiveness: 45,
      },
    ];

    setSearchQueries(demoSearchQueries);
    setSelectedCategory('Weather');
    setSelectedGameCategory('');
    setMetaName('WeatherPro');
    setMetaSubtitle('Forecast & Radar');
    setMetaKeywords('weather,forecast,radar,hourly,local,temperature,conditions');
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
