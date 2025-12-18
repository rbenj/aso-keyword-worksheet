import { closestCenter, DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Query } from '@/models/Query';
import { QueryItem } from './QueryItem';

interface QueryListProps {
  onClickDelete: (query: Query) => void;
  onClickEdit: (query: Query) => void;
  onReorder: (queries: Query[]) => void;
  queries: Query[];
}

export function QueryList({
  onClickDelete,
  onClickEdit,
  onReorder,
  queries,
}: QueryListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = queries.findIndex(q => q.id === active.id);
      const newIndex = queries.findIndex(q => q.id === over.id);
      onReorder(arrayMove(queries, oldIndex, newIndex));
    }
  };

  return (
    <div className="space-y-2 mt-4">
      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        sensors={sensors}
      >
        <SortableContext
          items={queries.map(p => p.id)}
          strategy={verticalListSortingStrategy}
        >
          {queries.map(query => (
            <QueryItem
              key={query.id}
              onClickDelete={() => onClickDelete(query)}
              onClickEdit={() => onClickEdit(query)}
              query={query}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}
