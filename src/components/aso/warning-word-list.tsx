import { Badge } from '@/components/ui/badge';

interface WarningWordListProps {
  label: string;
  words?: string[];
  note?: string;
}

export function WarningWordList({ label, words, note }: WarningWordListProps) {
  if (words && words.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-dashed border-gray-300 p-2">
      <h3 className="text-sm font-bold">
        {label}
      </h3>

      {note && (
        <p className="text-sm text-gray-500">
          {note}
        </p>
      )}

      {words && words.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {words.map((word) => (
            <Badge key={word} variant="outline" className="bg-gray-200">
              {word}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
