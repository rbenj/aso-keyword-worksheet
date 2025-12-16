import { Badges, type BadgeDef } from '@/components/Badges';
import { ActionBox } from '@/components/ActionBox';

interface WarningWordListProps {
  label: string;
  words?: string[];
  note?: string;
}

export function WarningWordList({ label, words, note }: WarningWordListProps) {
  if (!words || words.length === 0) {
    return null;
  }

  const badges: BadgeDef[] = words.map(word => ({
    isOn: true,
    isSecondary: true,
    label: word,
  }));

  return (
    <ActionBox>
      <h3 className="text-sm font-bold">
        {label}
      </h3>

      {note && (
        <p className="text-sm text-gray-500">
          {note}
        </p>
      )}

      <Badges
        badges={badges}
        className="mt-2 pb-1"
      />
    </ActionBox>
  );
}
