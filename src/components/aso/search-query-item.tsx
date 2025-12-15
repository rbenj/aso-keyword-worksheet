import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Star, Shield, ExternalLink, Pencil, Trash2 } from 'lucide-react';
import type { SearchQuery } from '@/lib/db';

interface SearchQueryItemProps {
  searchQuery: SearchQuery;
  onEdit: () => void;
  onDelete: () => void;
}

export function SearchQueryItem({ searchQuery, onEdit, onDelete }: SearchQueryItemProps) {
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
      className="flex flex-col justify-between gap-2 p-2 border rounded bg-background sm:flex-row sm:items-center md:flex-col md:items-start lg:flex-row lg:items-center"
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
          onClick={e => e.stopPropagation()}
        >
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
