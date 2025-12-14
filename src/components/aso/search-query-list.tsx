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
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SearchQueryItem } from './search-query-item';
import type { SearchQuery } from '@/lib/db';

interface SearchQueryListProps {
  searchQueries: SearchQuery[];
  onEdit: (searchQuery: SearchQuery) => void;
  onDelete: (searchQueryId: number) => void;
  onDragEnd: (event: DragEndEvent) => void;
}

export function SearchQueryList({
  searchQueries,
  onEdit,
  onDelete,
  onDragEnd,
}: SearchQueryListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  return (
    <div className="mt-4 space-y-2">
      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={onDragEnd}
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
              onEdit={() => onEdit(searchQuery)}
              onDelete={() => onDelete(searchQuery.id)}
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
  );
}
