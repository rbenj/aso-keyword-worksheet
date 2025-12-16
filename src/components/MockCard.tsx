import * as React from 'react';

import { cn } from '@/lib/utils';

function MockCard({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="mock-card"
      className={cn('flex flex-col gap-4', className)}
      {...props}
    />
  );
}

export {
  MockCard,
};
