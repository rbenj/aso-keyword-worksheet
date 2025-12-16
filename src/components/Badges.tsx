import { Ban, Check, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

import { Badge } from '@/components/ui/badge';

export type BadgeDef = {
  externalLink?: string;
  isOn?: boolean;
  isSecondary?: boolean;
  label: string;
  showIcon?: boolean;
};

function dedupeBadges(badges: BadgeDef[]): BadgeDef[] {
  return [...new Map(
    badges.map(b => [b.label, b]),
  ).values()];
}

function getVariant(badge: BadgeDef): 'default' | 'outline' {
  if (badge.isSecondary) {
    return 'outline';
  }

  return badge.isOn ? 'default' : 'outline';
}

function getContainerColorClassName(badge: BadgeDef): string {
  if (badge.isSecondary) {
    return badge.isOn ? 'bg-primary/20 border-primary text-primary' : 'text-muted-foreground hover:text-foreground';
  }
  return '';
}

function getLinkColorClassName(badge: BadgeDef): string {
  return badge.isOn ? 'text-primary' : 'text-muted-foreground hover:text-foreground';
}

function getIcon(badge: BadgeDef): React.ReactNode {
  return badge.isOn ? <Check /> : <Ban />;
}

interface BadgesProps {
  badges: BadgeDef[];
  className?: string;
}

export function Badges({
  badges,
  className,
}: BadgesProps) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {dedupeBadges(badges).map(badge => (
        <Badge
          className={cn('text-sm', getContainerColorClassName(badge))}
          key={badge.label}
          variant={getVariant(badge)}
        >
          {(badge.externalLink ? (
            <a
              className={cn('flex items-center gap-1', getLinkColorClassName(badge))}
              href={badge.externalLink}
              rel="noopener noreferrer"
              target="_blank"
            >
              {badge.showIcon && getIcon(badge)}
              {badge.label}
              <ExternalLink className="h-3 w-3" />
            </a>
          ) : (
            <>
              {badge.showIcon && getIcon(badge)}
              {badge.label}
            </>
          ))}
        </Badge>
      ))}
    </div>
  );
}
