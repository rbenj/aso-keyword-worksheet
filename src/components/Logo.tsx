import { NotebookPen } from 'lucide-react';

import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
}

export function Logo({
  className,
}: LogoProps) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-full bg-orange-500">
        <NotebookPen className="w-5 h-5 text-white" />
      </div>

      <div className="font-semibold text-lg hidden sm:block">
        ASO Keyword Worksheet
      </div>
    </div>
  );
}
