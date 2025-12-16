import * as React from 'react';

import { cn } from '@/lib/utils';

function ActionBox({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="action-box"
      className={cn('flex flex-col justify-center min-h-9 px-3 py-1 text-sm rounded-md border border-dashed text-muted-foreground', className)}
      {...props}
    />
  );
}

export {
  ActionBox,
};
