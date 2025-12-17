import { ActionBox } from '@/components/ActionBox';
import { Badges, type BadgeDef } from '@/components/Badges';

export interface IssueProps {
  keywords?: string[];
  label: string;
  text?: string;
}

export function Issue({
  keywords,
  label,
  text,
}: IssueProps) {
  let badges: BadgeDef[] = [];
  if (keywords && keywords.length > 0) {
    badges = keywords.map(keyword => ({
      isOn: true,
      isSecondary: true,
      label: keyword,
    }));
  }

  return (
    <ActionBox>
      <h3 className="text-sm font-bold">
        {label}
      </h3>

      {text && (
        <p className="text-sm text-muted-foreground">
          {text}
        </p>
      )}

      {badges.length > 0 && (
        <Badges
          badges={badges}
          className="pb-1 mt-2"
        />
      )}
    </ActionBox>
  );
}
