import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Star, Shield, ExternalLink, Pencil, Trash2 } from 'lucide-react';
import { Query } from '@/models/Query';
import { provider } from '@/aso-providers';

interface QueryItemProps {
  onClickDelete: () => void;
  onClickEdit: () => void;
  query: Query;
}

export function QueryItem({
  onClickDelete,
  onClickEdit,
  query,
}: QueryItemProps) {
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: query.id });

  const style = {
    opacity: isDragging ? 0.5 : 1,
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      className="flex flex-col justify-between gap-2 p-2 border rounded bg-background sm:flex-row sm:items-center md:flex-col md:items-start lg:flex-row lg:items-center"
      ref={setNodeRef}
      style={style}
    >
      <div className="flex items-center gap-2">
        <button
          className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </button>

        <div className="font-medium">{query.text}</div>
      </div>

      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        {query.popularity !== undefined && (
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4" />
            <span>{query.popularity}</span>
          </div>
        )}

        {query.competitiveness !== undefined && (
          <div className="flex items-center gap-1">
            <Shield className="w-4 h-4" />
            <span>{query.competitiveness}</span>
          </div>
        )}

        <button
          className="text-muted-foreground hover:text-foreground"
          onClick={(e) => {
            e.stopPropagation();
            onClickEdit();
          }}
        >
          <Pencil className="h-4 w-4" />
        </button>

        <button
          className="text-muted-foreground hover:text-foreground"
          onClick={(e) => {
            e.stopPropagation();
            onClickDelete();
          }}
        >
          <Trash2 className="h-4 w-4" />
        </button>

        <a
          className="text-muted-foreground hover:text-foreground"
          href={provider.getQueryURL(query.text)}
          onClick={e => e.stopPropagation()}
          rel="noopener noreferrer"
          target="_blank"
        >
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
