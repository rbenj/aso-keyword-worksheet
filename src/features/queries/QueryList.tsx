import { closestCenter, DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { SearchQuery } from '@/lib/db';
import { QueryItem } from './QueryItem';

interface QueryListProps {
  onDelete: (searchQueryId: number) => void;
  onDragEnd: (event: DragEndEvent) => void;
  onEdit: (searchQuery: SearchQuery) => void;
  searchQueries: SearchQuery[];
}

export function QueryList({
  onDelete,
  onDragEnd,
  onEdit,
  searchQueries,
}: QueryListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  return (
    <div className="space-y-2 mt-4">
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
            <QueryItem
              key={searchQuery.id}
              onDelete={() => onDelete(searchQuery.id)}
              onEdit={() => onEdit(searchQuery)}
              searchQuery={searchQuery}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}
