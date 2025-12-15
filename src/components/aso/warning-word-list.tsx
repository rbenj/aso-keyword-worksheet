import { Badge } from '@/components/ui/badge';
import { DetailBox } from './detail-box';

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
    <DetailBox>
      <h3 className="text-sm font-bold">
        {label}
      </h3>

      {note && (
        <p className="text-sm text-gray-500">
          {note}
        </p>
      )}

      {words && words.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2 pb-1">
          {words.map(word => (
            <Badge
              className="text-sm bg-primary/20 text-primary border-primary"
              key={word}
              variant="outline"
            >
              {word}
            </Badge>
          ))}
        </div>
      )}
    </DetailBox>
  );
}
